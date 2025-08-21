const { app } = require("../../../setup");
const { createAttendanceRecord } = require("../../Services/Attendance");

// Create a new attendance record
app.post("/api/attendance", async (req, res) => {
    try {
        const attendanceData = req.body;
        const result = await createAttendanceRecord(attendanceData);
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send({ error: "Failed to create attendance record" });
    }
});
