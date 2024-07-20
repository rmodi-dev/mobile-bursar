const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan'); //Logging API CRUD operations
const cors = require('cors');
let corsOptions = { origin: "*" };

const app = express();
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions));

//Models
const db = require("./models"); 

//Routes
require("./routes/auth.routes")(app);
require("./routes/student.routes")(app);;
// require("./routes/finance.routes")(app);
app.get("/",(req, res) => { res.json({message: "Welcome to Mobile Bursar. Please use any of the known API end points for your needs."}) }); //Main route

db.sequelize_config.sync({force: false} ).then(()=>{ console.log("DB re-synched") }); //synchronise or purge the database

const PORT = process.env.PORT || 8098;

app.listen(PORT, () => {
    console.log(`Mobile Bursar server running on port ${PORT}`);
});
