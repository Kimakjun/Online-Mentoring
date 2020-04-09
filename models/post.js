module.exports = (sequelize, DataTypes) => (
    sequelize.define('post', {
        title: {
            type: DataTypes.STRING(140),
            allowNull: false,
        },
        content: {
        type: DataTypes.STRING(300),
        allowNull: false,
        },
        day:{
          type: DataTypes.STRING(40),
          allowNull: false,
        },
        start:{
          type: DataTypes.STRING(40),
          allowNull: false,
        },
        end : {
          type: DataTypes.STRING(40),
          allowNull: false,
        }
    }, {
      timestamps: true,
      paranoid: true,
    })
  );