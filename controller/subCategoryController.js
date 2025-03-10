const subCategory = require('../models/subCategoryModels')

exports.createSubCategory = async (req, res) => {
    try {
        let { categoryId, subCategoryName, subCategoryImage, status } = req.body

        let existSubCategory = await subCategory.findOne({ categoryId, subCategoryName })

        if (existSubCategory) {
            return res.status(409).json({ status: 409, success: false, message: "SubCategory Already Added..." })
        }

        if (!req.file) {
            return res.status(401).json({ status: 401, success: false, message: "Sub Category Image is Required" })
        }

        subCategoryName = subCategoryName.trim().toLowerCase()

        existSubCategory = await subCategory.create({
            categoryId,
            subCategoryName,
            subCategoryImage: req.file.path,
            status
        });

        return res.status(201).json({ status: 201, success: true, message: "SubCategory Create SuccessFully...", data: existSubCategory })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.getAllSubCategory = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, success: false, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedSubCategory;

        paginatedSubCategory = await subCategory.find();

        let count = paginatedSubCategory.length

        if (count === 0) {
            return res.status(404).json({ status: 404, success: false, message: "Sub Category Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedSubCategory = await paginatedSubCategory.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, success: true, totalSubCategory: count, message: "All Sub Category Found SuccessFully...", data: paginatedSubCategory })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.getSubCategoryById = async (req, res) => {
    try {
        let id = req.params.id

        let getSubCategoryId = await subCategory.findById(id)

        if (!getSubCategoryId) {
            return res.status(404).json({ status: 404, success: false, message: "Sub Category Not Found" })
        }

        return res.status(200).json({ status: 200, success: true, message: "Sub Category Found SuccessFully...", data: getSubCategoryId });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.updateSubCategoryById = async (req, res) => {
    try {
        let id = req.params.id

        let updateSubCategoryId = await subCategory.findById(id)

        if (!updateSubCategoryId) {
            return res.status(404).json({ status: 404, success: false, message: "Sub Category Not Found" })
        }

        if (req.file) {
            req.body.subCategoryImage = req.file.path
        }

        updateSubCategoryId = await subCategory.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, success: true, message: "Sub Category Updated SuccesssFully...", data: updateSubCategoryId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.deleteSubCategoryById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteSubCategoryId = await subCategory.findById(id)

        if (!deleteSubCategoryId) {
            return res.status(404).json({ status: 404, success: false, message: "Sub Category Not Found" })
        }

        await subCategory.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, success: true, message: "Sub Category Delete SuccessFully..." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.deleteAllSubCatrgory = async (req, res) => {
    try {
        let deleteSubCategory = await subCategory.deleteMany({});

        if (deleteSubCategory.deletedCount === 0) {
            return res.status(404).json({ status: 404, status: false, message: "subCategory Not found" });
        }

        return res.status(200).json({ status: 200, success: true, message: "All subCategory Delete SuccessFully..." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}