const order = require('../models/orderModels');
const cart = require('../models/cartModels');
const mongoose = require('mongoose')
const product = require('../models/productModels');
const coupen = require('../models/couponModels')
const orderNoTracker = require('../models/orderSequanceValue.models')

const generateOrderId = async () => {
    const currentPrefix = await orderNoTracker.findOne({}, {}, { sort: { 'prefix': -1 } });

    let prefix = currentPrefix ? currentPrefix.prefix : 'AA';
    let orderId = currentPrefix ? currentPrefix.lastSequenceNumber + 1 : 1;

    const incrementPrefix = (prefix) => {
        let first = prefix.charCodeAt(0);
        let second = prefix.charCodeAt(1);

        if (second < 90) {
            second++;
        } else {
            second = 65;
            if (first < 90) {
                first++;
            } else {
                throw new Error('Maximum prefix reached');
            }
        }

        return String.fromCharCode(first) + String.fromCharCode(second);
    };

    if (orderId > 999999999) {
        prefix = incrementPrefix(prefix);
        orderId = 1;
    }

    let prefixData = await orderNoTracker.findOne({ prefix });

    if (!prefixData) {
        prefixData = await orderNoTracker.create({ prefix, lastSequenceNumber: 0 });
    }

    await orderNoTracker.updateOne({ prefix }, { lastSequenceNumber: orderId });

    const number = String(orderId).padStart(9, '0');

    return prefix + number;
};

