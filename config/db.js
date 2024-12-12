const { Sequelize } = require("sequelize");

// Initialize Sequelize instance with hard-coded database credentials
const sequelize = new Sequelize('quatetion-manageme', 'root', '', {
  host: 'localhost', // or your database host
  dialect: 'mysql', // specify your dialect
  dialectModule: require("mysql2"),
  port: 3306, // specify your database port

  pool: {
    max: 10, // Maximum number of connections in pool
    min: 0, // Minimum number of connections in pool
    acquire: 30000, // Maximum time (in ms) to try to get connection
    idle: 10000, // Time (in ms) before releasing idle connection
  },
  logging: false, // Set to true to log SQL queries
  dialectOptions: {
    timezone: "+05:30", // Set timezone
    charset: "utf8mb4", // Set character set
  },
});

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = sequelize;
