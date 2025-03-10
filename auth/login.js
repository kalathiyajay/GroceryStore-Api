const user = require('../models/user.models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Order = require('../models/orderModels')
const Product = require('../models/productModels')

exports.userLogin = async (req, res) => {
    try {
        let { uid, username, image, email } = req.body

        let imageUrl = req.file ? req.file.path : undefined

        let checkUser = await user.findOne({ email })

        if (!checkUser) {
            checkUser = await user.create({
                uid,
                username,
                image: imageUrl,
                email,
                role: 'user'
            })
        }

        if (req.file) {
            checkUser.image = imageUrl
        }

        let token = jwt.sign({ _id: checkUser._id }, process.env.SECRET_KEY, { expiresIn: '1D' })

        return res.status(200).json({ status: 200, success: true, message: "User Login SuccessFully....", data: { image: checkUser.image, id: checkUser._id, email: checkUser.email, username: checkUser.username }, token: token });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.adminLogin = async (req, res) => {
    try {
        let { email, password } = req.body;

        let chekEmail = await user.findOne({ email: email });

        if (!chekEmail) {
            return res.json({ status: 400, message: "Email Not Found " })
        }

        let passwordComapre = await bcrypt.compare(password, chekEmail.password);

        if (!passwordComapre) {
            return res.json({ status: 400, message: "Password Not Match" })
        }

        let token = await jwt.sign({ _id: chekEmail._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

        return res.json({ status: 200, message: "User Login SuccessFully...", user: chekEmail, token: token });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.changePassword = async (req, res) => {
    try {
        let id = req.params.id

        let getUserIdData = await user.findById(id)

        let { currentPassword, newPassword, confirmPassword } = req.body

        let passwordCompare = await bcrypt.compare(currentPassword, getUserIdData.password);

        if (!passwordCompare) {
            return res.status(400).json({ status: 400, message: "Current Password Not Match" })
        }

        if (newPassword != confirmPassword) {
            return res.status(400).json({ status: 400, message: "newPassword and confirmPassword Not Match" })
        }

        let salt = await bcrypt.genSalt(10);
        let hasPassword = await bcrypt.hash(newPassword, salt)

        getUserIdData = await user.findByIdAndUpdate(id, { password: hasPassword }, { new: true });

        return res.status(200).json({ status: 200, message: "Password Changed SuccessFully..." });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.resetPassword = async (req, res) => {
    try {
        let id = req.params.id

        let getUserIdData = await user.findById(id)

        let { newPassword, confirmPassword } = req.body

        if (newPassword != confirmPassword) {
            return res.status(400).json({ status: 400, message: "newPassword and confirmPassword Not Match" })
        }

        let salt = await bcrypt.genSalt(10);
        let hasPassword = await bcrypt.hash(newPassword, salt)

        getUserIdData = await user.findByIdAndUpdate(id, { password: hasPassword }, { new: true });

        return res.status(200).json({ status: 200, message: "Password Reset SuccessFully..." });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.adminDashboard = async (req, res) => {
    try {
        const totalRevenueResult = await Order.aggregate([
            { $match: { orderStatus: 'Completed' } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' }
                }
            }
        ]);

        const dailyOrders = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(new Date().setHours(0, 0, 0, 0))
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalDailyOrders: { $sum: 1 }
                }
            }
        ]);

        const dailySales = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(new Date().setHours(0, 0, 0, 0))
                    },
                    orderStatus: 'Completed'
                }
            },
            {
                $group: {
                    _id: null,
                    totalDailySales: { $sum: '$totalAmount' }
                }
            }
        ]);

        const orderItemStatusCounts = await Order.aggregate([
            { $unwind: '$orderItems' },
            {
                $group: {
                    _id: '$orderItems.status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const orderItemStats = {
            Confirmed: 0,
            shipped: 0,
            delivered: 0,
            Cancelled: 0
        };

        orderItemStatusCounts.forEach(status => {
            orderItemStats[status._id] = status.count;
        });

        const totalProducts = await Product.countDocuments({ status: true });

        const productList = await Product.aggregate([
            { $match: { status: true } },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    productName: 1,
                    price: 1,
                    quantity: 1,
                    unit: 1,
                    categoryName: '$category.categoryName',
                    productImage: { $arrayElemAt: ['$productImage', 0] }
                }
            },
        ]);

        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        const yearlyData = await Order.aggregate([
            {
                $match: {
                    orderStatus: 'Completed',
                    createdAt: {
                        $gte: new Date(`${currentYear}-01-01`),
                        $lte: new Date(`${currentYear}-12-31`)
                    }
                }
            },
            {
                $addFields: {
                    month: { $month: "$createdAt" },
                    actualRevenue: { $subtract: ["$totalAmount", "$discount"] },
                
                    actualCost: { $multiply: ["$subTotal", 0.7] }
                }
            },
            {
                $group: {
                    _id: { month: "$month" },
                    totalRevenue: { $sum: "$actualRevenue" },
                    totalCost: { $sum: "$actualCost" }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id.month",
                    revenue: "$totalRevenue",
                    cost: "$totalCost",
                    monthName: {
                        $arrayElemAt: [
                            [
                                'January', 'February', 'March', 'April',
                                'May', 'June', 'July', 'August',
                                'September', 'October', 'November', 'December'
                            ],
                            { $subtract: ["$_id.month", 1] }
                        ]
                    },
                    profit: {
                        $cond: {
                            if: { $gt: [{ $subtract: ["$totalRevenue", "$totalCost"] }, 0] },
                            then: { $subtract: ["$totalRevenue", "$totalCost"] },
                            else: 0
                        }
                    },
                    loss: {
                        $cond: {
                            if: { $lt: [{ $subtract: ["$totalRevenue", "$totalCost"] }, 0] },
                            then: { $abs: { $subtract: ["$totalRevenue", "$totalCost"] } },
                            else: 0
                        }
                    }
                }
            },
            { $sort: { month: 1 } }
        ]);

        const completeYearData = Array.from({ length: 12 }, (_, index) => {
            const month = index + 1;
            const monthData = yearlyData.find(data => data.month === month) || {
                month,
                monthName: [
                    'January', 'February', 'March', 'April',
                    'May', 'June', 'July', 'August',
                    'September', 'October', 'November', 'December'
                ][index],
                profit: 0,
                loss: 0
            };
            return monthData;
        });

        const yearTotals = completeYearData.reduce((acc, curr) => ({
            profit: acc.profit + curr.profit,
            loss: acc.loss + curr.loss
        }), { revenue: 0, cost: 0, profit: 0, loss: 0 });

       

        return res.status(200).json({
            status: 200, totalRevenue: totalRevenueResult[0]?.totalRevenue || 0, dailyOrders: dailyOrders[0]?.totalDailyOrders || 0, dailySales: dailySales[0]?.totalDailySales || 0, orderItemStats, totalProducts, productList: productList,
            totalRevenue: yearlyData.reduce((acc, data) => acc + data.revenue, 0),
            yearlyData: {
                currentYear,
                monthlyData: completeYearData,
                yearTotals
            }

        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}
 // const yearlyData = await Order.aggregate([
        //     {
        //         $match: {
        //             createdAt: {
        //                 $gte: new Date(`${currentYear}-01-01`),
        //                 $lte: new Date(`${currentYear}-12-31`)
        //             }
        //         }
        //     },
        //     {
        //         $project: {
        //             year: { $year: "$createdAt" },
        //             month: { $month: "$createdAt" },
        //             orderStatus: 1,
        //             totalAmount: 1,
        //             discount: 1,
        //             estimatedCost: { $multiply: ["$totalAmount", 0.7] } // Assuming cost is 70% of totalAmount
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: {
        //                 month: "$month"
        //             },
        //             revenue: {
        //                 $sum: {
        //                     $cond: [
        //                         { $eq: ["$orderStatus", "Completed"] },
        //                         { $subtract: ["$totalAmount", "$discount"] }, // Apply discount to revenue
        //                         0
        //                     ]
        //                 }
        //             },
        //             totalOrders: { $sum: 1 },
        //             completedOrders: {
        //                 $sum: {
        //                     $cond: [
        //                         { $eq: ["$orderStatus", "Completed"] },
        //                         1,
        //                         0
        //                     ]
        //                 }
        //             },
        //             cancelledOrders: {
        //                 $sum: {
        //                     $cond: [
        //                         { $eq: ["$orderStatus", "Cancelled"] },
        //                         1,
        //                         0
        //                     ]
        //                 }
        //             },
        //             costs: {
        //                 $sum: {
        //                     $cond: [
        //                         { $eq: ["$orderStatus", "Completed"] },
        //                         "$estimatedCost",
        //                         0
        //                     ]
        //                 }
        //             },
        //             discounts: { $sum: "$discount" }
        //         }
        //     },
        //     {
        //         $project: {
        //             _id: 0,
        //             month: "$_id.month",
        //             monthName: {
        //                 $let: {
        //                     vars: {
        //                         monthsInYear: [
        //                             'January', 'February', 'March', 'April',
        //                             'May', 'June', 'July', 'August',
        //                             'September', 'October', 'November', 'December'
        //                         ]
        //                     },
        //                     in: {
        //                         $arrayElemAt: ['$$monthsInYear', { $subtract: ['$_id.month', 1] }]
        //                     }
        //                 }
        //             },
        //             revenue: 1,
        //             costs: 1,
        //             discounts: 1,
        //             totalOrders: 1,
        //             completedOrders: 1,
        //             cancelledOrders: 1,
        //             profit: {
        //                 // Profit calculation: Only if revenue is greater than cost
        //                 $cond: [
        //                     { $gt: ["$revenue", "$costs"] },
        //                     { $subtract: ["$revenue", "$costs"] }, // Revenue - Costs
        //                     0 // No profit if revenue <= costs
        //                 ]
        //             },
        //             loss: {
        //                 $cond: [
        //                     { $gt: ["$costs", "$revenue"] },
        //                     { $subtract: ["$costs", "$revenue"] }, 
        //                     0 
        //                 ]
        //             },
        //             profitMargin: {
        //                 $multiply: [
        //                     {
        //                         $divide: [
        //                             { $subtract: [{ $subtract: ["$revenue", "$discounts"] }, "$costs"] },
        //                             { $cond: [{ $eq: ["$revenue", 0] }, 1, "$revenue"] }
        //                         ]
        //                     },
        //                     100
        //                 ]
        //             }
        //         }
        //     },
        //     { $sort: { month: 1 } }
        // ]);

        // // Fill missing months with 0 profit/loss if no data exists for that month
        // const completeYearData = Array.from({ length: 12 }, (_, index) => {
        //     const month = index + 1;
        //     const existingData = yearlyData.find(data => data.month === month) || {};

        //     return {
        //         month,
        //         monthName: [
        //             'January', 'February', 'March', 'April',
        //             'May', 'June', 'July', 'August',
        //             'September', 'October', 'November', 'December'
        //         ][index],
        //         profit: existingData.profit || 0,
        //         loss: existingData.loss || 0,
        //         year: month > currentMonth ? currentYear + 1 : currentYear
        //     };
        // });

        // // Calculate total profit and loss for the year
        // const currentYearTotals = completeYearData.reduce((acc, curr) => ({
        //     profit: acc.profit + curr.profit,
        //     loss: acc.loss + curr.loss
        // }), {
        //     profit: 0,
        //     loss: 0
        // });

        // const yearlyData = await Order.aggregate([
        //     {
        //         $match: {
        //             createdAt: {
        //                 $gte: new Date(`${currentYear}-01-01`),
        //                 $lte: new Date(`${currentYear}-12-31`)
        //             }
        //         }
        //     },
        //     {
        //         $project: {
        //             year: { $year: "$createdAt" },
        //             month: { $month: "$createdAt" },
        //             orderStatus: 1,
        //             totalAmount: 1,
        //             discount: 1,
        //             estimatedCost: { $multiply: ["$totalAmount", 0.7] }
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: {
        //                 month: "$month"
        //             },
        //             revenue: {
        //                 $sum: {
        //                     $cond: [
        //                         { $eq: ["$orderStatus", "Completed"] },
        //                         "$totalAmount",
        //                         0
        //                     ]
        //                 }
        //             },
        //             totalOrders: { $sum: 1 },
        //             completedOrders: {
        //                 $sum: {
        //                     $cond: [
        //                         { $eq: ["$orderStatus", "Completed"] },
        //                         1,
        //                         0
        //                     ]
        //                 }
        //             },
        //             cancelledOrders: {
        //                 $sum: {
        //                     $cond: [
        //                         { $eq: ["$orderStatus", "Cancelled"] },
        //                         1,
        //                         0
        //                     ]
        //                 }
        //             },
        //             costs: {
        //                 $sum: {
        //                     $cond: [
        //                         { $eq: ["$orderStatus", "Completed"] },
        //                         "$estimatedCost",
        //                         0
        //                     ]
        //                 }
        //             },
        //             discounts: { $sum: "$discount" }
        //         }
        //     },
        //     {
        //         $project: {
        //             _id: 0,
        //             month: "$_id.month",
        //             monthName: {
        //                 $let: {
        //                     vars: {
        //                         monthsInYear: [
        //                             'January', 'February', 'March', 'April',
        //                             'May', 'June', 'July', 'August',
        //                             'September', 'October', 'November', 'December'
        //                         ]
        //                     },
        //                     in: {
        //                         $arrayElemAt: ['$$monthsInYear', { $subtract: ['$_id.month', 1] }]
        //                     }
        //                 }
        //             },
        //             revenue: 1,
        //             costs: 1,
        //             discounts: 1,
        //             totalOrders: 1,
        //             completedOrders: 1,
        //             cancelledOrders: 1,
        //             profit: {
        //                 $subtract: [
        //                     { $subtract: ["$revenue", "$discounts"] },
        //                     "$costs"
        //                 ]
        //             },
        //             profitMargin: {
        //                 $multiply: [
        //                     {
        //                         $divide: [
        //                             { $subtract: [{ $subtract: ["$revenue", "$discounts"] }, "$costs"] },
        //                             { $cond: [{ $eq: ["$revenue", 0] }, 1, "$revenue"] }
        //                         ]
        //                     },
        //                     100
        //                 ]
        //             }
        //         }
        //     },
        //     { $sort: { month: 1 } }
        // ]);

        // const completeYearData = Array.from({ length: 12 }, (_, index) => {
        //     const month = index + 1;
        //     const existingData = yearlyData.find(data => data.month === month) || {};

        //     return {
        //         month,
        //         monthName: [
        //             'January', 'February', 'March', 'April',
        //             'May', 'June', 'July', 'August',
        //             'September', 'October', 'November', 'December'
        //         ][index],
        //         profit: existingData.profit || 0,
        //         year: month > currentMonth ? currentYear + 1 : currentYear
        //     };
        // });

        // const currentYearTotals = completeYearData
        //     .filter(data => !data.isNextYear)
        //     .reduce((acc, curr) => ({
        //         profit: acc.profit + curr.profit,
        //     }), {
        //         profit: 0
        //     });
