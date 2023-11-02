const tutorials = require("../controllers/tutorial.controller");
var router = require("express").Router();

router.use("/api/tutorial", tutorials.findAll);
// module.exports = (app) => {
//   app.use("/api/tutorial", router);

//   //find all Tutorials
//   router.get("/get_all_tutorials", tutorials.findAll);

//   //find a single Tutorial
//   router.get("/get_tutorial/:id", tutorials.findOne);

//   //Create a new Tutorial
//   router.post("/create_tutorial", tutorials.create);

//   //Update a Tutorial
//   router.put("/update_tutorial/:id", tutorials.update);

//   //Delete a Tutorial
//   router.delete("/delete_tutorial/:id", tutorials.delete);
// };

module.exports = router;
