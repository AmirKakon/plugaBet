const { db, logger } = require("../../../setup");

const couponsDB = "coupons";

// Create a coupon
const createCoupon = async (couponData) => {
  let itemRef = null;

  if (couponData.id) {
    await db
      .collection(couponsDB)
      .doc(String(couponData.id))
      .set(couponData);
    itemRef = db.collection(couponsDB).doc(String(couponData.id));
  } else {
    itemRef = await db.collection(couponsDB).add(couponData);
  }

  return {
    couponId: itemRef.id,
  };
};

// Get a single coupon
const getCoupon = async (id) => {
  const doc = await db.collection(couponsDB).doc(id).get();

  if (!doc.exists) {
    throw new NotFoundError(`No coupon found with id: ${id}`);
  }

  return { id: doc.id, ...doc.data() };
};

// Get all coupons
const getAllCoupons = async () => {
  const snapshot = await db.collection(couponsDB).get();

  if (snapshot.empty) {
    logger.info("Get all coupons | No coupons found");
    return { coupons: [] };
  }

  return {
    coupons: snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => a.title.localeCompare(b.title)),
  };
};

// Update a coupon
const updateCoupon = async (couponData) => {
  try {
    await db.collection(couponsDB).doc(couponData.id).update(couponData);
    return true;
  } catch (error) {
    logger.error(`Failed to update coupon: ${couponData.id}`, error);
    return false;
  }
};

// Delete a coupon
const deleteCoupon = async (id) => {
  try {
    const batch = db.batch();

    const docRef = db.collection(couponsDB).doc(id);
    if (!(await docRef.get()).exists) {
      throw new NotFoundError("Coupon not found");
    }

    batch.delete(docRef);
    await batch.commit();

    return true;
  } catch (error) {
    logger.error(`Failed to delete coupon: ${id}`, error);
    return false;
  }
};

module.exports = {
  createCoupon,
  getCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
};