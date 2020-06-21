module.exports = (sequelize, DataTypes) => (
     sequelize.define('chatroom', {
        title: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        max: {
            type: DataTypes.INTEGER,
            defaultValue: 10,
       
        },
        onwer: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(40),
            allowNull: true,
        },
    },{
        timestamps: true,
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    })
)

// 
