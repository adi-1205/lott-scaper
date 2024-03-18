
module.exports = (sequelize, DataTypes) => {
    const result = sequelize.define('result', {
        site: DataTypes.STRING,
        html: DataTypes.TEXT,
    }, {
        paranoid: true,
        timestamps: true,
        freezeTableName: true,
        tableName: 'result',
    })
    return result
}