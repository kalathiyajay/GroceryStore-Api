const cart = require('../models/cartModels')

exports.createCartData = async (req, res) => {
    try {
        let { userId, productId, quantity } = req.body

        let existCartData = await cart.findOne({ userId, productId })

        if (existCartData) {
            return res.status(409).json({ status: 409, message: "Cart Data Alredy Added..." })
        }

        existCartData = await cart.create({
            userId,
            productId,
            quantity
        })

        return res.status(201).json({ status: 201, message: "Cart Data Created SuccessFully...", cart: existCartData })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllCartData = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedCartData;

        paginatedCartData = await cart.find();

        let count = paginatedCartData.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Cart Data Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedCartData = paginatedCartData.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalCarts: count, message: "All Cart Data Found SuccessFully...", cart: paginatedCartData })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getCartDataById = async (req, res) => {
    try {
        let id = req.params.id

        let getCartDataId = await cart.findById(id)

        if (!getCartDataId) {
            return res.status(404).json({ status: 404, message: "Cart Data Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Cart Data Found SuccessFully...", cart: getCartDataId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateCartDataById = async (req, res) => {
    try {
        let id = req.params.id

        let updateCartDataId = await cart.findById(id)

        if (!updateCartDataId) {
            return res.status(404).json({ status: 404, message: "Cart Data Not Found" })
        }

        updateCartDataId = await cart.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, message: "Cart Data Updated SuccessFully...", cart: updateCartDataId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateCartQuantityById = async (req, res) => {
    try {
        let id = req.params.id

        let updateCartQuantityId = await cart.findById(id)

        if (!updateCartQuantityId) {
            return res.status(404).json({ status: 404, message: "Cart Data Not Found" })
        }

        updateCartQuantityId = await cart.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, message: "Cart Quantity Updated SuccessFully...", cart: updateCartQuantityId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}


exports.deleteCartDataById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteCartDataId = await cart.findById(id)

        if (!deleteCartDataId) {
            return res.status(404).json({ status: 404, message: "Cart Data Not Found" })
        }

        await cart.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, message: "Cart Data Delete SuccessFully..." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}