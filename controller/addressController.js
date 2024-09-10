const address = require('../models/addressModels')

exports.createAddress = async (req, res) => {
    try {
        let { userId, houseNo, floor, area, localtiy } = req.body

        addressData = `${houseNo},${floor},${area},${localtiy}`

        createAddress = await address.create({
            userId,
            address: addressData
        });

        return res.status(201).json({ status: 201, message: 'Delivery Address Created SuccessFully...', address: createAddress })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllAddress = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedAdddress

        paginatedAdddress = await address.find();

        let count = paginatedAdddress.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Address Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedAdddress = await paginatedAdddress.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalAddress: count, message: "All Address Found SuccessFully...", address: paginatedAdddress })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAddressById = async (req, res) => {
    try {
        let id = req.params.id

        let getAddressId = await address.findById(id)

        if (!getAddressId) {
            return res.status(404).json({ status: 404, message: "Address Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Address Found SuccessFully...", address: getAddressId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateAddressById = async (req, res) => {
    try {
        let id = req.params.id

        let updateAddressId = await address.findById(id)

        if (!updateAddressId) {
            return res.status(404).json({ status: 404, message: "Address Not Found" })
        }

        updateAddressId = await address.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, message: 'Address Updated SuccessFully....', address: updateAddressId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteAddressById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteAddressId = await address.findById(id)

        if (!deleteAddressId) {
            return res.status(404).json({ status: 404, message: "Address Not Found" })
        }

        await address.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, message: "Address Delete SuccessFully..." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}