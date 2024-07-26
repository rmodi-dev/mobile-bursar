const db = require("../models");
const Users = db.users;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

// Register route
exports.Register = (req, res) => {
    const { userName, email, password } = req.body;
    let msg = "";

    if (!userName){ msg = msg + "Username is required. " }
    if (!email){ msg = msg + "Email is required. " }
    if (!password){ msg = msg + "Password is required. " }
    if(msg !== ""){
        res.status(400).send({ message: `${msg}` });
        return;
    }

    Users.findAll({
        attributes: ['userName'],
        where: { userName: userName }
    })
    .then( async data => {
        if(data.length > 0){
            res.status(400).send({ message: `Usermame ${userName} already taken. Try another one.` });
            return;
        }

        const hashedPassword = bcrypt.hashSync(password, 8);
        const user = {
            userName: userName,
            firstName: '',
            lastName: '',
            password: hashedPassword,
            email: email
        }

        await Users.create(user)
        .then(
            res.status(200).send({
                status: "Success",
                message: `New user ${userName} registered sucessfully. Please proceed to login.`
            })
        )
    })
    .catch(err => {
        res.status(500).send({
            status: "Error",
            message: err.message || "Error occurred while registering new user"
        });
    });
};

// Login route
exports.Login = (req, res) => {
    const { userName, password } = req.body;
    Users.findOne({
        attributes: ['userName', 'password'],
        where: { userName: userName },
    })
    .then(data => {
        if (!data) { return res.status(404).send({ message: 'User not found' }); }
        else{
            const passwordIsValid = bcrypt.compareSync(password, data.dataValues.password);
            if (!passwordIsValid) {
                return res.status(401).send({ message: 'Invalid password' });
            }

            const token = jwt.sign({ id: data.dataValues.userName }, secretKey, { expiresIn: "1h" });
            res.status(201).send({ token });
        }
    })
    .catch(err => {
        console.error("Status 500 Message:", err.message);
        res.status(500).send({
            message: err.message || "An error occured while loggin in."
        });
    });
};

exports.CheckToken = (req, res) => {
    const checkToken = require("./functions/checkTokenExpiry");
    const { token } = req.body;
    const validToken = checkToken(token);

    if(!validToken){
        res.status(200).send(false);
    }

    res.status(200).send(validToken);
};