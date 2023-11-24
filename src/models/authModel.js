const oracledb = require('oracledb');
const { closeDbConnection } = require('../utils/helper_functions');
const bcrypt = require('bcrypt')
const saltRounds = 10;

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
}

module.exports = AuthModel;
