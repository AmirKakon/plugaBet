const { app } = require("../../../setup");
const CouponService = require("../../Services/Coupons");

// Create a coupon
app.post("/api/coupons/create", async (req, res) => {
    try {
        const couponData = req.body;
    
        // Basic validation (you might want more robust validation)
        if (!couponData.title || !couponData.amount || !couponData.redirectUrl || !couponData.dateAdded) {
          return res.status(400).send("Missing or invalid required fields");
        }
        const result = await CouponService.createCoupon(couponData);
    
        res.status(200).send({ id: result.couponId });
      } catch (error) {
        console.error("Error adding coupon:", error);
        res.status(500).send("Error adding coupon");
      }
});

// Get a single coupon
app.get("/api/coupons/get/:id",  async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
        return res.status(400).send("Missing or invalid required fields");
      }
    const coupon = await CouponService.getCoupon(id);

    return res.status(200).send({ status: "Success", data: coupon });
  } catch (error) {
    console.error("Error getting coupon:", error);
    res.status(500).send("Error getting coupon");
  }
});

// Get all coupons
app.get("/api/coupons/getAll",  async (req, res) => {
  try {
    const coupons = await CouponService.getAllCoupons();

    return res.status(200).send({
      status: "Success",
      data: coupons,
    });
  } catch (error) {
    console.error("Error getting all coupons:", error);
    res.status(500).send("Error getting all coupons");
  }
});

// Update a coupon
app.put("/api/coupons/update/:id",  async (req, res) => {
  try {
    const couponData = req.body;
    const id = req.params.id;
    
    // Basic validation (you might want more robust validation)
    if (!id || !couponData.title || !couponData.amount || !couponData.redirectUrl || !couponData.dateAdded) {
        return res.status(400).send("Missing or invalid required fields");
    }

    const updated = await CouponService.updateCoupon({id, ...couponData});
    return updated ?
      res.status(200).send({ status: "Success", msg: "Coupon Updated" }) :
      res
        .status(400)
        .send({ status: "Failed", msg: "Coupon failed to updated" });
      } catch (error) {
        console.error("Error updating coupon:", error);
        res.status(500).send("Error updating coupon");
      }
});

// Delete a coupon
app.delete("/api/coupons/delete/:id",  async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
        return res.status(400).send("Missing or invalid required fields");
    }

    const deleted = await CouponService.deleteCoupon(id);
    return deleted ?
      res.status(200).send({ status: "Success", msg: "Coupon Deleted" }) :
      res
        .status(400)
        .send({ status: "Failed", msg: "Coupon failed to delete" });
      } catch (error) {
        console.error("Error deleting coupon:", error);
        res.status(500).send("Error deleting coupon");
      }
});

module.exports = { app };