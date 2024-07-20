module.exports = app => {
    const authController = require("../controllers/auth.controller");
    
    //Importing router interface from express module
    let router = require("express").Router();    

    //Auth API Routes URLs
    router.get("/login", authController.Login);
    router.post("/register", authController.Register);

    //Auth API Root URL
    app.use('/api/auth', router);
}