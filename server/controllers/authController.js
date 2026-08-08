// This file contains the logic for authentication.
// It handles registration, login, logout, profile management,
// password change, and email change.

const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const userModel = require("../models/userModel");

// Register a new user
async function register(req, res) {
    try {
        const { firstName, lastName, email, password, phone } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                message: "Tous les champs obligatoires doivent être remplis."
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Adresse e-mail invalide."
            });
        }

        // Password strength
        if (password.length < 8) {
            return res.status(400).json({
                message: "Le mot de passe doit contenir au moins 8 caractères."
            });
        }

        const existingUser = await userModel.findUserByEmail(email);

        if (existingUser) {
            return res.status(400).json({
                message: "Un compte avec cet e-mail existe déjà."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await userModel.createUser(
            firstName.trim(),
            lastName.trim(),
            email.toLowerCase().trim(),
            hashedPassword,
            "client",
            phone
        );

        res.status(201).json({
            message: "Compte créé avec succès."
        });

    } catch (error) {
        console.error("Registration error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

// Log in a user
async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Veuillez remplir tous les champs."
            });
        }

        const user = await userModel.findUserByEmail(email.toLowerCase().trim());

        if (!user) {
            return res.status(400).json({
                message: "E-mail ou mot de passe incorrect."
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({
                message: "E-mail ou mot de passe incorrect."
            });
        }

        if (user.account_status === "blocked") {
            return res.status(403).json({
                message: "Votre compte a été bloqué.",
                reason: user.block_reason
            });
        }

        req.session.user = {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            phone: user.phone || null,
            role: user.role
        };

        res.status(200).json({
            message: "Connexion réussie.",
            user: req.session.user
        });

    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

// Log out the current user
function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                message: "Erreur lors de la déconnexion."
            });
        }

        res.clearCookie("connect.sid");

        res.status(200).json({
            message: "Déconnexion réussie."
        });
    });
}

// Get the currently logged-in user
function currentUser(req, res) {
    if (!req.session.user) {
        return res.status(401).json({
            message: "Aucun utilisateur connecté."
        });
    }

    res.status(200).json({
        user: req.session.user
    });
}

// Get full profile of the logged-in user
async function getProfile(req, res) {
    try {
        const user = await userModel.findUserById(req.session.user.id);

        if (!user) {
            return res.status(404).json({
                message: "Utilisateur introuvable."
            });
        }

        res.status(200).json({
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                role: user.role,
                phone: user.phone || null,
                profilePhoto: user.profile_photo || null
            }
        });

    } catch (error) {
        console.error("Get profile error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

// Update user profile
async function updateProfile(req, res) {
    try {
        const firstName = String(req.body.firstName || "").trim();
        const lastName = String(req.body.lastName || "").trim();
        const phone = String(req.body.phone || "").trim();

        if (!firstName || !lastName) {
            return res.status(400).json({
                message: "Le prénom et le nom sont obligatoires."
            });
        }

        await userModel.updateProfile(req.session.user.id, firstName, lastName, phone || null);

        // Update session data
        req.session.user.firstName = firstName;
        req.session.user.lastName = lastName;
        req.session.user.phone = phone || null;

        res.status(200).json({
            message: "Profil mis à jour avec succès."
        });

    } catch (error) {
        console.error("Update profile error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

// Update profile photo
async function updatePhoto(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Aucun fichier image n'a été fourni." });
        }

        const photoPath = "/uploads/" + req.file.filename;

        const user = await userModel.findUserById(req.session.user.id);
        if (user && user.profile_photo) {
            const oldFilePath = path.join(__dirname, "../../client/public", user.profile_photo);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        await userModel.updateProfilePhoto(req.session.user.id, photoPath);
        req.session.user.profilePhoto = photoPath;

        res.status(200).json({
            message: "Photo mise à jour avec succès.",
            user: req.session.user
        });
    } catch (error) {
        console.error("Update photo error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

// Remove profile photo
async function removePhoto(req, res) {
    try {
        const user = await userModel.findUserById(req.session.user.id);

        if (!user || !user.profile_photo) {
            return res.status(400).json({ message: "Aucune photo de profil à supprimer." });
        }

        const filePath = path.join(__dirname, "../../client/public", user.profile_photo);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await userModel.removeProfilePhoto(req.session.user.id);
        req.session.user.profilePhoto = null;

        res.status(200).json({
            message: "Photo supprimée avec succès.",
            user: req.session.user
        });
    } catch (error) {
        console.error("Remove photo error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

// Change password
async function changePassword(req, res) {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Veuillez remplir tous les champs."
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                message: "Le nouveau mot de passe doit contenir au moins 8 caractères."
            });
        }

        const user = await userModel.findUserByIdWithPassword(req.session.user.id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }

        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) {
            return res.status(400).json({
                message: "Le mot de passe actuel est incorrect."
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await userModel.updatePassword(req.session.user.id, hashedPassword);

        res.status(200).json({
            message: "Mot de passe modifié avec succès."
        });

    } catch (error) {
        console.error("Change password error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

// Change email
async function changeEmail(req, res) {
    try {
        const { newEmail, password } = req.body;

        if (!newEmail || !password) {
            return res.status(400).json({
                message: "Veuillez remplir tous les champs."
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
            return res.status(400).json({
                message: "Adresse e-mail invalide."
            });
        }

        const user = await userModel.findUserByIdWithPassword(req.session.user.id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                message: "Mot de passe incorrect."
            });
        }

        // Check if email already exists
        const existing = await userModel.findUserByEmail(newEmail.toLowerCase().trim());
        if (existing && existing.id !== user.id) {
            return res.status(400).json({
                message: "Un compte avec cet e-mail existe déjà."
            });
        }

        await userModel.updateEmail(req.session.user.id, newEmail.toLowerCase().trim());

        // Update session
        req.session.user.email = newEmail.toLowerCase().trim();

        res.status(200).json({
            message: "Adresse e-mail modifiée avec succès."
        });

    } catch (error) {
        console.error("Change email error:", error.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

module.exports = {
    register,
    login,
    logout,
    currentUser,
    getProfile,
    updateProfile,
    updatePhoto,
    removePhoto,
    changePassword,
    changeEmail
};
