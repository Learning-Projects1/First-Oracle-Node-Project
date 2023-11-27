
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
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Init Error:', error);
  }
}

start();


app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);




// Handle end point not found errors
app.use((req, res) => {
  console.error(req.body)
  res.status(404).json({ error: 'Endpoint Not Found'});
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});
