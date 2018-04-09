module.exports = function(sequelize, DataTypes) {
  return sequelize.define('routes_approval', {
    gid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    class1_fi: {
      type: DataTypes.STRING,
      allowNull: false
    },
    class1_se: {
      type: DataTypes.STRING,
      allowNull: false
    },
    class1_en: {
      type: DataTypes.STRING,
      allowNull: false
    },
    class2_fi: {
      type: DataTypes.STRING,
      allowNull: false
    },
    class2_se: {
      type: DataTypes.STRING,
      allowNull: false
    },
    class2_en: {
      type: DataTypes.STRING,
      allowNull: false
    },
    special: {
      type: DataTypes.STRING,
      allowNull: true
    },
    name_fi: {
      type: DataTypes.STRING,
      allowNull: true
    },
    name_se: {
      type: DataTypes.STRING,
      allowNull: true
    },
    name_en: {
      type: DataTypes.STRING,
      allowNull: true
    },
    municipali: {
      type: DataTypes.STRING,
      allowNull: true
    },
    munici_nro: {
      type: DataTypes.STRING,
      allowNull: true
    },
    subregion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    subreg_nro: {
      type: DataTypes.STRING,
      allowNull: true
    },
    region: {
      type: DataTypes.STRING,
      allowNull: true
    },
    region_nro: {
      type: DataTypes.STRING,
      allowNull: true
    },
    info_fi: {
      type: DataTypes.STRING,
      allowNull: true
    },
    info_se: {
      type: DataTypes.STRING,
      allowNull: true
    },
    info_en: {
      type: DataTypes.STRING,
      allowNull: true
    },
    chall_clas: {
      type: DataTypes.STRING,
      allowNull: true
    },
    length_m: {
      type: DataTypes.STRING,
      allowNull: true
    },
    accessibil: {
      type: DataTypes.STRING,
      allowNull: true
    },
    www_fi: {
      type: DataTypes.STRING,
      allowNull: true
    },
    www_se: {
      type: DataTypes.STRING,
      allowNull: true
    },
    www_en: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    telephone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    upkeeper: {
      type: DataTypes.STRING,
      allowNull: true
    },
    upkeepinfo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    upkeepclas: {
      type: DataTypes.STRING,
      allowNull: true
    },
    shapeestim: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sh_es_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    sh_es_pers: {
      type: DataTypes.STRING,
      allowNull: true
    },
    timestamp: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    updater_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    publicinfo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    geom: {
      type: DataTypes.GEOMETRY('MULTILINESTRING'),
      allowNull: false
    }
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: 'routes_approval'
  });
};