exports.createOrder = async (req, res) => {
    try {
        let { userId, orderId, orderItems, productId, quantity, address, coupenId, paymentMethod, status, subTotal } = req.body

        orderItems = await cart.find({ userId })

        if (!orderItems) {
            return res.status(404).json({ status: 404, success: false, message: "Cart Item Not Found" })
        }

        if (!orderId) {
            orderId = await generateOrderId();
        }

        let discount = 0
        let totalAmount = 0
        let coupens;

        if (coupenId) {
            coupens = await coupen.findById(coupenId)
            if (!coupens) {
                return res.status(404).json({ status: 404, success: false, message: "Coupen Not Found" })
            }

            if (!coupens.active) {
                return res.status(404).json({ status: 404, success: false, message: "Coupen Is Not Active" })
            }

            discount = coupens.coupenDiscount
        }

        for (let item of orderItems) {

            const products = await product.findById(item.productId)
            if (!products) {
                return res.status(404).json({ status: 404, success: false, message: "Product Not Found" })
            }

            totalAmount += products.price * item.quantity
        }

        const discountAmount = (totalAmount * (discount / 100))

        totalAmount -= discountAmount

        cartItmems = await order.create({
            userId,
            orderId,
            orderItems,
            address,
            paymentMethod,
            coupenId,
            discount: discountAmount,
            status: "Confirmed",
            subTotal: totalAmount + discountAmount,
            totalAmount
        });

        if (coupens && coupens.active) {
            coupens.active = false;
            await coupens.save();
        }

        await cart.deleteMany({ userId: userId });

        return res.status(201).json({ status: 201, success: true, message: "Order Create SuccessFully...", data: cartItmems });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.getAllOrders = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, success: false, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedOrdersData;

        paginatedOrdersData = await order.find().populate('userId').populate('orderItems.productId').populate('address')

        let count = paginatedOrdersData.length

        if (count === 0) {
            return res.status(404).json({ status: 404, success: false, message: "Order Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedOrdersData = await paginatedOrdersData.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, success: true, totalOrders: count, message: "All Orders Found SuccessFully...", data: paginatedOrdersData })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.getOrderById = async (req, res) => {
    try {
        let id = req.params.id

        let getOrderId = await order.findById(id).populate('userId').populate('orderItems.productId').populate('address')

        if (!getOrderId) {
            return res.status(404).json({ status: 404, success: false, message: "Order Not Found" })
        }

        return res.status(200).json({ status: 200, success: true, message: "Order Found SuccessFully...", data: getOrderId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.updateOrderById = async (req, res) => {
    try {
        let id = req.params.id

        let updateOrderId = await order.findById(id)

        if (!updateOrderId) {
            return res.status(404).json({ status: 404, success: false, message: "Order Not Found" })
        }

        let discount = 0;
        if (req.body.coupenId) {
            const coupens = await coupen.findById(req.body.coupenId);
            if (!coupens || !coupens.active) {
                return res.status(404).json({ status: 404, success: false, message: "Invalid or inactive coupon" });
            }
            discount = coupens.coupenDiscount;
            console.log("discount", discount);
        }

        let totalAmount = 0;
        if (req.body.orderItems) {
            for (let item of req.body.orderItems) {
                const productItem = await product.findById(item.productId);
                if (!productItem) {
                    return res.status(404).json({ status: 404, success: false, message: `Product not found: ${item.productId}` });
                }
                totalAmount += productItem.price * item.quantity;
                console.log("TotalAmout", totalAmount);
            }

        }

        let subTotal = totalAmount

        updateOrderId.subTotal = subTotal

        const discountAmount = (totalAmount * (discount / 100));

        updateOrderId.discount = discountAmount

        totalAmount -= discountAmount

        updateOrderId.totalAmount = totalAmount

        updateOrderId.save();


        updateOrderId = await order.findByIdAndUpdate(id, { ...req.body }, { new: true })

        return res.status(200).json({ status: 200, success: true, message: "Order Update SuccessFully...", data: updateOrderId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.deleteOrderById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteOrderId = await order.findById(id)

        if (!deleteOrderId) {
            return res.status(404).json({ status: 404, success: false, message: "Order Not Found" })
        }

        await order.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, success: true, message: "Order Delete SuccessFully...." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.getMyOrders = async (req, res) => {
    try {
        let id = req.params.id

        let checkUserId = await order.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'orderItems.productId',
                    foreignField: '_id',
                    as: 'productData'
                }
            },
            {
                $lookup: {
                    from: "subcategories",
                    localField: "productData.subCategoryId",
                    foreignField: "_id",
                    as: "subCategoryData"
                }
            }
        ])


        if (!checkUserId) {
            return res.status(404).json({ status: 404, success: false, message: "Order Not Found" })
        }

        return res.status(200).json({ status: 200, success: true, message: "Order Found SuccessFully...", data: checkUserId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.changeOrderStatusById = async (req, res) => {
    try {
        let id = req.params.id

        let { status } = req.body

        let changeOrderStatusId = await order.findOne({ "orderItems._id": id })

        if (!changeOrderStatusId) {
            return res.status(404).json({ status: 404, success: false, message: "Order Not Found" })
        }

        let orderItem = changeOrderStatusId.orderItems.find(item => item._id.toString() === id);

        if (!orderItem) {
            return res.status(404).json({ status: 404, success: false, message: "Order Item Not Found" });
        }

        orderItem.status = status;

        await changeOrderStatusId.save();

        return res.status(200).json({ status: 200, success: true, message: "Order Status Updated SuccessFully...", data: changeOrderStatusId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.cancelOrder = async (req, res) => {
    try {
        let id = req.params.id

        let { reason } = req.body;

        let checkOrder = await order.findOne({ "orderItems._id": id })

        if (!checkOrder) {
            return res.status(404).json({ status: 404, success: false, message: "Order Not Found" })
        }

        let orderItem = checkOrder.orderItems.find(item => item._id.toString() === id);

        if (!orderItem) {
            return res.status(404).json({ status: 404, success: false, message: "Order Item Not Found" });
        }

        orderItem.status = "Cancelled";

        orderItem.reason = reason;

        await checkOrder.save();

        return res.status(200).json({ status: 200, success: true, message: "Order Canceled SuccessFully...", data: checkOrder })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.deleteAllOrders = async (req, res) => {
    try {
        let deleteAllOrders = await order.deleteMany({});

        if (deleteAllOrders.deletedCount === 0) {
            return res.status(404).json({ status: 404, status: false, message: "Order Not found" });
        }

        return res.status(200).json({ status: 200, success: true, message: "All Orders Delete SuccessFully..." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}