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
          "message": "UserName is required"
        });

      }

      else if(!email || email.trim() === ''){
        res.status(400).json({
          "isSuccessful": false,
          "message": "Email is required"
        });

      }

      else if(!password || password.trim() === ''){
        res.status(400).json({
          "isSuccessful": false,
          "message": "Password is required"
        });
      }

      else if(password.trim().length < 6){
        res.status(400).json({
          "isSuccessful": false,
          "message": "Password length should be at least 6 characters"
        });
      }

      else if(await AuthModel.findUserById(userName) === true){
        res.status(400).json({
          "isSuccessful": false,
          "message": "Username is not available"
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
      const { userName, password } = req.body;

      if(!userName || userName.trim() === ''){
        res.status(400).json({
          "isSuccessful": false,
          "message": 'Username is required',
        })
      }

      else if(!password || password.trim() === ''){
        res.status(400).json({
          "isSuccessful": false,
          "message": 'Password is required',
        })
      }

      else {
        const user = await AuthModel.findUserById(userName);

        if (user && await AuthModel.comparePassword(userName, password)) {
          res.status(200).json({
            "isSuccessful": true,
            "message": 'Logged in successfully',
          })
        } else {
          res.status(400).json({
            "isSuccessful": false,
            "message": 'Invalid credentials',
          })
        }
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



}

module.exports = new AuthController();
