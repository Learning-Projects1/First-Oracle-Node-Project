const jwt = require('jsonwebtoken');
require('dotenv').config();



//***************************************************************************************************************************************************************/  
//******************************************************** Authenticate bearer token ****************************************************************************/  
//***************************************************************************************************************************************************************/  
async function authenticateToken(req, res) {

  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    res.status(401).json({
      isSuccessful: false,
      message: 'Unauthorized - Bearer token missing'
    });
    return false;
  }

  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    res.status(401).json({
      isSuccessful: false,
      message: 'Unauthorized - Invalid Bearer token format'
    });

    return false;
  }

  const bearerToken = tokenParts[1];

  jwt.verify(bearerToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(401).json({
        isSuccessful: false,
        message: 'Unauthorized - Invalid token'
      });

      return false;
    } else {
      req.user = decoded;
      return true;
    }
  });

  if(!req.user || req.user.toString().trim() === ''){
    return false;
  }

  return true;
}

module.exports = {
  authenticateToken: authenticateToken
}