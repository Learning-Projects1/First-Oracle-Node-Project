

async function closeDbConnection(connection) {
  if (connection) {
    try {
      await connection.close();
    } catch (err) {
      console.error(err.message);
    }
  }
}

module.exports = {
  closeDbConnection: closeDbConnection
};