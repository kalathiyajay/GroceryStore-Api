const productAditional = require('../models/productAditional.models')

exports.createProductAditional = async (req, res) => {
    try {
        let { productId } = req.body

        let existAditionalDetails = await productAditional.findOne({ productId })

        if (existAditionalDetails) {
            return res.status(409).json({ status: 409, message: "Product Aditional Data Alredy Exist" })
        }

        let data = JSON.parse(req.body.data || '[]');
        if (req.files) {
            data.forEach((detail, index) => {
                if (req.files[index]) {
                    detail.image = req.files[index].path;
                }
            });
        }

        existAditionalDetails = await productAditional.create({
            productId,
            data,
        });

        return res.status(201).json({ status: 201, message: "Product Aditional Created SuccessFully...", productAditional: existAditionalDetails })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllProductAditional = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedProductAditional;

        paginatedProductAditional = await productAditional.find()

        let count = paginatedProductAditional.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "ProductAditional Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedProductAditional = await paginatedProductAditional.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalAditionalProducts: count, message: "All ProductAditional Found SuccessFully...", productAditional: paginatedProductAditional })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getProductAditionalById = async (req, res) => {
    try {
        let id = req.params.id

        let getProductAditionalId = await productAditional.findById(id)

        if (!getProductAditionalId) {
            return res.status(404).json({ status: 404, message: "Product Aditional Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Product Aditional Found SuccessFully...", productAditional: getProductAditionalId });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateProductAditionalById = async (req, res) => {
    try {
        let id = req.params.id

        let updateProductAditionalId = await productAditional.findById(id)

        if (!updateProductAditionalId) {
            return res.status(404).json({ status: 404, message: "Product Aditional Not Found" })
        }
        let data = JSON.parse(req.body.data || "[]");

        if (req.files) {
            data.forEach((detail, index) => {
                if (req.files[index]) {
                    detail.image = req.files[index].path;
                }
            });
        }

        updateProductAditionalId.data = data;

        await updateProductAditionalId.save()

        return res.status(200).json({ status: 200, message: "Product Aditional Found SuccessFully...", productAditional: updateProductAditionalId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteProductAdtionalById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteProductAdtionalId = await productAditional.findById(id)

        if (!deleteProductAdtionalId) {
            return res.status(404).json({ status: 404, message: "Product Aditional Not Found" })
        }

        await productAditional.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, message: "Product Aditional Delete SuccessFully..." })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}