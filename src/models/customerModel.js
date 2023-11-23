const oracledb = require('oracledb')


class CustomerModel{

    static async addCustomer(customerCode, customerName, customerEmail){
        let connection;

        try{
            connection = await oracledb.getConnection();
            const result = await connection.execute(
                "INSERT INTO OM_CUSTOMER (CUST_CODE, CUST_NAME, CUST_EMAILID) VALUES (:customerCode, :customerName, :customerEmail)",
                {customerCode, customerName, customerEmail}
            )

            // Commit the transaction
            await connection.execute("COMMIT");

            return result.rowsAffected === 1;

        }finally{
            if(connection){
                try{
                    await connection.close();
                }catch(err){
                    console.error(err.message);
                }
            }
        }
    }

    static async getCustomers(){
        let connection;

        try{
            connection = await oracledb.getConnection();

            const result = await connection.execute(
               "SELECT CUST_CODE, CUST_NAME,CUST_EMAILID FROM OM_CUSTOMER" 
            )

          const customers = result.rows.map(row => ({
            customerCode: row[0],
            customerName: row[1],
            customerEmail: row[2]
          }));


          return customers;

        }finally{
            if(connection){
                try{
                    connection.close()
                }catch(err){
                    console.error(err.message)
                }
            }
        }
    }


}

module.exports = CustomerModel;