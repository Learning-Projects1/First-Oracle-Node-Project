const oracledb = require('oracledb');
const { closeDbConnection } = require('../utils/helper_functions');

class AuthModel {

  //***************************************************************************************************************************************************************/  
  //******************************************************** Create user ******************************************************************************************/  
  //***************************************************************************************************************************************************************/  
  static async createUser(userName, email, password) {
    let connection;

    try {

      connection = await oracledb.getConnection();
      const result = await connection.execute(
        "INSERT INTO ADM_USER (USER_ID, USER_EMAILID, USER_PWD) VALUES (:userName, :email, :password)",
        { userName, email, password }
      );

      connection.execute("COMMIT");

      return result.rowsAffected === 1;
    } finally {
      closeDbConnection(connection)
    }
  }

  //***************************************************************************************************************************************************************/  
  //******************************************************** Find user by userName ********************************************************************************/  
  //***************************************************************************************************************************************************************/  

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


  //***************************************************************************************************************************************************************/  
  //******************************************************** Find user by email ***********************************************************************************/  
  //***************************************************************************************************************************************************************/  

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
}

module.exports = AuthModel;
