const user = require('../models/user.models')
const bcrypt = require('bcrypt')
const Category = require('../models/categoryModels');
const SubCategory = require('../models/subCategoryModels');
const Order = require('../models/orderModels');
const Product = require('../models/productModels');
const specialDeals = require('../models/specialDealsModels');

exports.createAdminUser = async (req, res) => {
    try {
        let { name, email, password, mobileNo, address, image } = req.body

        let existName = await user.findOne({ name })

        if (existName) {
            return res.status(409).json({ status: 409, message: "Name Already Exist" })
        }

        if (!req.file) {
            return res.status(401).json({ status: 401, message: "Image File Is Required" })
        }

        const salt = await bcrypt.genSalt(10)
        const hasPassword = await bcrypt.hash(password, salt)

        existName = await user.create({
            name,
            email,
            password: hasPassword,
            mobileNo,
            address,
            image: req.file.path,
            role: "admin"
        });

        return res.status(201).json({ status: 201, message: "Admin User Created SuccessFully...", Adminuser: existName })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.createUser = async (req, res) => {
    try {
        let { name, email, password, mobileNo, address, image } = req.body

        let existUserName = await user.findOne({ name })

        if (existUserName) {
            return res.status(404).json({ status: 404, message: "Name Already Exist" })
        }

        if (!req.file) {
            return res.status(401).json({ status: 401, message: "Image File Is Required" })
        }

        let salt = await bcrypt.genSalt(10)
        let hasPassword = await bcrypt.hash(password, salt)

        existUserName = await user.create({
            name,
            email,
            password: hasPassword,
            mobileNo,
            address,
            image: req.file.path,
            role: "user"
        })

        return res.status(201).json({ status: 201, message: "User Create SuccessFully...", user: existUserName })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedUsers;

        paginatedUsers = await user.find()

        let count = paginatedUsers.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "User Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedUsers = await paginatedUsers.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalUsers: count, message: "All Users Found SuccessFully...", users: paginatedUsers })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getUserById = async (req, res) => {
    try {
        let id = req.params.id

        let getUserId = await user.findById(id)

        if (!getUserId) {
            return res.status(404).json({ status: 404, message: "User Not Found" })
        }

        return res.status(200).json({ status: 200, message: "User Found SuccessFully...", user: getUserId });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateUserById = async (req, res) => {
    try {
        let id = req.params.id

        let updateUserId = await user.findById(id)

        if (!updateUserId) {
            return res.status(404).json({ status: 404, message: "User Not Found" })
        }

        if (req.file) {
            req.body.image = req.file.path
        }

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10)
            req.body.password = await bcrypt.hash(req.body.password, salt)
        }

        updateUserId = await user.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, message: "User Updated SuccessFully...", user: updateUserId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteUserById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteUserId = await user.findById(id)

        if (!deleteUserId) {
            return res.status(404).json({ status: 404, message: "User Not Found" })
        }

        await user.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, message: "User Delete SuccessFully..." })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.dashBoard = async (req, res) => {
    try {
        const categories = await Category.find()

        const subCategories = await SubCategory.find()

        const SpecialDeals = await specialDeals.find();

        const orders = await Order.find().populate('orderItems.productId')

        const productSales = {};

        orders.forEach(order => {
            order.orderItems.forEach(item => {
                const { productId, quantity } = item;
                if (!productSales[productId._id]) {
                    productSales[productId._id] = { product: productId, totalQuantity: 0 };
                }
                productSales[productId._id].totalQuantity += quantity;
            });
        });

        const bestSellers = Object.values(productSales)
            .sort((a, b) => b.totalQuantity - a.totalQuantity)
            .slice(0, 10);


        const productIds = bestSellers.map(seller => seller.product._id);
        const products = await Product.find({ _id: { $in: productIds } }).exec();

        const bestSellingProducts = products.map(product => {
            const salesData = bestSellers.find(seller => seller.product._id.toString() === product._id.toString());
            return {
                productId: product._id,
                productName: product.productName,
                totalQuantity: salesData.totalQuantity,
                sales: product.sales
            };
        });

        const groceriesCategory = categories.find(cat => cat.categoryName.toLowerCase() === 'groceries');

        const groceriesProducts = groceriesCategory ? await Product.find({ categoryId: groceriesCategory._id }).exec() : [];

        const freshFruitsSubCategory = subCategories.find(subCat => subCat.subCategoryName.toLowerCase() === 'fresh fruits');

        const freshFruitsProducts = freshFruitsSubCategory ? await Product.find({ subCategoryId: freshFruitsSubCategory._id }).exec() : [];

        const freshVegetablesSubCategory = subCategories.find(subCat => subCat.subCategoryName.toLowerCase() === 'fresh vegitables');

        const freshVegetablesProducts = freshVegetablesSubCategory ? await Product.find({ subCategoryId: freshVegetablesSubCategory._id }).exec() : [];

        const categorizedData = {
            vegetablesAndFruits: categories,
            groceries: groceriesProducts,
            SpecialDeals,
            bestSeller: bestSellingProducts,
            freshVegetables: freshVegetablesProducts,
            freshFruits: freshFruitsProducts
        };

        return res.status(200).json({ status: 200, status: true, message: "DashBoard Data Found SuccessFully....", data: categorizedData });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

let fixOtp = 1234

exports.loginWithMobileNo = async (req, res) => {
    try {
        let { mobileNo } = req.body

        let userMobileNo = await user.findOne({ mobileNo })

        if (userMobileNo) {
            return res.status(409).json({ status: 409, success: false, message: "Mobile No Alredy Exist" })
        }

        userMobileNo = await user.create({
            mobileNo
        });

        return res.status(200).json({ status: 200, success: true, message: "Otp Sent SuccessFully...", otp: fixOtp })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.verifyOtp = async (req, res) => {
    try {
        let { mobileNo, otp } = req.body

        let checMobileNo = await user.findOne({ mobileNo })

        if (!checMobileNo) {
            return res.status(401).json({ status: 401, success: false, message: "MobileNo Not Found" })
        }

        if (otp !== fixOtp) {
            return res.status(401).json({ status: 401, success: false, message: "Invalid Otp" })
        }

        return res.status(200).json({ status: 200, success: true, message: "Login SuccessFully..." });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}