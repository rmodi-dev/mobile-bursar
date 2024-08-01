const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const rfs = require("rotating-file-stream");
const cors = require('cors');
let corsOptions = { origin: "*" };

const app = express();
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions));

//Models
const db = require("./models"); 

require('dotenv').config();

//Routes
require("./routes/auth.routes")(app);
require("./routes/student.routes")(app);;
// require("./routes/finance.routes")(app);

// Morgan Setup
const rfsStream = rfs.createStream(process.env.LOG_FILE || 'morgan_log.txt', {
    size: process.env.LOG_SIZE || '5M',
    interval: process.env.LOG_INTERVAL || '1d',
    compress: 'gzip' // compress rotated files
 });

 app.use(morgan(process.env.LOG_FORMAT || "dev", {
    stream: process.env.LOG_FILE ? rfsStream : process.stdout
 }));

 if(process.env.LOG_FILE) {
    app.use(morgan(process.env.LOG_FORMAT || "dev"));    
 };

const PORT = process.env.PORT || 9090;

app.get("/",(req, res) => { res.json({message: "Welcome to Mobile Bursar. Please use any of the known API end points for your needs."}) }); //Main route

db.sequelize_config.sync({force: false} ).then(()=>{ console.log("DB re-synched") }); //synchronise or purge the database

app.listen(PORT, () => {
    console.debug(`Mobile Bursar server is listening on port ${PORT}`);
});
