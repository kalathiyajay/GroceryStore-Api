const cart = require('../models/cartModels')
const product = require('../models/productModels');

exports.createCartData = async (req, res) => {
    try {
        let { userId, productId, quantity } = req.body

        let existCartData = await cart.findOne({ userId, productId })

        if (existCartData) {
            existCartData.quantity += quantity

            await existCartData.save();

            return res.status(200).json({ status: 200, success: true, message: "Cart Data Updated Successfully...", data: existCartData })
        }

        existCartData = await cart.create({
            userId,
            productId,
            quantity
        });

        return res.status(201).json({ status: 201, success: true, message: "Cart Data Created SuccessFully...", data: existCartData })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.getAllCartData = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, success: false, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedCartData;

        paginatedCartData = await cart.find();

        let count = paginatedCartData.length

        if (count === 0) {
            return res.status(404).json({ status: 404, success: false, message: "Cart Data Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedCartData = paginatedCartData.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, success: true, totalCarts: count, message: "All Cart Data Found SuccessFully...", data: paginatedCartData })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.getAllMyCarts = async (req, res) => {
    try {
        let id = req.params.id

        let getMyCarts = await cart.find({ userId: id }).populate('productId');

        if (!getMyCarts) {
            return res.status(404).json({ status: 404, success: false, message: "Carts Not Found" })
        }

        let count = getMyCarts.length

        return res.status(200).json({ status: 200, totalCarts: count, success: true, message: "All My Carts Found SuccessFully...", data: getMyCarts })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.getCartDataById = async (req, res) => {
    try {
        let id = req.params.id

        let getCartDataId = await cart.findById(id)

        if (!getCartDataId) {
            return res.status(404).json({ status: 404, success: false, message: "Cart Data Not Found" })
        }

        return res.status(200).json({ status: 200, success: true, message: "Cart Data Found SuccessFully...", data: getCartDataId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.updateCartDataById = async (req, res) => {
    try {
        let id = req.params.id

        let updateCartDataId = await cart.findById(id)

        if (!updateCartDataId) {
            return res.status(404).json({ status: 404, success: false, message: "Cart Data Not Found" })
        }

        updateCartDataId = await cart.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, success: true, message: "Cart Data Updated SuccessFully...", data: updateCartDataId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.updateCartQuantityById = async (req, res) => {
    try {
        let id = req.params.id

        let updateCartQuantityId = await cart.findById(id)

        if (!updateCartQuantityId) {
            return res.status(404).json({ status: 404, success: false, message: "Cart Data Not Found" })
        }

        updateCartQuantityId = await cart.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, success: true, message: "Cart Quantity Updated SuccessFully...", data: updateCartQuantityId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.deleteCartDataById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteCartDataId = await cart.findById(id)

        if (!deleteCartDataId) {
            return res.status(404).json({ status: 404, success: false, message: "Cart Data Not Found" })
        }

        await cart.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, success: true, message: "Cart Data Delete SuccessFully..." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}