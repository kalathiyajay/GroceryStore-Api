const user = require('../models/user.models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.userLogin = async (req, res) => {
    try {
        let { email, password } = req.body

        let checkUser = await user.findOne({ email })

        if (!checkUser) {
            return res.status(404).json({ status: 404, message: "User Not Found" })
        }

        let checkPassword = await bcrypt.compare(password, checkUser.password)

        if (!checkPassword) {
            return res.status(404).json({ status: 404, message: "Invalid Password" })
        }

        let token = jwt.sign({ _id: checkUser._id }, process.env.SECRET_KEY, { expiresIn: '1D' })

        return res.status(200).json({ status: 200, message: "User Login SuccessFully....", user: checkUser, token: token });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}
