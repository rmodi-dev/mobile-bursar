const db = require("../models");

const Students = db.students;
const StudentFees = db.studentFees;
const ClassFees = db.classFees;
const FeesPayments = db.feesPayments;

const Op = db.Sequelize.Op; //Operator to be used

// retreive all students from the database
exports.GetAllStudents = (req, res) => {
    Students.findAll({ limit: 25 }).then(data => {
        res.status(200).send({ data });
    }).catch(err => {
        console.error("Status 500 message: ", err.message);
        res.status(500).send({ message: err.message || "Error occured while retrieving students" });
    });
}

// Update a specific student
exports.UpdateStudent = async(req, res) => {
    const paramId = req.params.id;

    const foundStudent = await Students.findByPk(paramId, {
        attributes: ['studentId', 'firstName', 'lastName', 'gender', 'currentClass', 'physicalAddress'],
        include: {
            model: StudentFees, attributes: ['studentFeesId', 'studentId', 'classfeesId'],
            include: {
                model: FeesPayments, attributes: ['feesPaymentsId', 'studentfeeId', 'amountPaid', 'datePaid'],
                model: ClassFees, attributes: ['classfeesId', 'feesClass', 'feesAmount', 'feesStatus'],
            }
        }
    });

    if(foundStudent === null){
        res.status(400).send({ message: `No student student with id ${ paramId }` });
        return;
    }

    const {studentId, firstName, lastName, gender, currentClass, physicalAddress, studentFees} = foundStudent.dataValues;

    const {firstName:newFirstName, lastName:newLastName, gender:newGender, currentClass:newClass, physicalAddress:newPhysicalAddress} = req.body;
    
    const { studentFeesId, studentId: studentFeesStudentId, classfeesId, classFee } = studentFees[0].dataValues;

    // console.log("Found classfees dataValues: ", classFee);
    // const {classfeesId: classFeeClassfeesId, feesClass, feesAmount, feesStatus} = classFee.dataValues

    if((firstName === newFirstName) && (lastName === newLastName) && (gender === newGender)
        && (currentClass === newClass) && (physicalAddress === newPhysicalAddress)){
        res.status(400).send({ message: `Nothing to update.` });
        return;
    }

    const currentFees = await StudentFees.findAll({
        attributes: ['studentFeesId', 'studentId', 'classFeesId', 'feesStatus'],
        where: { studentId: studentId, feesStatus: true },
        include: {
            model: ClassFees, attributes: ['classfeesId', 'feesClass', 'feesAmount', 'feesStatus'],
        }
    });

    // console.log("Current studentFees: ", currentFees);

    // const {studentFeesId: currentStudentFeesId, studentId: currentStudentId,
    //     classFeesId: currentClassFeesId, feesStatus: studentFeesStatus } = currentFees[0].dataValues;

    // console.log("Current classFees: ", currentFees[0].dataValues.classFee);

    // const {classfeesId: currentClassfeesId, feesClass: currentFeesClass, feesAmount: currentFeesAmount,
    //     feesStatus: classFeesStatus } = currentFees[0].dataValues.classFee.dataValues;

    let updateData, umsg = "";

    const studentUpdate = {
        firstName: newFirstName,
        lastName: newLastName,
        gender: newGender,
        currentClass: newClass,
        physicalAddress: newPhysicalAddress
    }

    Students.update(studentUpdate, { where: {studentId: studentId} })
    .then(async data => {
        updateData = data;
        if(currentClass !== newClass){
            try{
                const newClassFees = await ClassFees.findOne({ attributes: ['classFeesId', 'feesAmount'], where: { feesClass: newClass } })
                const { classFeesId:newClassFeesId, feesAmount:newFeesAmount } = newClassFees.dataValues;

                const retireFees = await StudentFees.update({ feesStatus: false }, { where: { studentId: studentId }});
                console.log("Retiring old fees ... : ", retireFees);

                const createNewFees = await StudentFees.create({ studentId: studentId, classFeesId: newClassFeesId });
                console.log("Creating new fees ... : ", createNewFees);

                umsg = `Student fees for ${ newClass } created (amount ${ newFeesAmount } ).`;
            } catch(err){
                const msg = `Error occurred while updating details for ${ newFirstName } ${ newLastName }.`
                console.log(err, msg);
            }
        }
    }).then(() => {
        if(updateData == 1){
            res.send({
                status: "Success",
                status_code: 100,
                message: (umsg !== "") ? "Student Updated. "+umsg : "Student Updated."
            });
        }else{
            res.send({
                status: "Error",
                status_code: 101,
                message: `Student with id ${ paramId } was not found. No recorded updated`,
                result: updateData
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            status: "Error",
            status_code: 1001,
            message: err.message || `Error Occurred while updating student ${ firstName } ${ lastName }`
        });
    });
}

// Find Student by ID
exports.GetStudentByID = async(req, res) => {
    const paramId = req.params.id;
    const studentId = await Students.findByPk(paramId);

    if(studentId === null){
        res.status(400).send({ message: `No student student with id ${paramId}` });
        return;
    }

    Students.findByPk(paramId)
    .then( data => { res.status(200).send(data) })
    .catch(err => { res.status(500).send({ message: err.message || "Error in finding a student" }) });
}

// Find a specific student by ID (POST)
exports.FindStudentById = async(req, res) => {
    const bodyId = req.body.id;
    const foundStudent = await Students.findByPk(bodyId);

    if(foundStudent === null){
        res.status(400).send({ message: `Error retrieving student with ID ${ bodyId }.` });
        return;
    }

    Students.findByPk(bodyId)
    .then(data => { res.status(200).send(data) })
    .catch(err => { res.status(500).send({  message: err.message || "Error in finding a student" }) });
}

// Create a student
exports.CreateStudent = async(req, res) => {
    const {firstName, lastName, currentClass, gender, physicalAddress} = req.body;
    let msg = "";

    if (!firstName){ msg = msg + "First name is required. " }
    if (!lastName){ msg = msg + "Last name is required. " }
    if (!currentClass){ msg = msg + "Class is required. " }
    if (!gender){ msg = msg + "Gender is required." }
    if ((gender != 'F') && (gender != 'M')){ 
        msg = msg + "ONLY either F or M is allowed for Gender."
    }
    if ((!firstName) && (!lastName) && (!currentClass) && (!gender)){ 
        msg = "No information submitted. Student's first name, last name, class, and gender are ALL required."
    }

    if(msg !== ""){
        res.status(400).send({ message: `${msg}` });
        return;
    }

    ClassFees.findAll({
        attributes: ['classFeesId', 'feesAmount'],
        where: { feesClass: currentClass, feesStatus: true }
    })
    .then( feesData => {
        if(feesData.length < 1){
            res.status(400).send({ message: `No fees set for ${currentClass}. Fees must be set for a given class before resgistering any student.` });
            return;
        }

        const { classFeesId, feesAmount } = feesData[0].dataValues;
        console.log(`Found ClassFees data: classFeesId:${classFeesId}, feesAmount:${feesAmount}`);
        
        const studentData = {
            firstName: firstName,
            lastName: lastName,
            gender: gender,
            currentClass: currentClass,
            physicalAddress: physicalAddress,
            feesAmount: feesAmount
        }

        Students.create(studentData)
        .then(async data => {
            const student = {
                studentId: data.studentId,
                firstName: firstName,
                lastName: lastName,
                gender: gender,
                currentClass: currentClass,
                physicalAddress: physicalAddress
            }
            await StudentFees.create({ studentId: data.studentId, classFeesId: classFeesId });
            res.send({
                status: "Success",
                status_code: 100,
                message: "Student sucessfully created",
                result: student
            })
        })
    })
    .catch(err => {
        res.status(500).send({
            status: "Error",
            status_code: 1001,
            message: err.message || "Error occurred while creating student"
        });
    });
}

// Delete a student
exports.DeleteStudent = async(req, res) => {
    const foundStudent = await Students.findByPk(req.body.id);

    if(foundStudent === null){
        res.status(400).send({ message: `No student with ID ${ req.body.id } in the database. No record deleted.` } );
        return;
    }

    const studentId = foundStudent.dataValues.studentId;

    Students.destroy({ where: { studentId: studentId } })
    .then(data => {
        if(data == 1){
            res.send({
                status: "Success",
                status_code: 100,
                message: "Student Deleted",
                result: data
            });
        }else{
            res.send({
                status: "Error",
                status_code: 101,
                message: `Student with id ${ req.body.id } was not found. No recorded deleted`,
                result: data
            });
        }
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

// Search Students by first name
exports.SearchStudent = async(req, res) => {
    const firstName = req.query.first_name;
    let condition = firstName ? { firstName: { [Op.like]: `%${firstName}%` }} : null;

    Students.findAll({ where: condition })
    .then(data => { res.send(data) })
    .catch(err => { res.status(500).send({ message: err.message || "Error while searching a student" }) });
}

// Deletes a student, uses SQL
exports.DeleteStudentSQL = async(req, res) => {
    const foundStudent = await Students.findByPk(req.body.id);

    if(foundStudent === null){
        res.status(400).send({ message: `No student with ID ${ req.body.id } exists in the database.` });
        return;
    }

    const studentId = foundStudent.dataValues.studentId;

    const Sequelize_config = db.sequelize_config;

    // Raw MySQL query
    const sqlQuery = `DELETE FROM students WHERE studentId = :studentId`;

    try {
        // For MySQL, "affectedRows" will contain the number of affected rows.
        const [affectedRows] = await Sequelize_config.query(sqlQuery, { replacements: { studentId: studentId } });
        res.send({
            status: "Success",
            status_code: 100,
            message: "Student Deleted",
            result: affectedRows
        });
    } catch (error) {
        res.status(500).send({
            status: "Error",
            status_code: 500,
            message: "Failed to delete student",
            error: error.message
        });
    }
};

// retreive all students in a specific class
exports.FindStudentsInClass = (req, res) => {
    const StudentClass = req.body.studentClass.replace(/\./g, '');
    let vmsg = '';

    const regex = /^[S][1-6]$/i;

    if(! regex.test(StudentClass)){
        vmsg = `Invalid class specified. Please specify one of: S1, S2, S3, S4, S5 or S6.`;
    }

    if( vmsg!==""){
        res.status(400).send({ message: `${vmsg}` });
        return;
    }

    Students.findAll({
        attributes: ['firstName', 'lastName', 'currentClass'],
        where: { currentClass: { [Op.like]: `%${StudentClass}%` }},
    })
    .then(data => { res.send(data) })
    .catch(err => {
        res.status(500).send({
            status: "Error",
            status_code: 101,
            message: err.message || "Error occured while retrieving students"
        });
    });
}
