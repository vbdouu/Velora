// This file is the server entry point.
// It imports the Express application from app.js
// and starts the server on the configured port.

const app = require("./app");
const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
});
