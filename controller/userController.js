const user = require('../models/user.models')
const bcrypt = require('bcrypt')

exports.createAdminUser = async (req, res) => {
    try {
        let { name, email, password, mobileNo, address, image } = req.body

        let existName = await user.findOne({ name })

        if (existName) {
            return res.status(409).json({ status: 409, message: "Name Already Exist" })
        }

        if (!req.file) {
            return res.status(401).json({ status: 401, message: "Image File Is Required" })
        }

        const salt = await bcrypt.genSalt(10)
        const hasPassword = await bcrypt.hash(password, salt)

        existName = await user.create({
            name,
            email,
            password: hasPassword,
            mobileNo,
            address,
            image: req.file.path,
            role: "admin"
        });

        return res.status(201).json({ status: 201, message: "Admin User Created SuccessFully...", Adminuser: existName })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.createUser = async (req, res) => {
    try {
        let { name, email, password, mobileNo, address, image } = req.body

        let existUserName = await user.findOne({ name })

        if (existUserName) {
            return res.status(404).json({ status: 404, message: "Name Already Exist" })
        }

        if (!req.file) {
            return res.status(401).json({ status: 401, message: "Image File Is Required" })
        }

        let salt = await bcrypt.genSalt(10)
        let hasPassword = await bcrypt.hash(password, salt)

        existUserName = await user.create({
            name,
            email,
            password: hasPassword,
            mobileNo,
            address,
            image: req.file.path,
            role: "user"
        })

        return res.status(201).json({ status: 201, message: "User Create SuccessFully...", user: existUserName })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedUsers;

        paginatedUsers = await user.find()

        let count = paginatedUsers.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "User Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedUsers = await paginatedUsers.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalUsers: count, message: "All Users Found SuccessFully...", users: paginatedUsers })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getUserById = async (req, res) => {
    try {
        let id = req.params.id

        let getUserId = await user.findById(id)

        if (!getUserId) {
            return res.status(404).json({ status: 404, message: "User Not Found" })
        }

        return res.status(200).json({ status: 200, message: "User Found SuccessFully...", user: getUserId });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updateUserById = async (req, res) => {
    try {
        let id = req.params.id

        let updateUserId = await user.findById(id)

        if (!updateUserId) {
            return res.status(404).json({ status: 404, message: "User Not Found" })
        }

        if (req.file) {
            req.body.image = req.file.path
        }
        
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10)
            req.body.password = await bcrypt.hash(req.body.password, salt)
        }

        updateUserId = await user.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, message: "User Updated SuccessFully...", user: updateUserId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.deleteUserById = async (req, res) => {
    try {
        let id = req.params.id

        let deleteUserId = await user.findById(id)

        if (!deleteUserId) {
            return res.status(404).json({ status: 404, message: "User Not Found" })
        }

        await user.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, message: "User Delete SuccessFully..." })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message })
    }
}