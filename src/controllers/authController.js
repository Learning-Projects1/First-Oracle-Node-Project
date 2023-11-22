// controllers/authController.js
const AuthModel = require('../models/authModel');

class AuthController {
  async signup(req, res) {
    try {
      const { username, email, password } = req.body;
      await AuthModel.createUser(username, email, password);

      res.status(201).json({ 
        message: 'User created successfully' 
    });

    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: 'Internal Server Error',
        error: error.message,
    });
    }
  }

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
