const dotenv = require('dotenv');
const express = require('express');
const PDFDocument = require('pdfkit');
const qr = require('qrcode');
const crypto = require('crypto');
const { z } = require('zod');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');
const redis = require('redis');
const { promisify } = require('util');

dotenv.config({ path: './.env' });

const app = express();
app.use(express.json());

app.use(cors());

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
});

const setAsync = promisify(redisClient.set).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

async function blacklistToken(token, expiresIn = 3600) {
    await setAsync(`bl_${token}`, 'true', 'EX', expiresIn);
}

// Check if token is blacklisted
async function isTokenBlacklisted(token) {
    const result = await getAsync(`bl_${token}`);
    return result === 'true';
}

// Mongoose Schemas
const TicketSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    ticketType: { type: String, required: true },
    purchaseDate: { type: Date, default: Date.now },
    used: { type: Boolean, default: false }
});

const AdminSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    salt: { type: String, required: true },
    hashedPassword: { type: String, required: true }
});

const Ticket = mongoose.model('Ticket', TicketSchema);
const Admin = mongoose.model('Admin', AdminSchema);


mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const JWT_SECRET = process.env.JWT_SECRET;





async function authenticateAdmin(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        // Check if token is blacklisted
        if (await isTokenBlacklisted(token)) {
            return res.status(401).json({ error: 'Token is no longer valid' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const admin = await Admin.findOne({ username: decoded.username });
        
        if (!admin) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        req.admin = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}



app.post('/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });

        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const hashedPassword = crypto.pbkdf2Sync(
            password, 
            admin.salt, 
            1000, 
            64, 
            'sha512'
        ).toString('hex');
        
        if (hashedPassword !== admin.hashedPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/admin/logout', authenticateAdmin, async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    try {
        // Blacklist token for 1 hour
        await blacklistToken(token);
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Logout failed' });
    }
});

// Redis Connection Error Handling
redisClient.on('error', (err) => {
    console.error('Redis Error:', err);
});

app.post('/tickets', async (req, res) => {
    try {
        const { name, email, ticketType } = req.body;
        const ticketId = crypto.randomBytes(8).toString('hex');

        const ticket = new Ticket({
            id: ticketId,
            name,
            email,
            ticketType
        });

        await ticket.save();
        res.json({ 
            ticketId, 
            downloadUrl: `/tickets/${ticketId}/download` 
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/tickets/:id/verify', authenticateAdmin, async (req, res) => {
    try {
        const ticket = await Ticket.findOne({ id: req.params.id });

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        if (ticket.used) {
            return res.status(400).json({ error: 'Ticket already used' });
        }

        ticket.used = true;
        await ticket.save();
        res.json({ status: 'valid', ticket });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/tickets/:id/download', async (req, res) => {
    const ticket = await Ticket.findOne({ id: req.params.id });

    if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
    }

    const qrCode = await qr.toDataURL(JSON.stringify({
        ticketId: ticket.id,
        name: ticket.name,
        ticketType: ticket.ticketType,
    }));

    const doc = new PDFDocument({
        layout: 'portrait',
        size: 'A4',
        margins: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
        }
    });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ticket-${ticket.id}.pdf`);

    doc.pipe(res);

    // Background color
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#F0F4F8');

    // Header
    doc.fillColor('#1A365D')
       .font('Helvetica-Bold')
       .fontSize(30)
       .text('X-hilerate 2k25', { align: 'center' });

    // Decorative line
    doc.strokeColor('#4299E1')
       .lineWidth(2)
       .moveTo(50, 100)
       .lineTo(doc.page.width - 50, 100)
       .stroke();

    // Ticket Details
    doc.fillColor('#2D3748')
       .font('Helvetica')
       .fontSize(16)
       .moveDown(2)
       .text(`Ticket ID: ${ticket.id}`, { align: 'center' })
       .text(`Name: ${ticket.name}`, { align: 'center' })
       .text(`Ticket Type: ${ticket.ticketType}`, { align: 'center' })
       .text(`Purchase Date: ${ticket.purchaseDate.toLocaleDateString()}`, { align: 'center' });

    // QR Code
    const qrCodeImg = Buffer.from(qrCode.split(',')[1], 'base64');
    doc.image(qrCodeImg, doc.page.width / 2 - 100, doc.page.height / 2 - 100, {
        width: 200,
        height: 200,
        align: 'center'
    });

    // Footer
    doc.fontSize(10)
       .fillColor('#718096')
       .text('This ticket is non-transferable', doc.page.width / 2 - 100, doc.page.height - 100, {
           width: 200,
           align: 'center'
       });

    doc.end();
});


app.get('/admin/ticket-stats', authenticateAdmin, async (req, res) => {
    try {
        const totalTickets = await Ticket.countDocuments();
        const usedTickets = await Ticket.countDocuments({ used: true });
        const unusedTickets = await Ticket.countDocuments({ used: false });
        

        res.json({
            totalTickets,
            usedTickets,
            unusedTickets,
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve ticket stats" });
    }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    
    console.log(`Server running on port ${PORT}`);
});