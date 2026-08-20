const productModel = require("../models/product.model");
const axios = require("axios");

async function addProduct(req, res) {
  const id = req.id;
  const role = req.role;
  if (role !== "SELLER" && role !== "ADMIN")
    return res
      .status(403)
      .json({ message: "!! user not have access for this api call !!" });

  const { name, price, stock, category } = req.body || {};
  if (!name || !price || !stock || !category)
    return res
      .status(400)
      .json({ message: "!! provide all details to add product !!" });

  const temp = await productModel.findOne({ user: id, name });
  if (temp)
    return res.status(409).json({
      message: "!! same name product is already registered by the user !!",
    });

  const product = await productModel.create({
    user: id,
    name,
    price,
    stock,
    category,
  });
  res.status(201).json({
    message: "!! product added !!",
    product,
  });
}

async function deleteProduct(req, res) {
  const { name } = req.body;
  const user = req.id;
  const product = await productModel.findOneAndDelete({ user: user, name });
  if (!product) res.status(400).send("!! no product to delete");
  else res.status(200).send("!! product is deleted");
}

async function findProductByname(req, res) {
  const name = req.params.name;
  const products = await productModel.find({ name });
  const detail = await Promise.all(
    products.map(async (product) => {
      const response = await axios.get(
        `http://localhost:3000/auth/getuser/${product.user}`,
      );
      return { product, user: response.data };
    }),
  );
  res.status(200).send(detail);
}

async function findProductBycategory(req, res) {
  const category = req.params.category;
  const products = await productModel.find({
    category: {
      $in: category,
    },
  });
  const detail = await Promise.all(
    products.map(async (product) => {
      const response = await axios.get(
        `http://localhost:3000/auth/getuser/${product.user}`,
      );
      return { product, user: response.data };
    }),
  );
  res.status(200).send(detail);
}

async function update(req, res) {
  const prod_id = req.params.id;
  const id = req.id;
  const { name, price, stock, category } = req.body || {};
  const product = await productModel.findOne({ user: id, _id: prod_id });
  if (name) product.name = name;
  if (price) product.price = price;
  if (category) product.category = category;
  if (stock) product.stock = stock;
  await product.save();
  return res.status(200).send(product);
}

async function findProductByuser(req, res) {
  const id = req.params.id;
  const products = await productModel.find({ user: id });
  res.status(200).send(products);
}

async function product(req,res) {
    const id=req.params.id;
    const product=await productModel.findOne({_id:id});
    if(!product) return res.status(400).json({valid:"false",message:"!! no product found !! "});
    res.status(200).json({valid:"true",product});
}

async function products(req,res) {
    const product=await productModel.find();
    if(product.length==0) return res.status(200).send("!! no product found");
    res.status(200).send(product);
}

async function getStock(req,res){
    const id=req.params.id;
    const product=await productModel.findOne({_id:id});
    if(!product) return res.status(400).json({valid:"false"});
    res.status(200).json({valid:"true",stock:product.stock});
}

async function updateStock(req,res) {
    const id=req.id;
    const stock=req.body?.stock;
    if(stock<0) return res.status(400).send("invalid request");
    const prod_id=req.params.id;
    const product=await productModel.findOne({_id:prod_id});
    if(!product) return res.status(400).json({message:"!! no product found !!"});
    if(product.user.toString()!==id.toString()) return res.status(400).json({message:"!! user don not have permission for this call !!"});
    product.stock=stock;
    await product.save();
    res.status(201).send("stock updated");
}



module.exports = {
  addProduct,
  deleteProduct,
  findProductByname,
  findProductBycategory,
  findProductByuser,
  update,
  product,
  products,
  getStock,
  updateStock
};
