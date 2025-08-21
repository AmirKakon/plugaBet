const { app, functions } = require("./setup");

// app routes
require("./Routes/Controllers/Auth");
require("./Routes/Controllers/Forms");
require("./Routes/Controllers/Tasks");
require("./Routes/Controllers/Summary");

// Export the main app
exports.app = functions.https.onRequest(app);