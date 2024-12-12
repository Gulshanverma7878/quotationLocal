const { Sequelize } = require("sequelize");

require('dotenv').config();


// Initialize Sequelize instance with hard-coded database credentials
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql",
    dialectModule: require("mysql2"),
    port: process.env.DB_PORT || 3306,

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
