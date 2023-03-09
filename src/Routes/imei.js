const IMEI = require("../Models/IMEI");
const router = require("express").Router();

// add IMEI
router.post("/add", async (req, res) => {
  const newIMEI = new IMEI(req.body);
  try {
    const savedIMEI = await newIMEI.save();
    res.status(200).json(savedIMEI);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

//GET IMEI
router.post("/get", async (req, res) => {
  console.log(req.body);
  let { limit, page, ...filter } = req.body;
  console.log(filter);
  console.log(limit);
  try {
    const fetchedIMEI = await IMEI.find(filter)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    console.log(fetchedIMEI);

    res.status(200).json(fetchedIMEI);
  } catch (error) {
    res.status(400).json(error);
  }
});

//UPDATE IMEI
router.patch("/update/:id", async (req, res) => {
  try {
    const updatedIMEI = await IMEI.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedIMEI);
  } catch (error) {
    res.status(400).json(error);
  }
});

//DELETE IMEI
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedIMEI = await IMEI.findByIdAndDelete(req.params.id);
    res.status(200).json(`IMEI ${deletedIMEI.id} deleted`);
  } catch (error) {
    res.status(400).json(error);
  }
});

//GET ALL IMEIs
router.post("/fetch", async (req, res) => {
  let { limit, page, ...query } = req.body;
  try {
    const fetchedIMEIs = limit
      ? await IMEI.find(query)
          .limit(limit)
          .skip((page - 1) * limit)
      : await IMEI.find(query);
    // get total documents in the Posts collection
    const count = await IMEI.countDocuments(query);
    res.status(200).json({
      IMEI: fetchedIMEIs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
    // res.status(200).json(fetchedIMEIs);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
