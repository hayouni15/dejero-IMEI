const IMEI = require("../Models/IMEI");
const router = require("express").Router();

const imeiInProcessCache = new Map();

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

//GET IMEIs
router.post("/get", async (req, res) => {
  let { limit, page, ...filter } = req.body;
  console.log(filter);
  console.log(limit);
  try {
    const fetchedIMEI = await IMEI.find({})
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    console.log(fetchedIMEI);

    res.status(200).json(fetchedIMEI);
  } catch (error) {
    res.status(400).json(error);
  }
});

//GET Next IMEI
router.post("/getNext", async (req, res) => {
  let exitFlag = false
  // let { limit, page, ...filter } = req.body;
  try {
    while (!exitFlag) {
      const fetchedIMEI = await IMEI.findOne({state:"available"})
      .limit(1)
      .sort({ createdAt: 1 });
      console.log(fetchedIMEI)
      if(imeiInProcessCache.get(fetchedIMEI._id)){
        // item already requested
        console.log("item being processed!")
      }else{
        // set the cache
        imeiInProcessCache.set(fetchedIMEI._id, "processed");
        //update database
        const updatedIMEI = await IMEI.findByIdAndUpdate(
          fetchedIMEI._id,
          {
            state:"taken",
          },
          { new: true }
        );
        res.status(200).json(updatedIMEI);
        exitFlag = true
      }
      
    }

  } catch (error) {
    console.log(error)
    res.status(400).json(error);
  }
});

//UPDATE IMEI
router.patch("/update/:id", async (req, res) => {
  try {
    const updatedIMEI = await IMEI.findByIdAndUpdate(
      req.params.id,
      {
        $set: {state:"taken"},
      },
      { new: true }
    );
    res.status(200).json(updatedIMEI);
  } catch (error) {
    res.status(400).json(error);
  }
});



//DELETE IMEI
router.delete("/deleteAll", async (req, res) => {
  try {
    const deletedIMEI = await IMEI.remove({});
    res.status(200).json(`IMEI deleted`);
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

// test IMEI
router.post("/test", async (req, res) => {
  try {
    res.status(200).json("test");
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
