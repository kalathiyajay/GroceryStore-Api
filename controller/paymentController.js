const payment = require('../models/paymentModels')
const order = require('../models/orderModels')

exports.createPayment = async (req, res) => {
    try {
        let { orderId, paymentMethod, amount, status } = req.body

        let existPayment = await payment.findOne({ orderId })

        if (existPayment) {
            return res.status(404).json({ status: 404, message: "Payment Alredy Created" })
        }

        let findOrder = await order.findById(orderId)

        paymentMethod = findOrder.paymentMethod
        amount = findOrder.totalAmount

        existPayment = await payment.create({
            orderId,
            paymentMethod,
            amount,
            status: "completed"
        })

        return res.status(201).json({ status: 201, message: "Payment Create SuccessFully...", payment: existPayment })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getAllPayments = async (req, res) => {
    try {
        let page = parseInt(req.query.page)
        let pageSize = parseInt(req.query.pageSize)

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({ status: 401, message: "Page And PageSize Cann't Be Less Than 1" })
        }

        let paginatedPayment;

        paginatedPayment = await payment.find()

        let count = paginatedPayment.length

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "Payment Not Found" })
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize
            let lastIndex = (startIndex + pageSize)
            paginatedPayment = await paginatedPayment.slice(startIndex, lastIndex)
        }

        return res.status(200).json({ status: 200, totalPayments: count, message: "All Payments Found SuccessFully...", payment: paginatedPayment })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.getPaymentById = async (req, res) => {
    try {
        let id = req.params.id

        let getPaymentId = await payment.findById(id)

        if (!getPaymentId) {
            return res.status(404).json({ status: 404, message: "Payment Not Found" })
        }

        return res.status(200).json({ status: 200, message: "Payment Found SuccessFully...", payment: getPaymentId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updatePaymentById = async (req, res) => {
    try {
        let id = req.params.id

        let updatePaymentId = await payment.findById(id)

        if (!updatePaymentId) {
            return res.status(404).json({ status: 404, message: "Payment Not Found" })
        }

        updatePaymentId = await payment.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: 200, message: "Payment Updated SuccessFully...", payment: updatePaymentId })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}

exports.updatePaymentStatusById = async (req, res) => {
    try {
        let id = req.params.id

        let { status } = req.body

        let updatePaymentStatusId = await payment.findById(id)

        if (!updatePaymentStatusId) {
            return res.status(404).json({ status: 404, message: "Payment Not Found" })
        }

        updatePaymentStatusId.status = status

        return res.status(200).json({ status: 200, message: "Payment Status Updated SuccessFully...", payment: updatePaymentStatusId })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
}

exports.deletePaymentById = async (req, res) => {
    try {
        let id = req.params.id

        let deletePaymentId = await payment.findById(id)

        if (!deletePaymentId) {
            return res.status(404).json({ status: 404, message: "Payment Not Found" })
        }

        await payment.findByIdAndDelete(id)

        return res.status(200).json({ status: 200, message: "Payment Delete SuccessFully..." })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: error.message })
    }
}