
const endPoints = Object.freeze({

    middleRoute : '/api/',

//*********************************************Authentication end points ***************************************************/
    signup : 'auth/signup',
    login : 'auth/login',

//*********************************************Customer end points ***************************************************/
    addCustomer : 'customer/addCustomer',
    getCustomers : 'customer/getCustomers',

})

module.exports = endPoints
