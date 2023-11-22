const { Connection } = require('oracledb');
const oracledb = require('oracledb')
const express = require('express')


const app = express()
const port = 3000;

let connection;


//Connection to database
async function connectToDatabase() {
    try {
      connection = await oracledb.getConnection({
        user: 'SYSTEM',
        password: 'admin',
        connectString: 'localhost:1521/XEPDB1',
      });
  
      console.log('Connected to Oracle Database');
  

    } catch (err) {
      console.error('Error connecting to Oracle Database:', err);
    } 
  }
 


//***************************************************************************************************************************************************************/  
//******************************************************** Get Customers ****************************************************************************************/  
//***************************************************************************************************************************************************************/  

app.get('/getCustomers', async (request,response)=>{

        try{
          const query = "SELECT CUST_CODE, CUST_NAME,CUST_EMAILID FROM OM_CUSTOMER";
          const result = await connection.execute(query);
  
          ///Check empty customers
          if(result.rows.length === 0){
            return response.status(404).send({
              successful: false,
              message: 'No customers found',
              users: []
            });
          }

          const users = result.rows.map(row => ({
            customerCode: row[0],
            customerName: row[1],
            customerEmail: row[2]
          }));

          return response.status(200).send({
            successful: true,
            message: 'Users retrieved successfully.',
            users: users
          })

        }catch(err){
          return response.status(400).send({
            successful: false,
            message: err,
          })
        }
  
})

//************************************************************************************************************************************************************/  
//***************************************************************************************************************************************************************/  
//************************************************************  Main  ****************************************************************************************/  
//***************************************************************************************************************************************************************/  
//***************************************************************************************************************************************************************/  


  connectToDatabase();

  app.listen(port, ()=>{
    console.log('rest API is running on port :'+port);
  })