module.exports = (sequelize, DataTypes) => {
    const Templates = sequelize.define('Templates', {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name:{
            type: DataTypes.STRING,
            defaultValue:""
        },
        type:{
            type:DataTypes.STRING,
            defaultValue:""
        },
        subject:{
            type:DataTypes.TEXT,
            defaultValue:""   
        },
        body:{
            type:DataTypes.TEXT,
            defaultValue:""   
        },
        variables:{
            type:DataTypes.STRING,
            defaultValue: null  
        }
    })
    Templates.associate = models => {
    }

    return Templates;
}