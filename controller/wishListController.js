const wishList = require('../models/wishListModels')

exports.createWishList = async (req, res) => {
    try {
        let { userId, productId } = req.body

        let existWishList = await wishList.findOne({ userId, productId })

        if (existWishList) {
            return res.status(409).json({ status: 409, message: "WishList Alredy Added..." })
        }

        existWishList = await wishList.create({
            userId,
            productId
        });

        return res.status(201).json({ status: 201, message: "WishList Created SuccessFully...", wishList: existWishList })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllWishList = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedWishList;

        paginatedWishList = await wishList.find()
        let count = paginatedWishList.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "WishList Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedWishList = await paginatedWishList.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalWishList: count, message: "All WishList Found SuccessFully...", wishList: paginatedWishList })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getWishListById = async (req, res) => {
    try {
        let id = req.params.id

        let getWishListId = await wishList.findById(id)

        if (!getWishListId) {
            return res.status(404).json({ status: 404, message: "WishList Not Found" })
        }

        return res.status(200).json({ status: 200, message: "WishList Found SuccessFully...", wishList: getWishListId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteWishListById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteWishListId = await wishList.findById(id)

        if (!deleteWishListId) {
            return res.status(404).json({ status: 404, message: "WishList Not Found" })
        }

        await wishList.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, message: "WishList Delete SuccessFully..." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}