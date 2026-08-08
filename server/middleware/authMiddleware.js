// This file contains the authentication middlewares.
// A middleware runs between the route and the controller.
// It checks if the user is logged in and has the required role.

// Check if the user is logged in
function requireAuth(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({
            message: "Vous devez être connecté."
        });
    }

    next();
}

// Check if the logged-in user is a client
function requireClient(req, res, next) {
    if (req.session.user.role !== "client") {
        return res.status(403).json({
            message: "Accès refusé. Rôle client requis."
        });
    }

    next();
}

// Check if the logged-in user is an administrator (admin or super_admin)
function requireAdmin(req, res, next) {
    if (req.session.user.role !== "admin" && req.session.user.role !== "super_admin") {
        return res.status(403).json({
            message: "Accès refusé. Rôle administrateur requis."
        });
    }

    next();
}

// Check if the logged-in user is a super administrator
function requireSuperAdmin(req, res, next) {
    if (req.session.user.role !== "super_admin") {
        return res.status(403).json({
            message: "Accès refusé. Rôle super administrateur requis."
        });
    }

    next();
}

module.exports = {
    requireAuth,
    requireClient,
    requireAdmin,
    requireSuperAdmin
};
