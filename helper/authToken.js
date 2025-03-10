const user = require('../models/user.models')
const jwt = require('jsonwebtoken')

exports.auth = (roles = []) => {
    return async (req, res, next) => {
        let authorization = req.headers['authorization']

        if (authorization) {
            try {
                let token = await authorization.split(' ')[1]

                if (!token) {
                    return res.status(404).json({ status: 404, success: false, message: "Token Is Required" })
                }

                let checkToken = jwt.verify(token, process.env.SECRET_KEY)

                let checkUser = await user.findById(checkToken)

                req.user = checkUser;

                if (!checkUser) {
                    return res.status(404).json({ status: 404, success: false, message: "User Not Found" })
                }

                if (!roles.includes(checkUser.role)) {
                    return res.status(404).json({ status: 404, success: false, message: "Unauthorize Access" })
                }

                next();

            } catch (error) {
                console.log(error);
                return res.status(500).json({ status: 500, success: false, message: error.message })
            }
        }
        else {
            return res.status(500).json({ status: 500, success: false, message: "Authorization Token Is Require" })
        }
    }
} 