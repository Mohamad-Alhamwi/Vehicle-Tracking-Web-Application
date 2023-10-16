const Sequelize = require('sequelize') ; // To create models and schema.

const db = require('../config/database');

const AdminNotification = 
db.define
(
    'AdminNotification',
    {
        id : 
        {
            type : Sequelize.INTEGER(10).UNSIGNED ,
            autoIncrement : true,
            allowNull : false,
            primaryKey : true,
            unique: true
        },
        status : 
        {
            type : Sequelize.STRING,
            allowNull : false 
        },
        detail : 
        {
            type : Sequelize.STRING,
            allowNull : false
        },
        date :
        {
            type : Sequelize.STRING,
            allowNull : false
        }
    },
    {
        // By default, sequelize will automatically
        // transform all passed model names (first parameter of define) into plural.
        // if you don't want that, set the following
        freezeTableName : true,
        
        // Disabled timestamps in sequelize.
        timestamps : false
    }
) ;

module.exports = AdminNotification ;