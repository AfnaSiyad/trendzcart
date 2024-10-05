const Product = require("../models/productModel");
const path = require("path");
const fs = require('fs');
const calculateAverageRating = require("../utils/calculateAverageRating");
const User = require("../models/userModel");

// Create product
exports.addProduct = async (req, res) => {

    const { name, price, catogory, description, stock } = req.body;

    const photo = req?.file?.path ?? '';

    try {

        const product = await Product.create({
            name,
            price,
            photo,
            catogory,
            description,
            stock,
            user: req.user
        })

        if (!product) {
            return res.status(500).json({
                success: false,
                message: "Product not added"
            })
        }

        res.status(201).json({
            success: true,
            message: "Product added successfully!"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

// Update product
exports.updateProduct = async (req, res) => {


    try {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        const { name, price, stock, catogory, description } = req.body;

        const photo = req?.file?.path ?? null;


        if (name) {
            product.name = name;
        }
        if (price) {
            product.price = price;
        }
        if (stock) {
            catogory
        }
        if (catogory) {
            product.catogory = catogory;
        }
        if (description) {
            product.description = description;
        }

        if (photo) {

            const oldPhotoPath = path.join(__dirname, '..', product.photo);

            fs.unlink(oldPhotoPath, (err) => {
                if (err) {
                    res.status(500).send('Error deleting photograph file');
                    return;
                }
                console.log('File deleted successfully');
            });

            product.photo = photo;

        }

        await product.save();

        res.status(200).json({
            success: true,
            message: "Product updated successfully!"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

// Get all products
exports.getAllProducts = async (req, res) => {

    const searchQuery = req.query.search;

    try {
        const products = await Product.find({
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search by product name
                { description: { $regex: searchQuery, $options: 'i' } } // Case-insensitive search by product description
            ]
        })


        if (!products) {
            return res.status(404).json({
                success: false,
                message: "Products not found"
            })
        }

        res.status(200).json({
            success: true,
            products
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Get user products
exports.getUserProducts = async (req, res) => {

    const searchQuery = req.query.search;

    const user = req.user;

    try {
        const products = await Product.find({
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search by product name
                { description: { $regex: searchQuery, $options: 'i' } } // Case-insensitive search by product description
            ],
            user: user
        })


        if (!products) {
            return res.status(404).json({
                success: false,
                message: "Products not found"
            })
        }

        res.status(200).json({
            success: true,
            products
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Get Latest products
exports.getLatestProducts = async (req, res) => {

    try {
        const products = await Product.find().sort({ createdAt: -1 }).limit(12);

        if (!products) {
            return res.status(404).json({
                success: false,
                message: "Products not found"
            })
        }

        res.status(200).json({
            success: true,
            products
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Get single product details 
exports.getProductDetails = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }


        res.status(200).json({
            success: true,
            product
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

// Delete product 
exports.deleteProduct = async (req, res) => {

    try {

        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }


        const photo = product.photo;

        if (photo) {

            const oldPhotoPath = path.join(__dirname, '..', product.photo);

            fs.unlink(oldPhotoPath, (err) => {
                if (err) {
                    res.status(500).send('Error deleting photograph file');
                    return;
                }
                console.log('File deleted successfully');
            });

        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully!"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

// Product Review 
exports.productReview = async (req, res) => {

    try {

        const { productId } = req.params;

        const { comment, rating } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }
        // Fetch user information from the database using the user ID
        const user = await User.findById(req.user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const newReview = {
            user: req.user,
            fullname:user.fullname,
            comment,
            rating
        };

        product.reviews.push(newReview);
        product.rating = calculateAverageRating(product.reviews);

        await product.save();

        res.status(201).json({ success: true, message: "Review added successfully!" });


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

// Update product review

exports.productReviewUpdate = async (req, res) => {

    const { productId, reviewId } = req.params;
    const { comment, rating } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const review = product.reviews.id(reviewId);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        // Update review properties
        review.comment = comment;
        review.rating = rating;

        product.rating = calculateAverageRating(product.reviews);

        await product.save();

        res.status(200).json({
            success: true,
            message: 'Review updated successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }

}