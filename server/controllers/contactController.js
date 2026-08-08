// ============================================================
// CONTACTCONTROLLER.JS — Contact Form & Admin Message Management
// Velora Jewelry Boutique — 2026
// ============================================================

const contactModel = require("../models/contactModel");

// Public: Submit contact message
async function submitContactForm(req, res) {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || name.trim().length < 2) {
            return res.status(400).json({ message: "Le nom complet est obligatoire (min 2 caractères)." });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email.trim())) {
            return res.status(400).json({ message: "Une adresse e-mail valide est obligatoire." });
        }

        if (!phone || phone.trim().length < 8) {
            return res.status(400).json({ message: "Un numéro de téléphone valide est obligatoire (min 8 chiffres)." });
        }

        if (!message || message.trim().length < 5) {
            return res.status(400).json({ message: "Votre message doit contenir au moins 5 caractères." });
        }

        const messageId = await contactModel.createMessage({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            subject: (subject || "Question sur un bijou").trim(),
            message: message.trim()
        });

        return res.status(201).json({
            message: "Votre message a été transmis avec succès au service client Velora.",
            messageId
        });

    } catch (error) {
        console.error("Error submitting contact form:", error);
        return res.status(500).json({ message: "Une erreur interne est survenue lors de l'envoi du message." });
    }
}

// Admin: Get single message by ID
async function getMessageById(req, res) {
    try {
        const { id } = req.params;
        const msg = await contactModel.getMessageById(id);

        if (!msg) {
            return res.status(404).json({ message: "Message introuvable." });
        }

        return res.json({ message: msg });

    } catch (error) {
        console.error("Error fetching message by id:", error);
        return res.status(500).json({ message: "Erreur lors de la récupération du message." });
    }
}

// Admin: Get list of messages
async function getAllMessages(req, res) {
    try {
        const { status, search, limit, offset } = req.query;
        const data = await contactModel.getMessages({
            status,
            search,
            limit: limit ? parseInt(limit, 10) : 20,
            offset: offset ? parseInt(offset, 10) : 0
        });

        const unreadCount = await contactModel.getUnreadCount();

        return res.json({
            messages: data.messages,
            total: data.total,
            unreadCount
        });

    } catch (error) {
        console.error("Error fetching admin messages:", error);
        return res.status(500).json({ message: "Erreur lors de la récupération des messages." });
    }
}

// Admin: Update message status (e.g., mark as read/unread/archived)
async function updateStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = ["unread", "read", "archived"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Statut invalide." });
        }

        const updated = await contactModel.updateMessageStatus(id, status);
        if (!updated) {
            return res.status(404).json({ message: "Message introuvable." });
        }

        const unreadCount = await contactModel.getUnreadCount();

        return res.json({ message: "Statut mis à jour avec succès.", unreadCount });

    } catch (error) {
        console.error("Error updating message status:", error);
        return res.status(500).json({ message: "Erreur lors de la mise à jour du statut." });
    }
}

// Admin: Delete a message
async function deleteMessage(req, res) {
    try {
        const { id } = req.params;
        const deleted = await contactModel.deleteMessage(id);

        if (!deleted) {
            return res.status(404).json({ message: "Message introuvable." });
        }

        const unreadCount = await contactModel.getUnreadCount();

        return res.json({ message: "Message supprimé avec succès.", unreadCount });

    } catch (error) {
        console.error("Error deleting message:", error);
        return res.status(500).json({ message: "Erreur lors de la suppression du message." });
    }
}

module.exports = {
    submitContactForm,
    getAllMessages,
    getMessageById,
    updateStatus,
    deleteMessage
};
