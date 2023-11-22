const express = require('express')
const customerController = require('../controllers/customerController')
const router = express.Router()


router.get('/getCustomers', customerController.getCustomers)
router.post('/addCustomer', customerController.addCustomer)


module.exports = router;