module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "AHm08718127",
    DB: "database_todo",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};