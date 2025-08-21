const { app } = require("../../../setup");
const { getSummary } = require("../../Services/Summary");

// Get summarized equipment history data
app.get("/api/summary", async (req, res) => {
    try {
        const summary = await getSummary();
        res.status(200).send({ summary });
    } catch (error) {
        res.status(500).send({ error: "Failed to fetch summary" });
    }
});
