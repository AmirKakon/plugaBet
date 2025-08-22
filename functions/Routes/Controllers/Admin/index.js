const { app } = require("../../../setup");
const axios = require("axios");
const { db } = require("../../../setup");

// POST /api/admin/copy-database
// Copies all collections from source to target database
app.post("/api/admin/copy-database", async (req, res) => {
  const { sourceBaseUrl, targetBaseUrl } = req.body;
  if (!sourceBaseUrl || !targetBaseUrl) {
    return res.status(400).send({ error: "Missing sourceBaseUrl or targetBaseUrl" });
  }
  try {
    // Example: Copy 'tasks' collection
    const collections = ["tasks"];
    for (const collection of collections) {
      // Fetch all documents from source
      const sourceResp = await axios.get(`${sourceBaseUrl}/api/${collection}`);
      const docs = sourceResp.data[collection] || sourceResp.data["forms"] || sourceResp.data["tasks"] || [];
      // Write each document to target
      for (const doc of docs) {
        const docId = doc.id || undefined;
        const targetRef = db.collection(collection);
        if (docId) {
          await targetRef.doc(docId).set(doc);
        } else {
          await targetRef.add(doc);
        }
      }
    }
    res.status(200).send({ status: "Success" });
  } catch (error) {
    console.error("Error copying database:", error);
    res.status(500).send({ error: "Failed to copy database" });
  }
});
