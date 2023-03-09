const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");

// import routes
const imei = require("./Routes/imei");

dotenv.config();

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(console.log("mongoDB connected!"))
  .catch((e) => console.log(`Failed to connect to MongoDB ${e}`));

app.use(express.json());
// const corsOptions = {
//   origin: "http://localhost:3000",
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// };
app.use(cors());

// imei
app.use("/imei", imei);

app.listen(process.env.PORT || 6000, () => {
  console.log("Backend server running!");
});
