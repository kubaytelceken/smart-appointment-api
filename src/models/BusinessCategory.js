const {DataTypes} = require ("sequelize");

module.exports = (sequelize) => {
    const BusinessCategory = sequelize.define (
        "BusinessCategory",{
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            code : {
                type: DataTypes.STRING,
                allowNull : false,
                unique: true
            },
            name : {
                type: DataTypes.STRING,
                allowNull : false
            },
            description : {
                type: DataTypes.TEXT,
                allowNull : true
            },
            icon : {
                type: DataTypes.STRING,
                allowNull : true
            },
            status: {
  type: DataTypes.ENUM("active", "passive"),
  defaultValue: "active"
},
            order : {
                type : DataTypes.INTEGER,
                allowNull : true
            }
        },
        {
            tableName: "business_categories",
            timestamps: true,
            underscored: true,
        }
    );
    return BusinessCategory;
} 