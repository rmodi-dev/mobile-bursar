module.exports = (sequelize_config, Sequelize) => {
    const StudentFees = sequelize_config.define("studentFees", {
        studentFeesId: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        studentId : { type: Sequelize.INTEGER, allowNull: false },
        classFeesId : { type: Sequelize.INTEGER, allowNull: false },
        feesStatus: { type:Sequelize.BOOLEAN, defaultValue: true }
    });

    StudentFees.associate = function(models) {
        StudentFees.belongsTo(models.students, { foreignKey: 'studentId' });
        StudentFees.belongsTo(models.classFees, { foreignKey: 'classFeesId' });
        StudentFees.hasMany(models.feesPayments, { foreignKey: 'studentFeesId' });
    };

    return StudentFees;
}