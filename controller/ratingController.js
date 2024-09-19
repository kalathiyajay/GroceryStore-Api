const rating = require('../models/ratingModels')

exports.createRating = async (req, res) => {
    try {
        let { name, productId, star, review } = req.body

        let existRating = await rating.findOne({ name, productId })

        if (existRating) {
            return res.status(404).json({ status: 404, success: false, message: "Rating Alredy Added..." })
        }

        existRating = await rating.create({
            name,
            productId,
            star,
            review
        });

        return res.status(201).json({ status: 201, success: true, message: "Rating Created SuccessFully...", data: existRating })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.getAllRatings = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, success: false, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedRating;

        paginatedRating = await rating.find()

        let count = paginatedRating.length

        if (count === 0) {
            return res.status(404).json({ status: 404, success: false, message: "Rating Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedRating = await paginatedRating.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, success: true, totalRating: count, message: "All Rating Found SuccessFully...", data: paginatedRating })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.getRatingDataById = async (req, res) => {
    try {
        let id = req.params.id

        let getRatingDataId = await rating.findById(id)

        if (!getRatingDataId) {
            return res.status(404).json({ status: 404, success: false, message: "Rating Not Found" })
        }

        return res.status(200).json({ status: 200, success: true, message: "Raing Found SuccessFully...", data: getRatingDataId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.updateRatingDataById = async (req, res) => {
    try {
        let id = req.params.id

        let updateRatingDataId = await rating.findById(id)

        if (!updateRatingDataId) {
            return res.status(404).json({ status: 404, success: false, message: "Rating Not Found" })
        }

        updateRatingDataId = await rating.findByIdAndUpdate(id, { ...req.body }, { new: true })

        return res.status(200).json({ status: 200, success: true, message: "Rating Updated SuccessFully...", data: updateRatingDataId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.deleteRatingDataById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteRatingDataId = await rating.findById(id)

        if (!deleteRatingDataId) {
            return res.status(404).json({ status: 404, success: false, message: "Ratig Not Found" })
        }

        await rating.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, success: true, message: "Rating Delete SuccessFully..." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}