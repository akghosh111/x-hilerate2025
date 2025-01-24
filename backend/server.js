const express = require('express');
const PDFDocument = require('pdfkit');
const qr = require('qrcode');
const crypto = require('crypto');
const { z } = require('zod');
const app = express();

app.use(express.json());

const tickets = new Map();

function generateTicketId() {
    return crypto.randomBytes(8).toString('hex');
}

const ticketSchema = z.object({
    name: z.string().nonempty("Name is required"),
    email: z.string().email("Invalid email format"),
    ticketType: z.string().nonempty("Ticket type is required"),
});

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

app.post('/tickets/:id/verify', (req, res) => {
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
