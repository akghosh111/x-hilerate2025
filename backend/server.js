const dotenv = require('dotenv');
const express = require('express');
const PDFDocument = require('pdfkit');
const qr = require('qrcode');
const crypto = require('crypto');
const { z } = require('zod');
const jwt = require('jsonwebtoken');

dotenv.config({ path: './.env' });

const app = express();

app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;
//console.log(JWT_SECRET)
const tickets = new Map();
const admins = new Map();

function registerAdmin(username, password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    admins.set(username, { salt, hashedPassword });
}

// Register an admin (do this once during setup)
registerAdmin('admin', 'adminpassword');

const loginSchema = z.object({
    username: z.string().nonempty("Username is required"),
    password: z.string().nonempty("Password is required")
});

function authenticateAdmin(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}

app.post('/admin/login', (req, res) => {
    try {
        const { username, password } = loginSchema.parse(req.body);
        const admin = admins.get(username);

        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const hashedPassword = crypto.pbkdf2Sync(password, admin.salt, 1000, 64, 'sha512').toString('hex');
        
        if (hashedPassword !== admin.hashedPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const ticketSchema = z.object({
    name: z.string().nonempty("Name is required"),
    email: z.string().email("Invalid email format"),
    ticketType: z.string().nonempty("Ticket type is required"),
});

function generateTicketId() {
    return crypto.randomBytes(8).toString('hex');
}

app.post('/tickets', async (req, res) => {
    try {
        const { name, email, ticketType } = ticketSchema.parse(req.body);

        const ticketId = generateTicketId();
        const ticket = {
            id: ticketId,
            name,
            email,
            ticketType,
            purchaseDate: new Date(),
            used: false,
        };

        tickets.set(ticketId, ticket);
        res.json({ ticketId, downloadUrl: `/tickets/${ticketId}/download` });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/tickets/:id/download', async (req, res) => {
    const ticket = tickets.get(req.params.id);

    if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
    }

    const qrCode = await qr.toDataURL(JSON.stringify({
        ticketId: ticket.id,
        name: ticket.name,
        ticketType: ticket.ticketType,
    }));

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ticket-${ticket.id}.pdf`);

    doc.pipe(res);

    doc.fontSize(25).text('X-hilerate 2k25', { align: 'center' });
    doc.moveDown();
    doc.fontSize(15).text(`Ticket ID: ${ticket.id}`);
    doc.text(`Name: ${ticket.name}`);
    doc.text(`Ticket Type: ${ticket.ticketType}`);
    doc.text(`Purchase Date: ${ticket.purchaseDate.toLocaleDateString()}`);

    doc.image(qrCode, {
        fit: [250, 250],
        align: 'center',
    });

    doc.end();
});


app.post('/tickets/:id/verify', authenticateAdmin, (req, res) => {
    const ticket = tickets.get(req.params.id);

    if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
    }

    if (ticket.used) {
        return res.status(400).json({ error: 'Ticket already used' });
    }

    ticket.used = true;
    res.json({ status: 'valid', ticket });
});

// Admin-only routes for additional management
app.get('/admin/tickets', authenticateAdmin, (req, res) => {
    res.json(Array.from(tickets.values()));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));