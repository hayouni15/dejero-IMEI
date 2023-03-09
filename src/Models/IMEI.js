const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IMEI = new Schema(
  {
    imei: { type: String },
    state: { type: String, default: "available" },
    old_imei: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("IMEI", IMEI);
