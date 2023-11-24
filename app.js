
// app.js
const express = require('express');
const dotenv = require('dotenv');
const oracledb = require('oracledb');
const authRoutes = require('./src/routes/authRoutes');
const customerRoutes = require('./src/routes/customerRoutes')
const dbConfig = require('./src/config/dbConfig');
const endPoints = require('./src/utils/endPoints');

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
// app.use(endPoints.middleRoute, authRoutes);
// app.use(endPoints.middleRoute, customerRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);




// Handle 404 errors
app.use((req, res) => {
  console.error(req.body)
  res.status(404).json({ error: 'Endpoint Not Found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});
