module.exports = (sequelize_config, Sequelize) => {
    const Students = sequelize_config.define( "students", {
        studentId: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        firstName: { type:Sequelize.STRING, allowNull: false },
        lastName: { type:Sequelize.STRING, allowNull: false },
        gender: { type:Sequelize.ENUM('M','F'), allowNull: false },
        currentClass: { type:Sequelize.STRING, allowNull: false },
        physicalAddress: { type:Sequelize.STRING, defaultValue: 'Bwaise' },
        status: { type:Sequelize.BOOLEAN, defaultValue: true },
    });

    Students.associate = function(models) {
        Students.hasMany(models.feesPayments, { foreignKey: 'studentId' });
        Students.hasMany(models.studentFees, { foreignKey: 'studentId' });
    };

    return Students;
}