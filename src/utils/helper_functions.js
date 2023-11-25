const jwt = require('jsonwebtoken');
require('dotenv').config();



  //***************************************************************************************************************************************************************/  
  //******************************************************** Authenticate bearer token ****************************************************************************/  
  //***************************************************************************************************************************************************************/  
  async function authenticateToken(req,res) {

  console.log("In authenticat token==>" + req.headers['authorization'])

  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      isSuccessful: false,
      message: 'Unauthorized - Bearer token missing'
    });
  }

  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({
       isSuccessful : false,
       message: 'Unauthorized - Invalid Bearer token format' 
      });
  }

  const bearerToken = tokenParts[1];

  jwt.verify(bearerToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        isSuccessful: false,
        message: 'Unauthorized - Invalid token'
      });
    }

    req.user = decoded;
    next();
  });
}


  //***************************************************************************************************************************************************************/  
  //******************************************************** Close database connection ****************************************************************************/  
  //***************************************************************************************************************************************************************/  
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
  closeDbConnection: closeDbConnection,
  authenticateToken: authenticateToken
};