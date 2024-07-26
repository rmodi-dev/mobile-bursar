module.exports = app => {
    const authController = require("../controllers/auth.controller");
    const verifyToken = require('../controllers/functions/verifyToken.middleware');
    
    //Importing router interface from express module
    let router = require("express").Router();    

    //Auth API Routes URLs
    router.post("/login", authController.Login);
    router.post("/register", authController.Register);
    router.post("/checkToken", verifyToken, authController.CheckToken);

    //Auth API Root URL
    app.use('/api/auth', router);
}