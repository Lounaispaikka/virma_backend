module.exports = function(sequelize, DataTypes) {
  return sequelize.define('logs', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    operation: {
      type: DataTypes.STRING,
      allowNull: false
    },
    target_name: DataTypes.STRING,
    target_table: DataTypes.STRING,
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false
    },
	msg: {
      type: DataTypes.STRING,
      allowNull: true
    },
    executor: DataTypes.STRING,
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: 'logs'
  });
}
