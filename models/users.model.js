module.exports = (sequelize_config, Sequelize) => {
    const Users = sequelize_config.define( "users", {
        userId: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        userName: { type:Sequelize.STRING, allowNull: false },
        firstName: { type:Sequelize.STRING, allowNull: true },
        lastName: { type:Sequelize.STRING, allowNull: true },
        password: { type:Sequelize.STRING, allowNull: false },
        email: { type:Sequelize.STRING, allowNull: false },
        status: { type:Sequelize.BOOLEAN, defaultValue: true },
    });
    return Users;
}