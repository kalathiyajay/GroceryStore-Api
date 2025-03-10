const coupen = require('../models/couponModels')

exports.createCoupen = async (req, res) => {
    try {
        let { coupenName, coupenCode, coupenDiscount, description, coupenImage, type, startDate, expiryDate, active } = req.body

        let existCoupen = await coupen.findOne({ coupenName })

        if (existCoupen) {
            return res.status(409).json({ status: 409, success: false, message: "Coupen Alredy Added" })
        }

        if (!req.file) {
            return res.status(401).json({ status: 401, success: false, message: "Coupen Image Is Required" })
        }

        existCoupen = await coupen.create({
            coupenName,
            coupenCode,
            coupenDiscount,
            description,
            startDate,
            expiryDate,
            coupenImage: req.file.path,
            type,
            active
        });

        return res.status(201).json({ status: 201, success: true, message: "Coupen Created SuccessFully...", data: existCoupen })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.getAllCoupens = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, success: false, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedCoupens;

        paginatedCoupens = await coupen.find()

        let count = paginatedCoupens.length

        if (count === 0) {
            return res.status(404).json({ status: 404, success: false, message: "Coupen Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedCoupens = await paginatedCoupens.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, success: true, totalCoupens: count, message: "All Coupens Found SuccessFully...", data: paginatedCoupens })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.getCoupenById = async (req, res) => {
    try {
        let id = req.params.id

        let getCoupenId = await coupen.findById(id)

        if (!getCoupenId) {
            return res.status(404).json({ status: 404, success: false, message: "Coupen Not Found" })
        }

        return res.status(200).json({ status: 200, success: true, message: "Coupen Found SuccessFully...", data: getCoupenId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.updateCoupenById = async (req, res) => {
    try {
        let id = req.params.id

        let updateCoupenId = await coupen.findById(id)

        if (!updateCoupenId) {
            return res.status(404).json({ status: 404, success: false, message: "Coupen Not Found" })
        }

        if (req.file) {
            req.body.coupenImage = req.file.path
        }

        updateCoupenId = await coupen.findByIdAndUpdate(id, { ...req.body }, { new: true })

        return res.status(200).json({ status: 200, success: true, message: "Coupen Update SuccessFully...", data: updateCoupenId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.updateCoupenStatusById = async (req, res) => {
    try {
        let id = req.params.id

        let { active } = req.body

        let updateCoupenStatusId = await coupen.findById(id)

        if (!updateCoupenStatusId) {
            return res.status(404).json({ status: 404, success: false, message: "Coupen Not Found" })
        }

        updateCoupenStatusId.active = active

        updateCoupenStatusId.save();

        return res.status(200).json({ status: 200, success: true, message: "Coupen Status Update SuccessFully...", data: updateCoupenStatusId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.deleteCoupenById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteCoupenId = await coupen.findById(id)

        if (!deleteCoupenId) {
            return res.status(404).json({ status: 404, success: false, message: "Coupen Not Found" })
        }

        await coupen.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, success: true, message: "Coupen Delete SuccessFully..." });

    } catch (error) {
        console.error(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.deleteAllCoupens = async (req, res) => {
    try {
        let deleteAllCoupens = await coupen.deleteMany({});

        if (deleteAllCoupens.deletedCount === 0) {
            return res.status(404).json({ status: 404, status: false, message: "Coupen Not found" });
        }

        return res.status(200).json({ status: 200, success: true, message: "All Coupens Delete SuccessFully..." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}