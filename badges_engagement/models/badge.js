const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Adjust the path as necessary

const Badge = sequelize.define('Badge', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    criteria: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'badges', // The name of the table in the database
});

// Sync the model with the database
const syncBadges = async () => {
    try {
        await Badge.sync(); // Creates the table if it doesn't exist
        console.log("Badge table has been synced.");
    } catch (error) {
        console.error("Error syncing Badge table: ", error);
    }
};

syncBadges();

module.exports = Badge;
