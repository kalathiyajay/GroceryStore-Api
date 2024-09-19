const category = require('../models/categoryModels')

exports.createCategory = async (req, res) => {
    try {
        let { categoryName, categoryImage } = req.body

        let existCategory = await category.findOne({ categoryName })

        if (existCategory) {
            return res.status(404).json({ status: 404, success: false, message: "category Already added..." })
        }

        if (!req.file) {
            return res.status(401).json({ status: 401, success: false, message: "Category Image is Required" })
        }

        existCategory = await category.create({
            categoryName,
            categoryImage: req.file.path
        });

        return res.status(201).json({ status: 201, success: true, message: "category Created SuccessFully...", data: existCategory })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.getAllCategories = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(404).json({ status: 404, success: false, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedCategories

        paginatedCategories = await category.find()

        let count = paginatedCategories.length

        if (count === 0) {
            return res.status(404).json({ status: 404, success: false, message: "Category Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedCategories = await paginatedCategories.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, success: true, totalCategory: count, message: "All Category Found SuccessFully...", data: paginatedCategories })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.getCategoryById = async (req, res) => {
    try {
        let id = req.params.id

        let getCategoryId = await category.findById(id)

        if (!getCategoryId) {
            return res.status(404).json({ status: 404, success: false, message: "Category Not Found" })
        }

        return res.status(200).json({ status: 200, success: true, message: "category Found SuccessFully...", data: getCategoryId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.updateCategoryById = async (req, res) => {
    try {
        let id = req.params.id

        let updateCategoryId = await category.findById(id)

        if (!updateCategoryId) {
            return res.status(404).json({ status: 404, success: false, message: "Category Not Found" })
        }

        if (req.file) {
            req.body.categoryImage = req.file.path
        }

        updateCategoryId = await category.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, success: true, message: "Category Updated SuccessFully...", data: updateCategoryId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.deleteCategoryById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteCategoryId = await category.findById(id)

        if (!deleteCategoryId) {
            return res.status(404).json({ status: 404, success: false, message: "Category Not Found" })
        }

        await category.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, success: true, message: "Category Delete SuccessFully..." });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}