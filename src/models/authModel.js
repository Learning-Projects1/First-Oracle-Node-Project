const oracledb = require('oracledb');

class AuthModel {
  static async createUser(username, email, password) {
    let connection;

    try {
      connection = await oracledb.getConnection();
      const result = await connection.execute(
        `INSERT INTO users (username, email, password) VALUES (:username, :email, :password)`,
        { username, email, password }
      );

      return result.rowsAffected === 1;
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err.message);
        }
      }
    }
  }

  static async findUserByEmail(email) {
    let connection;

    try {
      connection = await oracledb.getConnection();
      const result = await connection.execute(
        `SELECT * FROM users WHERE email = :email`,
        { email },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      return result.rows[0];
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err.message);
        }
      }
    }
  }
}

module.exports = AuthModel;
