const express=require("express");
const router=express.Router();

const middleware=require("../middleware/cart.middleware");
const controller=require("../controller/cart.controller");

router.post("/add",middleware.findUser,middleware.findProduct,middleware.verifyQuan,controller.addProdcut);
router.get("/",middleware.findUser,controller.getCart);
router.patch("/delete",middleware.findUser,controller.deleteProduct);
router.delete("/delete",middleware.findUser,controller.deleteCart);
router.get("/amount",middleware.findUser,controller.amount);

module.exports=router;