module.exports = (sequelize_config, Sequelize) => {
    const FeesPayments = sequelize_config.define( "feesPayments", {
        feespaymentsId: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true },
        studentId : { type: Sequelize.INTEGER, allowNull: false, foreignKey: true },
        studentFeesId : { type: Sequelize.INTEGER, allowNull: false, foreignKey: true },
        amountPaid: { type:Sequelize.BIGINT.UNSIGNED, allowNull: false },
        datePaid: { type:Sequelize.DATE, allowNull: false },
    });

    FeesPayments.associate = function(models) {
        FeesPayments.belongsTo(models.students, { foreignKey: 'studentId' });
        FeesPayments.belongsTo(models.studentFees, { foreignKey: 'studentFeesId' });
    };

    return FeesPayments;
}