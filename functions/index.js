const { app, functions } = require("./setup");

// app routes
require("./Routes/Controllers/Auth");
require("./Routes/Controllers/Coupons");

// Export the main app
exports.app = functions.https.onRequest(app);