const dbConfig = require("../config/db.config.js"); // import DB Config

const Sequelize = require("sequelize");
const sequelize_config = new Sequelize(
    dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD,{
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        pool:{
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle,
        }
    }
);

sequelize_config.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch( (error) => {
    console.error('Unable to connect to the database: ', error);
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize_config = sequelize_config;

db.users = require("./users.model.js")(sequelize_config, Sequelize);
db.students = require("./students.model.js")(sequelize_config, Sequelize);
db.classFees = require("./classFees.model.js")(sequelize_config, Sequelize);
db.feesPayments = require("./feesPayments.model.js")(sequelize_config, Sequelize);
db.studentFees = require("./studentFees.model.js")(sequelize_config, Sequelize);

// db.feesPayments.belongsTo(db.students, { foreignKey: 'studentId', sourceKey: 'studentId' });
// db.feesPayments.belongsTo(db.studentFees, { foreignKey: 'studentfeesId', sourceKey: 'studentfeesId' });

// db.studentFees.belongsTo(db.classFees, { foreignKey: 'classfeesId', sourceKey: 'classfeesId' });
// db.studentFees.belongsTo(db.students, { foreignKey: 'studentId', sourceKey: 'studentId' });

// Establish associations
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) { db[modelName].associate(db); }
});

module.exports = db;