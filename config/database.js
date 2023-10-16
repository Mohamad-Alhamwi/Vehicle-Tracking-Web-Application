const Sequelize = require('sequelize') ;
const db = new Sequelize
(
    '[PLACEHOLDER]',
    '[PLACEHOLDER]',
    '[PLACEHOLDER]',
    {
        dialect : 'mysql',
        host : 'localhost',
        omitNull: true,

        pool: 
        {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
) ;

module.exports = db ;
