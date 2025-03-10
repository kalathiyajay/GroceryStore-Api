const user = require('../models/user.models')
const bcrypt = require('bcrypt')
const Category = require('../models/categoryModels');
const SubCategory = require('../models/subCategoryModels');
const Order = require('../models/orderModels');
const Product = require('../models/productModels');
const specialDeals = require('../models/specialDealsModels');
const jwt = require('jsonwebtoken')
const moreToExplore = require('../models/moreToExplore.models');
const twilio = require('twilio')

const accountSid = process.env.TWILIOACCOUNTSID
const authToken = process.env.TWILIOAUTHTOKEN
const twilioPhoneNumber = process.env.TWILIOPHONENUMBER

const client = twilio(accountSid, authToken);


exports.createAdminUser = async (req, res) => {
    try {
        let { name, email, password, mobileNo, address, image, gender, status } = req.body

        let existName = await user.findOne({ name })

        if (existName) {
            return res.status(409).json({ status: 409, success: false, message: "Name Already Exist" })
        }

        if (!req.file) {
            return res.status(401).json({ status: 401, success: false, message: "Image File Is Required" })
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
            role: "admin",
            gender,
            status
        });

        return res.status(201).json({ status: 201, success: true, message: "Admin User Created SuccessFully...", data: existName })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.createUser = async (req, res) => {
    try {
        let { name, email, password, mobileNo, address, image, gender, status } = req.body

        let existUserName = await user.findOne({ name })

        if (existUserName) {
            return res.status(404).json({ status: 404, success: false, message: "Name Already Exist" })
        }

        if (!req.file) {
            return res.status(401).json({ status: 401, success: false, message: "Image File Is Required" })
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
            role: "user",
            gender,
            status
        })

        return res.status(201).json({ status: 201, success: true, message: "User Create SuccessFully...", data: existUserName })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, success: false, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedUsers;

        paginatedUsers = await user.find()

        let count = paginatedUsers.length

        if (count === 0) {
            return res.status(404).json({ status: 404, success: false, message: "User Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedUsers = await paginatedUsers.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, success: true, totalUsers: count, message: "All Users Found SuccessFully...", data: paginatedUsers })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.getUserById = async (req, res) => {
    try {
        let id = req.params.id

        let getUserId = await user.findById(id)

        if (!getUserId) {
            return res.status(404).json({ status: 404, success: false, message: "User Not Found" })
        }

        return res.status(200).json({ status: 200, success: true, message: "User Found SuccessFully...", data: getUserId });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.updateUserById = async (req, res) => {
    try {
        let id = req.params.id

        let updateUserId = await user.findById(id)

        if (!updateUserId) {
            return res.status(404).json({ status: 404, success: false, message: "User Not Found" })
        }

        if (req.file) {
            req.body.image = req.file.path
        }

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10)
            req.body.password = await bcrypt.hash(req.body.password, salt)
        }

        updateUserId = await user.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, success: true, message: "User Updated SuccessFully...", data: updateUserId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.deleteUserById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteUserId = await user.findById(id)

        if (!deleteUserId) {
            return res.status(404).json({ status: 404, success: false, message: "User Not Found" })
        }

        await user.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, success: true, message: "User Delete SuccessFully..." })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.dashBoard = async (req, res) => {
    try {
        const categories = await Category.find()

        const subCategories = await SubCategory.find()

        const SpecialDeals = await specialDeals.find();

        const orders = await Order.find().populate('orderItems.productId')

        const moreToExplores = await moreToExplore.find();

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
                categoryId: product.categoryId,
                productId: product._id,
                productName: product.productName,
                totalQuantity: salesData.totalQuantity,
                price: product.price,
                sales: product.sales,
                discount: product.discount,
                productImage: product.productImage
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
            freshFruits: freshFruitsProducts,
            MoreToExplore: moreToExplores
        };

        return res.status(200).json({ status: 200, success: true, status: true, message: "DashBoard Data Found SuccessFully....", data: categorizedData });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

let fixOtp = 1234

exports.loginWithMobileNo = async (req, res) => {
    try {
        const { mobileNo } = req.body;

        if (!mobileNo) {
            return res.status(401).json({ status: 401, success: false, message: "Mobile No Is Required" });
        }

        let userMobileNo = await user.findOne({ mobileNo });

        if (!userMobileNo) {
            userMobileNo = await user.create({
                mobileNo,
                role: 'user'
            });
        }

        userMobileNo.otp = fixOtp

        await userMobileNo.save();

        return res.status(200).json({ status: 200, success: true, message: "OTP Sent Successfully..." });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, success: false, message: error.message });
    }
}

exports.verifyOtp = async (req, res) => {
    try {
        let { mobileNo, otp } = req.body

        let checMobileNo = await user.findOne({ mobileNo })

        if (!checMobileNo) {
            return res.status(401).json({ status: 401, success: false, message: "MobileNo Not Found" })
        }

        if (otp !== checMobileNo.otp) {
            return res.status(401).json({ status: 401, success: false, message: "Invalid Otp" })
        }

        checMobileNo.otp = undefined;

        await checMobileNo.save();

        let token = jwt.sign({ _id: checMobileNo._id }, process.env.SECRET_KEY, { expiresIn: '1D' })

        return res.status(200).json({ status: 200, success: true, message: "Login SuccessFully...", token: token });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.staticResentOtp = async (req, res) => {
    try {
        const { mobileNo } = req.body;

        if (!mobileNo) {
            return res.status(401).json({ status: 401, success: false, message: "Mobile No Is Required" });
        }

        let userMobileNo = await user.findOne({ mobileNo });

        userMobileNo.otp = 5678

        await userMobileNo.save();

        return res.status(200).json({ status: 200, success: true, message: "OTP Sent Successfully..." });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, success: false, message: error.message });
    }
}

exports.generateOtp = async (req, res) => {
    try {
        let { mobileNo } = req.body

        if (!mobileNo) {
            return res.status(404).json({ status: 404, message: "Mobile No Is Required" })
        }

        let checkMobileNo = await user.findOne({ mobileNo })

        if (!checkMobileNo) {
            checkMobileNo = await user.create({
                mobileNo
            });
        }

        let otp = Math.floor(1000 + Math.random() * 9000)

        checkMobileNo.otp = otp

        checkMobileNo.save();

        await client.messages.create({
            body: `Your OTP is: ${otp}`,
            from: twilioPhoneNumber,
            to: mobileNo
        });

        return res.status(200).json({ status: 200, message: "Otp Sent SuccessFully..." })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.verifyGenerateOtp = async (req, res) => {
    try {
        let { mobileNo, otp } = req.body

        let checkMobileNoIsExist = await user.findOne({ mobileNo })

        if (!checkMobileNoIsExist) {
            return res.status(404).json({ status: 404, message: "Mobile No Not Found" })
        }

        if (checkMobileNoIsExist.otp !== otp) {
            return res.status(404).json({ status: 404, message: "Otp Not Match" })
        }

        let token = await jwt.sign({ _id: checkMobileNoIsExist._id }, process.env.SECRET_KEY);

        checkMobileNoIsExist.otp = undefined;

        checkMobileNoIsExist.save();

        return res.status(200).json({ status: 200, message: "Otp Verify SuccessFully...", user: checkMobileNoIsExist, token: token })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.resentOtp = async (req, res) => {
    try {
        let { mobileNo } = req.body

        if (!mobileNo) {
            return res.status(404).json({ status: 404, message: "Mobile No Is Required" })
        }

        let checkMobileNo = await user.findOne({ mobileNo })

        if (!checkMobileNo) {
            return res.status(404).json({ status: 404, message: "Mobile No Not Found" })
        }

        let otp = Math.floor(10000 + Math.random() * 1000);

        console.log(otp);

        checkMobileNo.otp = otp

        checkMobileNo.save();

        await client.messages.create({
            body: `Your OTP is: ${otp}`,
            from: twilioPhoneNumber,
            to: mobileNo
        });

        return res.status(200).json({ status: 200, message: "Otp Sent SuccessFully..." });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteAllUsers = async (req, res) => {
    try {
        let deleteAllUsers = await user.deleteMany({});

        if (deleteAllUsers.deletedCount === 0) {
            return res.status(404).json({ status: 404, status: false, message: "User Not found" });
        }

        return res.status(200).json({ status: 200, success: true, message: "All User Delete SuccessFully..." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.globalSearch = async (req, res) => {
    const { query } = req.query;
    try {
        const results = await Promise.all([Product.find({ $or: [{ productName: { $regex: query, $options: 'i' } },] }).select('productName'),
        Category.find({ categoryName: { $regex: query, $options: 'i' } }).select('categoryName'),
        SubCategory.find({ subCategoryName: { $regex: query, $options: 'i' } }).select('subCategoryName'),
        user.find({ $or: [{ name: { $regex: query, $options: 'i' } }, { email: { $regex: query, $options: 'i' } }] }).select('name')]);

        const filteredResults = {
            products: results[0].length ? results[0] : [],
            categories: results[1].length ? results[1] : [],
            subCategories: results[2].length ? results[2] : [],
            users: results[3].length ? results[3] : [],
        };

        return res.status(200).json({ status: 200, filteredResults });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};