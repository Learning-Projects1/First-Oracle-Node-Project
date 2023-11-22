// const { Connection } = require('oracledb');
// const oracledb = require('oracledb')
// const express = require('express')
// const app = express()
// const port = 3000;

// let connection;


// //Connection to database
// async function connectToDatabase() {
//     try {
//       connection = await oracledb.getConnection({
//         user: 'SYSTEM',
//         password: 'admin',
//         connectString: 'localhost:1521/XEPDB1',
//       });
  
//       console.log('Connected to Oracle Database');
  

//     } catch (err) {
//       console.error('Error connecting to Oracle Database:', err);
//     } 
//   }
 


// //***************************************************************************************************************************************************************/  
// //******************************************************** Get Customers ****************************************************************************************/  
// //***************************************************************************************************************************************************************/  

// app.get('/getCustomers', async (request,response)=>{

//         try{
//           const query = "SELECT CUST_CODE, CUST_NAME,CUST_EMAILID FROM OM_CUSTOMER";
//           const result = await connection.execute(query);
  
//           ///Check empty customers
//           if(result.rows.length === 0){
//             return response.status(404).send({
//               successful: false,
//               message: 'No customers found',
//               users: []
//             });
//           }

//           const users = result.rows.map(row => ({
//             customerCode: row[0],
//             customerName: row[1],
//             customerEmail: row[2]
//           }));

//           return response.status(200).send({
//             successful: true,
//             message: 'Users retrieved successfully.',
//             users: users
//           })

//         }catch(err){
//           return response.status(400).send({
//             successful: false,
//             message: err,
//           })
//         }
  
// })

// //************************************************************************************************************************************************************/  
// //***************************************************************************************************************************************************************/  
// //************************************************************  Main  ****************************************************************************************/  
// //***************************************************************************************************************************************************************/  
// //***************************************************************************************************************************************************************/  


//   connectToDatabase();

//   app.listen(port, ()=>{
//     console.log('rest API is running on port :'+port);
//   })






// app.js
const express = require('express');
const dotenv = require('dotenv');
const oracledb = require('oracledb');
const authRoutes = require('./src/routes/authRoutes');
const customerRoutes = require('./src/routes/customerRoutes')
const dbConfig = require('./src/config/dbConfig');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await dbConfig.initialize();
    
    // Use getConnection to check the connection
    const connection = await oracledb.getConnection();
    await connection.close();

    console.log('Connected to Oracle Database');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to Oracle Database:', error);
  }
}

start();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});
