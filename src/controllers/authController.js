// controllers/authController.js
const AuthModel = require('../models/authModel');

class AuthController {


  //***************************************************************************************************************************************************************/  
  //******************************************************** Sign Up *********************************************************************************************/  
  //***************************************************************************************************************************************************************/  
  async signup(req, res) {
    try {
      const { userName, email, password } = req.body;

      console.log(req.body);

      if(!userName || userName.trim() === ''){
        res.status(400).json({
          "isSuccessful": false,
          "message": "userName is required"
        });

      }

      else if(!email || email.trim() === ''){
        res.status(400).json({
          "isSuccessful": false,
          "message": "email is required"
        });

      }

      else if(!password || password.trim() === ''){
        res.status(400).json({
          "isSuccessful": false,
          "message": "password is required"
        });
      }

      else if(await AuthModel.findUserById(userName) === true){
        res.status(400).json({
          "isSuccessful": false,
          "message": "username is not available"
        });

      }

      else if(await AuthModel.findUserByEmail(email) === true){
        res.status(400).json({
          "isSuccessful": false,
          "message": "Email is not available"
        });
      }
      
      else{

        await AuthModel.createUser(userName, email, password);

        res.status(201).json({
          "isSuccessful": true,
          "message": "Account created successfully"
        });
      }

    } catch (error) {
      console.error(error);
      res.status(500).json({
        "isSuccessful": false,
        "message": 'Internal Server Error',
        "error": error.message,
      });
    }
  }


  //***************************************************************************************************************************************************************/  
  //******************************************************** Login ***********************************************************************************************/  
  //***************************************************************************************************************************************************************/  
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await AuthModel.findUserByEmail(email);

      if (user && user.password === password) {
        res.json({ message: 'Login successful' });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  }
}

module.exports = new AuthController();
