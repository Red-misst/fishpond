const asyncHandler = require("express-async-handler");
const data = require("../models/dataModel");

//add data to database
const dbPush = asyncHandler(async (req, res) => {
    console.log(_temperature)
  const updatedData = await data.findByIdAndUpdate(
    process.env.TEMP_ID,
    {
      $push: { data: _temperature },
    },
    {
      new: true,
    }
  );
  res.json(updatedData);
});

const dbCreate = asyncHandler(async (req, _temperature, res) => {
  const newData = await data.create({
    Parameter: "Temperature",
    data: _temperature,
  });

});

module.exports = { dbPush, dbCreate };
