const CustomerModel = require('../models/customerModel');
const { authenticateToken } = require('../utils/helper_functions');


class CustomerController{

    async addCustomer(req, res){
        try{

            // await authenticateToken(req,res)

            const {customerCode, customerName, customerEmail} = req.body;

            if(customerCode === null || customerCode === undefined || customerCode.trim() === ''){
                return res.status(400).json({
                    "isSuccessful" : false,
                    "message" : "Customer code is required",
                })  
            }else if(customerName === null || customerName === undefined || customerName === ''){
                return res.status(400).json({
                    "isSuccessful" : false,
                    "message" : "Customer Name is required",
                }) 
            }else if(customerEmail === null || customerEmail === undefined || customerEmail === ''){
                return res.status(400).json({
                    "isSuccessful" : false,
                    "message" : "Customer Email is required",
                }) 
            }else{
                await CustomerModel.addCustomer(customerCode, customerName, customerEmail)

                return res.status(201).json({
                    "isSuccessful" : true,
                    "message" : "Customer added successfully",
                })
            }

        }catch(err){
            return res.status(500).json({
                "isSuccessful" : false,
                "message" : "Internal server error",
                "error" : err.message,
            })
        }
    }


    async getCustomers(req, res){
        try{

            // await authenticateToken(req,res)
            
            const customers = await CustomerModel.getCustomers();
            
            return res.status(200).json({
                "isSuccessful" : true,
                "message" : "Success",
                "customers" : customers,
            })
        }catch(err){
            return res.status(500).json({
                "isSuccessful" : false,
                "message" : "Internal server error",
                "error" : err.message,
            })
        }
    }

}

module.exports = new CustomerController();