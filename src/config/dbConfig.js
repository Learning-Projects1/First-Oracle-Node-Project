// config/dbConfig.js
const oracledb = require('oracledb');
const dotenv = require('dotenv');

dotenv.config();

const {
  ORACLE_DB_USER,
  ORACLE_DB_PASSWORD,
  ORACLE_DB_CONNECTION_STRING,
} = process.env;

async function initialize() {
  await oracledb.createPool({
    user: ORACLE_DB_USER,
    password: ORACLE_DB_PASSWORD,
    connectString: ORACLE_DB_CONNECTION_STRING,
  });
}

module.exports.initialize = initialize;