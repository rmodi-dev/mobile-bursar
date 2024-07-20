module.exports = app => {
    const financeController = require("../controllers/finance.controller");
    const verifyToken = require('../controllers/functions/verifyToken.middleware');
    
    let router = require("express").Router();    

    //Finance API Routes URLs
    router.post("/registerFeesPayment", verifyToken, financeController.RegisterPayment);
    router.post("/setClassFees", verifyToken, financeController.SetClassFees);
    router.get("/searchFeesInRange", verifyToken, financeController.SearchPayments);
    router.get("/feesBalances", verifyToken, financeController.ListFeesBalances);
    router.get("/feesTotals", verifyToken, financeController.TotalFeesInPeriod);

    //Defining API Root URL
    app.use('/api/finance', router);
}