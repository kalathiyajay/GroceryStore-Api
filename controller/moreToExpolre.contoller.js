const moreToExplore = require('../models/moreToExplore.models')

exports.createMoreToExplore = async (req, res) => {
    try {
        let { title, description, moreToExploreImage } = req.body

        let existTitle = await moreToExplore.findOne({ title })

        if (existTitle) {
            return res.status(409).json({ status: 409, success: false, message: "Title Alredy Exist" })
        }

        if (!req.file) {
            return res.status(401).json({ status: 401, success: false, message: "MoreToExploreImage File Is Required" })
        }

        existTitle = await moreToExplore.create({
            title,
            description,
            moreToExploreImage: req.file.path
        });

        return res.status(201).json({ status: 201, success: true, message: "moreToExplore Created SuccessFully...", data: existTitle });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.getAllMoreToExplores = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, success: false, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedMoreToExplore;

        paginatedMoreToExplore = await moreToExplore.find()

        let count = paginatedMoreToExplore.length

        if (count === 0) {
            return res.status(404).json({ status: 404, success: false, message: "More To Explore Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedMoreToExplore = await paginatedMoreToExplore.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, success: true, totalMoreToExplore: count, message: "All More To Explore Found SuccessFully...", data: paginatedMoreToExplore });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.getMoreToExploreById = async (req, res) => {
    try {
        let id = req.params.id

        let getMoreToExploreId = await moreToExplore.findById(id)

        if (!getMoreToExploreId) {
            return res.status(404).json({ status: 404, success: false, message: "More To Expore Not Found" })
        }

        return res.status(200).json({ status: 200, success: true, message: "More To Explore Found SuccessFully...", data: getMoreToExploreId });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.updateMoretoExploreById = async (req, res) => {
    try {
        let id = req.params.id

        let updateMoreToExploreId = await moreToExplore.findById(id)

        if (!updateMoreToExploreId) {
            return res.status(404).json({ status: 404, success: false, message: "More To Explore Not Found" })
        }

        if (req.file) {
            req.body.moreToExploreImage = req.file.path
        }

        updateMoreToExploreId = await moreToExplore.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, success: false, message: "More To Explore Update SuccessFully...", data: updateMoreToExploreId });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.deleteMoreToExploreById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteMoreToExploreId = await moreToExplore.findById(id)

        if (!deleteMoreToExploreId) {
            return res.status(404).json({ status: 404, success: false, message: "More To Explore Not Found" })
        }

        await moreToExplore.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, success: true, message: "More To Explore Delete SuccessFully..." });
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}
