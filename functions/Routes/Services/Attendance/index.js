const { db } = require("../../../setup");

const attendanceDB = "attendance";

// Create a new attendance record
const createAttendanceRecord = async (attendanceData) => {
  const docRef = await db.collection(attendanceDB).add(attendanceData);
  return { attendanceId: docRef.id };
};

module.exports = { createAttendanceRecord };
