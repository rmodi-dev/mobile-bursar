const db = require("../models");
const Users = db.users;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

// Register route
exports.Register = (req, res) => {
    const { username: userName, email, password } = req.body;
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
        where: { username: userName }
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
            res.send({
                status: "Success",
                status_code: 100,
                message: `New user ${userName} registered sucessfully. Please proceed to login.`
            })
        )
    })
    .catch(err => {
        res.status(500).send({
            status: "Error",
            status_code: 1001,
            message: err.message || "Error occurred while registering new user"
        });
    });
};

// Login route
exports.Login = (req, res) => {
    const { username: userName, password } = req.body;
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
            res.status(200).send({ token });
        }
    })
    .catch(err => {
        res.status(500).send({
            status: "Error",
            status_code: 101,
            message: err.message || "An error occured while loggin in."
        });
    });
};
