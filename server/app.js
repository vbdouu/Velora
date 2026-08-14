// This file configures the Express application.
// It sets up middlewares, static files, sessions, routes and error handling.
// The server is started separately in server.js.

require("dotenv").config();

// Validate required environment variables before anything else
if (!process.env.SESSION_SECRET) {
    throw new Error(
        "FATAL: SESSION_SECRET is not defined in environment variables. " +
        "Please add SESSION_SECRET to your .env file before starting the server."
    );
}

const express = require("express");
const session = require("express-session");
const path = require("path");
const rateLimit = require("express-rate-limit");
require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const adminRoutes = require("./routes/adminRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

// Faire confiance au reverse proxy (Render, Heroku, etc.) pour récupérer la bonne IP client
app.set("trust proxy", 1);

// ── Rate Limiters ──

// Brute-force protection on login: max 10 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes."
    }
});

// Spam protection on contact form: max 10 submissions per hour per IP
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Trop de messages envoyés. Veuillez réessayer dans une heure."
    }
});

// ── Middlewares ──
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/public")));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 2 // 2 hours
    }
}));

// ── API routes ──
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/settings", settingsRoutes);

// Apply rate limiters on sensitive routes
app.use("/api/contact", contactLimiter, contactRoutes);
app.use("/api/auth/login", loginLimiter);

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/public/index.html"));
});

// 404 handler for unknown routes
// — API routes always respond with JSON
// — HTML routes serve the custom 404 page
app.use((req, res) => {
    if (req.path.startsWith("/api/")) {
        return res.status(404).json({ message: "Route not found." });
    }
    res.status(404).sendFile(path.join(__dirname, "../client/public/404.html"));
});

module.exports = app;
