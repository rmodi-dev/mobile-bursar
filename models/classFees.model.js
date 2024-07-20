module.exports = (sequelize_config, Sequelize) => {
    const ClassFees = sequelize_config.define("classFees", {
        classFeesId: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        feesClass: { type:Sequelize.STRING, allowNull: false },
        feesAmount: { type:Sequelize.BIGINT.UNSIGNED, allowNull: false },
        feesStatus: { type:Sequelize.BOOLEAN, defaultValue: true }
    });

    ClassFees.associate = function(models) {
        ClassFees.hasMany(models.studentFees, { foreignKey: 'classFeesId' });
    };

    return ClassFees;
}