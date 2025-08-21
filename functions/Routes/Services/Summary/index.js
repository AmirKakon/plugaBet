const { db } = require("../../../setup");

const formsDB = "forms";

// Get summarized equipment history data
const getSummary = async () => {
  // Example: Aggregate all forms and items
  const snapshot = await db.collection(formsDB).get();
  const forms = snapshot.docs.map(doc => doc.data());
  // Aggregate summary logic here (customize as needed)
  let summary = {
    totalForms: forms.length,
    items: {}
  };
  forms.forEach(form => {
    if (form.items) {
      form.items.forEach(item => {
        if (!summary.items[item.name]) {
          summary.items[item.name] = 0;
        }
        summary.items[item.name] += item.quantity || 0;
      });
    }
  });
  return summary;
};

module.exports = { getSummary };
