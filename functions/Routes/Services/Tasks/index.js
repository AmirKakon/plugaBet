const { db } = require("../../../setup");

const tasksDB = "tasks";

// Get all tasks
const getAllTasks = async () => {
  const snapshot = await db.collection(tasksDB).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get all items of a task
const getTaskItems = async (taskId) => {
  const doc = await db.collection(tasksDB).doc(taskId).get();
  if (!doc.exists) return [];
  const data = doc.data();
  return data.items || [];
};

module.exports = { getAllTasks, getTaskItems };
