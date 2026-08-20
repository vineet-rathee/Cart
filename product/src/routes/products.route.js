const express=require("express");
const router=express();

const controller=require("../controllers/product.controller");
const middleware=require("../middleware/product.middleware");

// seller/admin routes
router.post("/add",middleware.getUser,controller.addProduct);
router.post("/delete",middleware.getUser,controller.deleteProduct);
router.patch("/update/:id",middleware.verifytoken,controller.update);
router.patch("/products/:id/stock",middleware.verifytoken,controller.updateStock);

//general routes
router.get("/findProduct/name/:name",controller.findProductByname);
router.get("/findProduct/category/:category",controller.findProductBycategory);
router.get("/findProduct/user/:id",controller.findProductByuser)
router.get("/products/:id",controller.product);
router.get("/products",controller.products);
router.get("/products/:id/stock",controller.getStock);

module.exports=router;