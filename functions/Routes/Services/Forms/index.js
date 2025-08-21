const { db } = require("../../../setup");

const formsDB = "forms";

// Create a new equipment form
const createForm = async (formData) => {
  const docRef = await db.collection(formsDB).add(formData);
  return { formId: docRef.id };
};

// Get all forms (optionally filtered)
const getAllForms = async (query = {}) => {
  let ref = db.collection(formsDB);
  // Add query filters here if needed
  const snapshot = await ref.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get a specific form by ID
const getFormById = async (id) => {
  const doc = await db.collection(formsDB).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

module.exports = { createForm, getAllForms, getFormById };
