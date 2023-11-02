const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./model");
const router = require("./routes/tutorial.routes.js");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081/",
};
app.use(cors(corsOptions));

db.sequelize.sync();
// db.sequelize.sync({ force: false }).then(() => {
//   console.log("Drop and re-sync db.");
// });

//simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to my application" });
});

// require("./routes/tutorial.routes.js")(app);
app.use(router);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Serveris running on port ${PORT}`);
});
