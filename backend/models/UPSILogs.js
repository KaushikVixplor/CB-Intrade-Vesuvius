module.exports = (sequelize, DataTypes) => {
    const UPSILogs = sequelize.define('UPSILogs', {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        shared_by:{
            type: DataTypes.TEXT,
            defaultValue:""
        },
        shared_with:{
            type:DataTypes.TEXT,
            defaultValue:""
        },
        subject:{
            type:DataTypes.TEXT,
            defaultValue:""   
        },
        information:{
            type:DataTypes.TEXT,
            defaultValue:""   
        }
    })
    UPSILogs.associate = models => {
    }

    return UPSILogs;
}