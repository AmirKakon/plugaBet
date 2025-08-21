const { app } = require("../../../setup");
const { getAllTasks, getTaskItems } = require("../../Services/Tasks");

// Get all tasks
app.get("/api/tasks", async (req, res) => {
    try {
        const tasks = await getAllTasks();
        res.status(200).send({ tasks });
    } catch (error) {
        res.status(500).send({ error: "Failed to fetch tasks" });
    }
});

// Get all items of a task
app.get("/api/tasks/:taskId/items", async (req, res) => {
    const { taskId } = req.params;
    try {
        const items = await getTaskItems(taskId);
        res.status(200).send({ items });
    } catch (error) {
        res.status(500).send({ error: "Failed to fetch items" });
    }
});
