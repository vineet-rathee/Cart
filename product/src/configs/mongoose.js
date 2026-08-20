const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO);
const db = mongoose.connection;

db.on("error", (err) => {
    console.log("MongoDB Connection Error:", err);
});

db.once("open", () => {
    console.log("✅ MongoDB Connected");
});

module.exports = db;