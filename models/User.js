const Sequelize = require('sequelize') ; // To create models and schema.

const db = require('../config/database');

const User = 
db.define
(
    'user',
    {
        id : 
        {
            type : Sequelize.INTEGER(10).UNSIGNED ,
            autoIncrement : true,
            allowNull : false,
            primaryKey : true,
            unique: true
        },
        name : 
        {
            type : Sequelize.STRING,
            allowNull : false 
        },
        email : 
        {
            type : Sequelize.STRING,
            allowNull : false
        },
        mobilePhone :
        {
            type : Sequelize.STRING,
            allowNull : false
        },
        birthDate : 
        {
            type : Sequelize.STRING,
            allowNull : false
        },
        password : 
        {
            type : Sequelize.STRING,
            allowNull : false
        },
        status :
        {
            type : Sequelize.BOOLEAN, // true if is active // false if is deleted.
            allowNull : true
        },
        role :
        {
            type : Sequelize.STRING, // Give different access rights if admin or not.
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

module.exports = User ;