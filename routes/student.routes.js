module.exports = app => {
    const studentController = require("../controllers/student.controller");
    const verifyToken = require('../controllers/functions/verifyToken.middleware');
    
    let router = require("express").Router();

    //Students routes
    router.get("/list", verifyToken, studentController.GetAllStudents);
    router.put("/update/:id", verifyToken, studentController.UpdateStudent);
    router.get("/find/:id", verifyToken, studentController.GetStudentByID);
    router.post("/findById", verifyToken, studentController.FindStudentById);
    router.post("/create", verifyToken, studentController.CreateStudent);
    router.delete("/delete", verifyToken, studentController.DeleteStudent);
    router.delete("/deleteStudent", verifyToken, studentController.DeleteStudentSQL);
    router.get("/search", verifyToken, studentController.SearchStudent);
    router.post("/findByClass", verifyToken, studentController.FindStudentsInClass);

    //Defining API Root URL
    app.use('/api/students', router);
}