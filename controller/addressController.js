const address = require('../models/addressModels')

exports.createAddress = async (req, res) => {
    try {
        let { userId, houseNo, pincode, floor, area, locality, yourName, yourPhoneNumber, saveAddressAs, orderFor } = req.body

        let addressData;

        if (floor && floor !== 'undefined') {
            addressData = `${houseNo},${floor},${area},${locality}`;
        } else {
            addressData = `${houseNo},${area},${locality}`;
        }


        createAddress = await address.create({
            userId,
            address: addressData,
            yourName,
            floor,
            area,
            locality,
            yourPhoneNumber,
            saveAddressAs,
            orderFor,
            pincode,
            houseNo
        });

        return res.status(201).json({ status: 201, success: true, message: 'Delivery Address Created SuccessFully...', data: createAddress })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.getAllAddress = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, success: false, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedAdddress

        paginatedAdddress = await address.find();

        let count = paginatedAdddress.length

        if (count === 0) {
            return res.status(404).json({ status: 404, success: false, message: "Address Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedAdddress = await paginatedAdddress.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, success: true, totalAddress: count, message: "All Address Found SuccessFully...", data: paginatedAdddress })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.getAddressById = async (req, res) => {
    try {
        let id = req.params.id

        let getAddressId = await address.findById(id)

        if (!getAddressId) {
            return res.status(404).json({ status: 404, success: false, message: "Address Not Found" })
        }

        return res.status(200).json({ status: 200, success: true, message: "Address Found SuccessFully...", data: getAddressId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.updateAddressById = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            houseNo,
            floor,
            area,
            locality,
            saveAddressAs,
            yourName,
            yourPhoneNumber
        } = req.body;

        const existingAddress = await address.findById(id);

        if (!existingAddress) {
            return res.status(404).json({ status: 404, success: false, message: "Address Not Found" });
        }
        const existingAddressParts = existingAddress.address.split(',');

        let updatedAddressData;
        if (existingAddressParts.length === 4) {
            if (floor && floor !== 'undefined') {
                updatedAddressData = `${houseNo || existingAddressParts[0]},${floor},${area || existingAddressParts[2]},${locality || existingAddressParts[3]}`;
            } else {
                updatedAddressData = `${houseNo || existingAddressParts[0]},${area || existingAddressParts[2]},${locality || existingAddressParts[3]}`;
            }
        } else {
            if (floor && floor !== 'undefined') {
                updatedAddressData = `${houseNo || existingAddressParts[0]},${floor},${area || existingAddressParts[1]},${locality || existingAddressParts[2]}`;
            } else {
                updatedAddressData = `${houseNo || existingAddressParts[0]},${area || existingAddressParts[1]},${locality || existingAddressParts[2]}`;
            }
        }

        const updateData = {
            houseNo,
            floor,
            area,
            locality,
            saveAddressAs,
            address: updatedAddressData,
            saveAddressAs,
            yourName,
            yourPhoneNumber
        };

        const updatedAddress = await address.findByIdAndUpdate(id, updateData, { new: true, });

        return res.status(200).json({ status: 200, success: true, message: 'Address Updated Successfully', data: updatedAddress });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, success: false, message: error.message });
    }
}

exports.deleteAddressById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteAddressId = await address.findById(id)

        if (!deleteAddressId) {
            return res.status(404).json({ status: 404, success: false, message: "Address Not Found" })
        }

        await address.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, success: true, message: "Address Delete SuccessFully..." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.getMyAddress = async (req, res) => {
    try {
        let id = req.params.id

        let getUserAddress = await address.find({ userId: id })

        if (!getUserAddress) {
            return res.status(404).json({ status: 404, success: false, message: "Address Not Found" })
        }

        return res.status(200).json({ status: 200, success: true, message: "Address Found SuccessFully...", data: getUserAddress });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}