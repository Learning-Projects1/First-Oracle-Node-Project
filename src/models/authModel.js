const oracledb = require('oracledb');
const bcrypt = require('bcrypt')
const saltRounds = 10;
const jwt = require('jsonwebtoken')
const {closeDbConnection}  = require('../utils/helper_functions/closeDbConnection');
require('dotenv').config();

class AuthModel {

  //******************************************************** Create user ******************************************************************************************/  
  static async createUser(userName, email, plainPassword) {
    let connection;

    try {

      let hashedPassword;
      try {
        hashedPassword = await AuthModel.hashPassword(plainPassword);
      } catch (hashError) {
        console.error('Error hashing password:', hashError);
        throw new Error('Error hashing password');
      }

      connection = await oracledb.getConnection();
      const result = await connection.execute(
        "INSERT INTO ADM_USER (USER_ID, USER_EMAILID, USER_PWD) VALUES (:userName, :email, :password)",
        { userName, email, password: hashedPassword }
      );

      connection.execute("COMMIT");

      return result.rowsAffected === 1;
    } finally {
      closeDbConnection(connection)
    }
  }


  static async hashPassword(plainPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(saltRounds, (saltError, salt) => {
        if (saltError) {
          reject(saltError);

        } else {
          bcrypt.hash(plainPassword, salt, (hashError, hashedPassword) => {
            if (hashError) {
              reject(hashError);
            } else {
              resolve(hashedPassword);
            }
          });
        }
      });
    });
  }


  //******************************************************** Find user by userName ********************************************************************************/  
  static async findUserById(userName) {
    let connection;

    try {
      connection = await oracledb.getConnection();
      const result = await connection.execute(
        "SELECT COUNT(*) AS user_count FROM ADM_USER WHERE USER_ID = :userName",
        { userName },
      );

      return result.rows[0] > 0;

    } finally {
      closeDbConnection(connection);
    }
  }

  //******************************************************** Find user by email ***********************************************************************************/  
  static async findUserByEmail(email) {
    let connection;

    try {
      connection = await oracledb.getConnection();
      const result = await connection.execute(
        "SELECT COUNT(*) AS user_count FROM ADM_USER WHERE USER_EMAILID = :email",
        { email },
      );

      return result.rows[0] > 0;
    } finally {
      closeDbConnection(connection);
    }
  }



  //******************************************************** Compare password ***********************************************************************************/  
  static async comparePassword(userName,plainPassword) {

    let hashedPassword  = await this.getUserPassword(userName)

    if(!hashedPassword || hashedPassword === ''){
      return false
    }else{

      try{

        console.log("Plain password==>"+plainPassword+"  Hash==>"+hashedPassword)

        const result = bcrypt.compare(`${plainPassword}`, `${hashedPassword}`);
        return result;
      }catch(err){
        console.error("Compare error ==>"+ err)
        return false
      }

    }

  }

    /// Getting user hashed password
    static async getUserPassword(userName){
      let connection;
      try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
          "SELECT USER_PWD FROM ADM_USER WHERE USER_ID = :userName",
          { userName },
        );
  
        return result.rows[0];
      } finally {
        closeDbConnection(connection);
      }
    }

  //******************************************************** Generate token ***********************************************************************************/  
  static async generateBearerToken(userName){
    try{
      const payload = {
        time : Date(),
        userName : userName
      };
      const options = {expiresIn : '10m'};
      const jwtSeceretKey = process.env.JWT_SECRET_KEY;
  
      console.log("Secret key ==>"+ jwtSeceretKey)

      const token = jwt.sign(payload, jwtSeceretKey, options)
  
      return token;
    }catch(err){
      console.error("Token error==>"+err)
      return ''
    }
  }



}

module.exports = AuthModel;
