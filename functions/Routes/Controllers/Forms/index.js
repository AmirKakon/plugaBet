const { app } = require("../../../setup");
const { createForm, getAllForms, getFormById } = require("../../Services/Forms");

// Create a new equipment form
app.post("/api/forms", async (req, res) => {
    try {
        const formData = req.body;
        const result = await createForm(formData);
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send({ error: "Failed to create form" });
    }
});

// Get all forms (optionally filtered)
app.get("/api/forms", async (req, res) => {
    try {
        const forms = await getAllForms();
        res.status(200).send({ forms });
    } catch (error) {
        res.status(500).send({ error: "Failed to fetch forms" });
    }
});

// Get a specific form by ID
app.get("/api/forms/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const form = await getFormById(id);
        if (!form) return res.status(404).send({ error: "Form not found" });
        res.status(200).send({ form });
    } catch (error) {
        res.status(500).send({ error: "Failed to fetch form" });
    }
});
