module.exports = function(sequelize, DataTypes) {
  return sequelize.define('access_requests', {
    featureType: {
      primaryKey: true,
      type:   DataTypes.ENUM,
      values: ['route', 'area', 'point'],
      allowNull: false
    },
    username: {
      primaryKey: true,
      type: DataTypes.STRING,
      allowNull: false
    },
    featureId: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false
    },
	  reason: {
      type: DataTypes.STRING,
      allowNull: true
    },
    executor: DataTypes.STRING,
  },
  {
    timestamps: true,
    freezeTableName: true,
    tableName: 'access_requests'
  });
}
