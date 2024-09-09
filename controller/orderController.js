const order = require('../models/orderModels');
const cart = require('../models/cartModels');
const product = require('../models/productModels');
const coupen = require('../models/couponModels')

exports.createOrder = async (req, res) => {
    try {
        let { orderItems, productId, quantity, address, coupenId, paymentMethod, status, subTotal, discount, totalAmount = 0, } = req.body

        orderItems = await cart.find({ userId: userId })// userId: req.user._id

        if (!orderItems) {
            return res.status(404).json({ status: 404, message: "Cart Item Not Found" })
        }

        let coupens;

        if (coupenId) {
            coupens = await coupen.findById(coupenId)
            if (!coupens) {
                return res.status(404).json({ status: 404, messsage: "Coupen Not Found" })
            }

            if (!coupens.active) {
                return res.status(404).json({ status: 404, message: "Coupen Is Not Active" })
            }

            discount = coupens.coupenDiscount
        }

        for (let item of orderItems) {

            const products = await product.findById(item.productId)
            if (!products) {
                return res.status(404).json({ status: 404, message: "Product Not Found" })
            }

            totalAmount += products.price * item.quantity
        }

        subTotal = totalAmount

        const discountAmount = (totalAmount * (discount / 100))

        totalAmount -= discountAmount

        cartItmems = await order.create({
            userId,// userId: req.user._id
            orderItems,
            address,
            paymentMethod,
            coupenId,
            discount: discountAmount,
            status: "pending",
            subTotal,
            totalAmount,
        });

        if (coupens && coupens.active) {
            coupens.active = false;
            await coupens.save();
        }

        await cart.deleteMany({ userId: userId });//userId: req.user._id

        return res.status(201).json({ status: 201, message: "Order Create SuccessFully...", order: cartItmems });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllOrders = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedOrdersData;

        paginatedOrdersData = await order.find()//userId: req.user._id

        let count = paginatedOrdersData.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Order Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedOrdersData = await paginatedOrdersData.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalOrders: count, message: "All Orders Found SuccessFully...", orders: paginatedOrdersData })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getOrderById = async (req, res) => {
    try {
        let id = req.params.id

        let getOrderId = await order.findById(id)

        if (!getOrderId) {
            return res.status(404).json({ status: 404, message: "Order Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Order Found SuccessFully...", order: getOrderId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateOrderById = async (req, res) => {
    try {
        let id = req.params.id

        let updateOrderId = await order.findById(id)

        if (!updateOrderId) {
            return res.status(404).json({ status: 404, message: "Order Not Found" })
        }

        let discount = 0;
        if (req.body.coupenId) {
            const coupens = await coupen.findById(req.body.coupenId);
            if (!coupens || !coupens.active) {
                return res.status(404).json({ status: 404, message: "Invalid or inactive coupon" });
            }
            discount = coupens.coupenDiscount;
            console.log("discount", discount);
        }

        let totalAmount = 0;
        if (req.body.orderItems) {
            for (let item of req.body.orderItems) {
                const productItem = await product.findById(item.productId);
                if (!productItem) {
                    return res.status(404).json({ status: 404, message: `Product not found: ${item.productId}` });
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

        return res.status(200).json({ status: 200, message: "Order Update SuccessFully...", order: updateOrderId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteOrderById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteOrderId = await order.findById(id)

        if (!deleteOrderId) {
            return res.status(404).json({ status: 404, message: "Order Not Found" })
        }

        await order.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, message: "Order Delete SuccessFully...." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getMyOrders = async (req, res) => {
    try {
        let id = req.params.id

        let checkUserId = await order.find({ userId: id })//userId: req.user._id 

        if (!checkUserId) {
            return res.status(404).json({ status: 404, message: "Order Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Order Found SuccessFully...", orders: checkUserId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.changeOrderStatusById = async (req, res) => {
    try {
        let id = req.params.id

        let changeOrderStatusId = await order.findById(id)

        if (!changeOrderStatusId) {
            return res.status(404).json({ status: 404, message: "Order Not Found" })
        }

        changeOrderStatusId = await order.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, message: "Order Status Updated SuccessFully...", order: changeOrderStatusId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.cancelOrder = async (req, res) => {
    try {
        let id = req.params.id

        let { reason } = req.body;

        let checkOrder = await order.findById(id)

        if (!checkOrder) {
            return res.status(404).json({ status: 404, message: "Order Not Found" })
        }

        checkOrder.status = "canceled"

        checkOrder.reason = reason

        checkOrder.save();

        return res.status(200).json({ status: 200, message: "Order Canceled SuccessFully...", order: checkOrder })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}