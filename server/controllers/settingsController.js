// This file contains the logic for site-wide settings.
// Public endpoint returns non-sensitive settings.
// Admin endpoint returns all settings and allows updates.

const settingsModel = require("../models/settingsModel");

// Public: get storefront settings
async function getPublicSettings(req, res) {
    try {
        const all = await settingsModel.getAll();
        const wilayas = await settingsModel.getWilayas();

        // Only expose settings needed by the storefront
        const publicKeys = [
            "store_name", "store_phone", "store_whatsapp", "store_email",
            "store_address", "instagram_url", "facebook_url",
            "shipping_home", "shipping_desk", "free_threshold",
            "announcement_enabled", "announcement", "announcement_bg",
            "seo_title", "seo_description"
        ];

        const settings = {};
        for (const key of publicKeys) {
            if (all[key] !== undefined) settings[key] = all[key];
        }

        res.status(200).json({ settings, wilayas });

    } catch (error) {
        console.error("Get public settings error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

// Admin: get all settings
async function getAllSettings(req, res) {
    try {
        const settings = await settingsModel.getAll();
        const wilayas = await settingsModel.getWilayas();
        res.status(200).json({ settings, wilayas });

    } catch (error) {
        console.error("Get admin settings error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

// Admin: update settings
async function updateSettings(req, res) {
    try {
        const { settings: updates, wilayas: wilayaUpdates } = req.body;

        const filtered = {};
        if (updates && typeof updates === "object") {
            const allowedKeys = [
                "store_name", "store_phone", "store_whatsapp", "store_email",
                "store_address", "instagram_url", "facebook_url",
                "shipping_home", "shipping_desk", "free_threshold",
                "announcement_enabled", "announcement", "announcement_bg",
                "seo_title", "seo_description"
            ];
            for (const [key, value] of Object.entries(updates)) {
                if (allowedKeys.includes(key)) {
                    filtered[key] = String(value ?? "").trim();
                }
            }
            if (Object.keys(filtered).length > 0) {
                await settingsModel.setBulk(filtered);
            }
        }

        if (Array.isArray(wilayaUpdates) && wilayaUpdates.length > 0) {
            await settingsModel.bulkUpdateWilayas(wilayaUpdates);
        }

        res.status(200).json({
            message: "Paramètres et tarifs de livraison mis à jour avec succès."
        });

    } catch (error) {
        console.error("Update settings error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

async function getWilayas(req, res) {
    try {
        const wilayas = await settingsModel.getWilayas();
        res.status(200).json({ wilayas });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur." });
    }
}

module.exports = {
    getPublicSettings,
    getAllSettings,
    updateSettings,
    getWilayas
};

