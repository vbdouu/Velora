// Upload middleware using Multer.
// Validates both MIME type and file extension to prevent file type spoofing.
// Stores uploaded files in client/public/uploads/.

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../../client/public/uploads");

// Ensure base upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname).toLowerCase();
        const filename = file.fieldname + "-" + Date.now() + "-" + Math.round(Math.random() * 1000) + extension;
        cb(null, filename);
    }
});

// Allowed MIME types and their corresponding safe extensions
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

// Filter: validate both MIME type AND file extension to prevent spoofing
function imageFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const isMimeAllowed = ALLOWED_MIME_TYPES.includes(file.mimetype);
    const isExtAllowed = ALLOWED_EXTENSIONS.includes(ext);

    if (isMimeAllowed && isExtAllowed) {
        cb(null, true);
    } else {
        cb(new Error(
            `Format de fichier non autorisé. Extensions acceptées : ${ALLOWED_EXTENSIONS.join(", ")}.`
        ));
    }
}

const upload = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
});

module.exports = upload;
