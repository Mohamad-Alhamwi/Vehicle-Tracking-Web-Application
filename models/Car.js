const Sequelize = require('sequelize') ;

const db = require('../config/database');

const Car = db.define(
                        'car',
                        {
                            id : 
                            {
                                type : Sequelize.INTEGER(10).UNSIGNED ,
                                autoIncrement : true,
                                allowNull : false,
                                primaryKey : true,
                                unique: true
                            },
                            licensePlate : 
                            {
                                type : Sequelize.STRING,
                                allowNull : false 
                            },
                            status : 
                            {
                                type : Sequelize.STRING, // Active, Idle, Deleted, On Way, Waiting, On Order.
                                allowNull : false
                            },
                            lastLocation :
                            {
                                type : Sequelize.STRING,
                                allowNull : true
                            },
                            addedDate :
                            {
                                type : Sequelize.STRING,
                                allowNull : false
                            },
                            editedDate :
                            {
                                type : Sequelize.STRING,
                                allowNull : true
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

module.exports = Car ;