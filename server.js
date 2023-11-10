const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./model");
const routes = require("./routes");

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Serveris running on port ${PORT}`);
});
