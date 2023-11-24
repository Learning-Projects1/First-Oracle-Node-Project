const express = require('express')
const customerController = require('../controllers/customerController')
const endPoints = require('../utils/endPoints')
const router = express.Router()


// router.get(endPoints.getCustomers, customerController.getCustomers)
// router.post(endPoints.addCustomer, customerController.addCustomer)

router.get('/getCustomers', customerController.getCustomers)
router.post('/addCustomer', customerController.addCustomer)

module.exports = router;