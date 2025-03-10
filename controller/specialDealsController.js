const specialDeals = require('../models/specialDealsModels')

exports.createSpecialDeals = async (req, res) => {
    try {
        let { title, subTitle, productId, discount } = req.body

        let existSpecialDeals = await specialDeals.findOne({ title })

        if (existSpecialDeals) {
            return res.status(409).json({ status: 409, success: false, message: "SpecialDeal Alredy Added.." })
        }

        existSpecialDeals = await specialDeals.create({
            title,
            subTitle,
            productId,
            discount
        });

        return res.status(201).json({ status: 201, success: true, message: "SpecialDeal Create SuccessFully...", data: existSpecialDeals })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.getAllSpecialDeals = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, success: false, message: "Page And Page Size Cann't Be Less Than 1" })
        }

        let paginatedSpecialDeals;

        paginatedSpecialDeals = await specialDeals.find().populate('productId');

        let count = paginatedSpecialDeals.length

        if (count === 0) {
            return res.status(404).json({ status: 404, success: false, message: "Special Deals Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedSpecialDeals = await paginatedSpecialDeals.slice(startIndex, lastIndex)
        }

        return res.status(201).json({ status: 201, success: true, totalSpecialDeals: count, message: "All Special Deals Found SuccessFully...", data: paginatedSpecialDeals })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.getSpecialDealById = async (req, res) => {
    try {
        let id = req.params.id

        let getSpecialDealId = await specialDeals.findById(id)

        if (!getSpecialDealId) {
            return res.status(404).json({ status: 404, success: false, message: "Special Deal Not Found" })
        }

        return res.status(200).json({ status: 200, success: true, message: "Special Deal Found SuccessFully...", data: getSpecialDealId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.updateSpecialDealById = async (req, res) => {
    try {
        let id = req.params.id

        let updateSpecialDealId = await specialDeals.findById(id)

        if (!updateSpecialDealId) {
            return res.status(404).json({ status: 404, success: false, message: "SpecialDeal Not Found" })
        }

        updateSpecialDealId = await specialDeals.findByIdAndUpdate(id, { ...req.body }, { new: true })

        return res.status(200).json({ status: 200, success: true, message: "SpecialDeal Updated SuccessFully...", data: updateSpecialDealId });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.deleteSpecialDealById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteSpecialDealId = await specialDeals.findById(id)

        if (!deleteSpecialDealId) {
            return res.status(404).json({ status: 404, success: false, message: "SpecialDeal Not Found" })
        }

        await specialDeals.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, success: true, message: "SpecialDeal Delete SuccessFully..." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.deleteAllSpecialDeal = async (req, res) => {
    try {
        await specialDeals.deleteMany({});

        return res.status(200).json({ status: 200, success: true, message: "All SpecialDeal Delete SuccessFully..." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}