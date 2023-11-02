const db = require("../model");
const { Op } = require("sequelize");

const Tutorial = db.tutorials;

// exports.create = (req, res) => {
//   //validate request
//   if (!req.body.title) {
//     res.status(400).send({
//       message: "Content can not be empty!",
//     });
//     return;
//   }

//   // Create a Tutorial
//   const tutorial = {
//     title: req.body.title,
//     description: req.body.description,
//     published: req.body.published ? req.body.published : false,
//   };

//   //Save Tutorial in the database
//   Tutorial.create(tutorial)
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while creating the Tutorial.",
//       });
//     });
// };

exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  Tutorial.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

// const data_test = {
//   test: (req, res) => {
//     const title = "abc";
//     var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

//     console.log(Tutorial);
//     //     Tutorial.findAll({ where: condition })
//     //       .then((data) => {
//     //         res.send(data);
//     //       })
//     //       .catch((err) => {
//     //         res.status(500).send({
//     //           message:
//     //             err.message || "Some error occurred while retrieving tutorials.",
//     //         });
//     //       });
//   },
// };

// module.exports = data_test;
// exports.findOne = (req, res) => {
//   const id = req.params.id;

//   Tutorial.findByPk(id)
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: "Error retrieving Tutorial with id=" + id,
//       });
//     });
// };

// exports.update = (req, res) => {
//   const id = req.params.id;

//   Tutorial.update(req.body, {
//     where: { id: id },
//   })
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: "Error updating Tutorial with id=" + id,
//       });
//     });
// };

// exports.delete = (req, res) => {
//   const id = req.params.id;

//   Tutorial.destroy({
//     where: { id: id },
//   });
// };
