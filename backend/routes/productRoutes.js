const express = require('express');
const router = express.Router();
const cloudinary = require("cloudinary");
var mongoose = require('mongoose');

const Product = require('../db/models/productModel.js');

const errorHandler = require('../utils/errorHandler.js');
const ApiFeatures = require('../utils/apiFeatures.js');

const asyncError = require('../middlewares/asyncErrors.js');
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth.js");

router.route('/products').get(asyncError(async (req, res) => {
  const resultPerPage = 12;
  const productsCount = await Product.countDocuments();

  const sort = req.query["sort"];
  delete req.query["sort"];

  const apiFeature = new ApiFeatures(Product.find(), Product.find(), req.query, sort)
    .search()
    .filter();
  
  let products = await apiFeature.queryCopy;
  let filteredProductsCount = products.length;
  apiFeature.pagination(resultPerPage);
  products = await apiFeature.query;

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
    page: Number(req.query.page),
  });
}));

router.route('/featured').get(asyncError(async (req, res) => {
  let products = await Product.find({ featured: 1 }).limit(8);

  res.status(200).json({
    success: true,
    products
  });
}));

router.route('/random').get(asyncError(async (req, res) => {
  let products = await Product.aggregate([
    { $sample: { size: 35 } },
    {
      $group: { 
        _id: "$_id",
        product: {
          $push: "$$ROOT"
        },
      },
    },
    { $limit: 9 },
  ]);

  res.status(200).json({
    success: true,
    products
  });
}));

router.route('/similar').get(asyncError(async (req, res) => {
  let products = await Product.find({
    category: req.query.category
  });

  const productsCount = products.length;
  const resultPerPage = 9;
  const currentPage = Number(req.query.page) || 1;

  const skip = resultPerPage * (currentPage - 1);

  if (req.query.id && req.query.id !== "") {
    products = await Product.find({
    _id: { $ne: new mongoose.Types.ObjectId(req.query.id) },
    category: req.query.category
  }).limit(resultPerPage).skip(skip);
  }
  products = await Product.find({
    category: req.query.category
  }).limit(resultPerPage).skip(skip);

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    currentPage: Number(req.query.page),
  });
}));

router.route('/admin/products').get(isAuthenticatedUser, authorizeRoles("admin"), asyncError(async (req, res) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
}))

router.route('/admin/product/create').post(isAuthenticatedUser, authorizeRoles("admin"), asyncError(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {

    req.body.images.forEach((e) => {
      if (Array.isArray(e)) {
        const a = e.join(" ").split(" ").reverse()
        req.body.images.shift()
    
        a.forEach((f) => {
          req.body.images.unshift(f)
        })
      }
    })

    images = req.body.images;
  }

  const imagesLinks = [];
  
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload_large(images[i], {
      folder: "products",
      chunk_size: 6000000
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(200).json({
    success: true,
    product
  });
}));

router.route('/product/:id').get(asyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if(!product) {
    return next(new errorHandler("Product not Found", 404));
  }

  res.status(200).json({
    success: true,
    product
  });
}));

router.route('/admin/product/:id').put(isAuthenticatedUser, authorizeRoles("admin"), asyncError(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if(!product) {
    return next(new errorHandler("Product not Found", 404));
  };

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });

  res.status(200).json({
    success: true,
    product
  });
}));

router.route('/admin/product/:id').delete(isAuthenticatedUser, authorizeRoles("admin"), asyncError(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if(!product) {
    return next(new errorHandler("Product not Found", 404));
  };

  await product.deleteOne({
    _id: req.params.id
  });

  res.status(200).json({
    success: true,
    message: "Product deleted Successfully"
  });
}));

router.route('/review').put(isAuthenticatedUser, asyncError(async(req, res) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  }

  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if(rev.user.toString() === req.user._id.toString()) {
        (rev.rating = rating, rev.comment = comment);
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;
  
  product.reviews.forEach((rev) => {
    avg+= rev.rating
  });
  
  product.ratings = avg/product.reviews.length;

  await product.save({ validationForSave: false });

  res.status(200).json({
    success: true
  });
}));

router.route('/reviews').get(asyncError(async(req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new errorHandler('Review not Found', 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews
  });
}));

router.route('/reviews').delete(isAuthenticatedUser, asyncError(async(req, res, next) => {
  const product = await Product.findById(req.query.productId);
  
  if (!product) {
    return next(new errorHandler('Review not Found', 404));
  }

  const reviews = product.reviews.filter((rev) => {
    rev._id.toString() == req.query.id.toString()
  });

  let avg = 0;
  
  reviews.forEach((rev) => {
    avg+= rev.rating
  });
  
  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews
    },
    {
      new: true,
      runValidators: true,
      useFindAndModidy: true
    }
  );

  res.status(200).json({
    success: true
  });
}));

module.exports = router;