import Product from '../models/productModel.js';
import HandleError from '../utils/handleError.js';
import handleAsyncError from '../middleware/handleAsyncError.js';
import APIFunctionality from '../utils/apiFunctionality.js';
import uploadToCloudinary from '../utils/cloudinaryUpload.js';
import { v2 as cloudinary } from 'cloudinary';
import Order from '../models/orderModel.js';

// http://localhost:8000/api/v1/product/68d113fc2fd8c0a83c5a4c71?keyword=makeup

// 1) creating products
export const createProducts = handleAsyncError(async (req, res, next) => {
    let image = [];
    if (typeof req.body.image === "string") {
        image.push(req.body.image);
    } else {
        image = req.body.image;
    }
    const imageLinks = [];
    for (let i = 0; i < image.length; i++) {
        const imageLink = await uploadToCloudinary(image[i], 'products');
        imageLinks.push(imageLink);
    }
    req.body.image = imageLinks;

    req.body.user = req.user.id; // which admin is logged in and creating the product
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
})

// 2) Get all products
export const getAllProducts = handleAsyncError(async (req, res, next) => {
    const resultPerPage = 4;
    const apiFeatures = new APIFunctionality(Product.find(), req.query).search().filter();

    // getting filtered query before pagination
    const filteredQuery = apiFeatures.query.clone();
    const productCount = await filteredQuery.countDocuments();

    // Calculate totalpages based on filtered count
    const totalPages = Math.ceil(productCount / resultPerPage);
    const page = Number(req.query.page) || 1;

    if (page > totalPages && productCount > 0) {
        return next(new HandleError("This page does not exists!", 404))
    }

    // Apply pagination
    apiFeatures.pagination(resultPerPage);
    const products = await apiFeatures.query;

    if (!products || products.length === 0) {
        return next(new HandleError("No Product Found!"), 404);
    }

    res.status(200).json({
        success: true,
        products,
        productCount,
        resultPerPage,
        totalPages,
        currentPage: page
    })
})

// 3) Update products
export const updateProduct = handleAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new HandleError("Product Not Found", 404));
    }
    
    let images = [];
    if (typeof req.body.image === "string") {
        images.push(req.body.image);
    } else if (Array.isArray(req.body.image)) {
        images = req.body.image;
    }

    if (images.length > 0) {
        for (let i = 0; i < product.image.length; i++) {
            await cloudinary.uploader.destroy(product.image[i].public_id);
        }

        //Upload new images
        const imageLinks = [];
        for (let i = 0; i < images.length; i++) {
            const imageLink = await uploadToCloudinary(images[i], 'products');
            imageLinks.push(imageLink);
        }
        req.body.image = imageLinks;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        product
    })
})

// 4) Delete products
export const deleteProduct = handleAsyncError(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
        return next(new HandleError("Product Not Found", 404));
    }
    for(let i=0; i<product.image.length; i++){
        await cloudinary.uploader.destroy(product.image[i].public_id)
    }
    res.status(200).json({
        success: true,
        message: "Product deleted successfully!"
    })
})

// 5) Accessing single Product
export const getSingleProduct = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new HandleError("Product Not Found", 404));
    }
    res.status(200).json({
        success: true,
        product
    })
})

// 5) Getting high discounted products (for Home page deals)
export const getDiscountedProducts = handleAsyncError(async (req, res, next) => {
    const minDiscount = Number(req.query.minDiscount) || 40;
    const limit = Number(req.query.limit) || 10;

    const products = await Product.find({
        discountPercent: { $gte: minDiscount },
        stock: { $gt: 0 }
    })
        .sort({ discountPercent: -1, createdAt: -1 })
        .limit(limit);

    res.status(200).json({
        success: true,
        products
    })
})

// 6) Creating and Updating Review
export const createReviewForProduct = handleAsyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const hasDeliveredPurchase = await Order.exists({
        user: req.user._id,
        orderStatus: 'Delivered',
        orderItems: {
            $elemMatch: {
                product: productId
            }
        }
    });

    if (!hasDeliveredPurchase) {
        return next(new HandleError("You can review this product only after it has been delivered to you.", 403));
    }

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }
    const product = await Product.findById(productId);
    if (!product) {
        return next(new HandleError("Product not found!", 400));
    }
    const reviewExists = product.reviews.find(review => review.user.toString() === req.user.id.toString());
    if (reviewExists) {
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user.id.toString()) {
                review.rating = rating,
                    review.comment = comment
            }
        })
    } else {
        product.reviews.push(review);
    }
    product.numOfReviews = product.reviews.length;
    let sum = 0;
    product.reviews.forEach(review => {
        sum += review.rating;
    })
    product.ratings = product.reviews.length > 0 ? sum / product.reviews.length : 0;
    await product.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
        product
    })
})

// 7) Getting reviews
export const getProductReviews = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
    if (!product) {
        return next(new HandleError("Product not found!", 400));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

// 8) Deleting review
export const deleteReview = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
    if (!product) {
        return next(new HandleError("Product not found!", 400));
    }

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());
    let sum = 0;
    reviews.forEach(review => {
        sum += review.rating
    })
    const ratings = reviews.length > 0 ? sum / reviews.length : 0;
    const numOfReviews = reviews.length;
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        message: "Review deleted successfully!"
    })
})


// 9) Admin - Get all products
export const getAdminProducts = handleAsyncError(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products
    })
})
