const Sequelize = require('sequelize') ;

const db = require('../config/database');

const Trip = db.define(
                        'trip',
                        {
                            id : 
                            {
                                type : Sequelize.INTEGER(10).UNSIGNED ,
                                autoIncrement : true,
                                allowNull : false,
                                primaryKey : true,
                                unique: true
                            },
                            carLocation :
                            {
                                type : Sequelize.STRING,
                                allowNull : false
                            },
                            startTime :
                            {
                                type : Sequelize.STRING,
                                allowNull : false
                            },
                            userLocation :
                            {
                                type : Sequelize.STRING,
                                allowNull : false
                            },
                            arrivalTime :
                            {
                                type : Sequelize.STRING,
                                allowNull : true
                            },
                            destination:
                            {
                                type : Sequelize.STRING,
                                allowNull : true
                            },
                            endTime :
                            {
                                type : Sequelize.STRING,
                                allowNull : true
                            },
                            status :
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

module.exports = Trip ;