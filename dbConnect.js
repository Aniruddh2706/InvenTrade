const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Add this line to prepare for Mongoose 7

const URL = "mongodb://localhost:27017/ani";

mongoose.connect(URL);

let connectionObj = mongoose.connection;

connectionObj.on("connected", () => {
  console.log("Mongo DB conection successful");
});

connectionObj.on("error", () => {
  console.log("Mongo DB connection failed");
});
