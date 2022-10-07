const multer = require('multer');
const db = require('../config/database')
const path = require("path");
const fs = require('fs');

const uploadDir = path.join(__dirname,'../../public/uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({ storage: storage })

exports.getUsers = async (req, res) => {
  let sqlQuery = "SELECT * FROM student";
    db.query(sqlQuery, (err, results) => {
      if (err) throw err;
        res.send(results);
    });
}

exports.getUser = async (req, res) => {
  let sqlQuery = "SELECT * FROM student WHERE id=" + req.params.id;

  db.query(sqlQuery, (err, results) => {
    if (err) throw err;
    if (!results[0])
      res.sendStatus(404)
    else
      res.send(results);
  });
}

exports.createUser = async (req, res) => {
  const image = {}
  upload.single('photo')(req, res, err => {
    if(err)
      res.status(500).json({error: 1, payload: err})
    else {
      image.id = req.file.filename;
      image.url = `/${image.id}`;
      let data = { name: req.body.name, address: req.body.address, photo: image.url};
      let sqlQuery = "INSERT INTO student SET ?";
      db.query(sqlQuery, data, (err, results) => {
        if (err) throw err;
        res.sendStatus(201);
      });
    }
  })
}

exports.updateUser = async (req, res) => {
  const image = {}
  upload.single('photo')(req, res, err => {
    if(err)
      res.status(500).json({error: 1, payload: err})
    else {
      if(req.file){
        deleteStudentPhoto(req.params.id);
        image.id = req.file.filename;
        image.url = `/${image.id}`;
        let sqlQueryWithPhoto = "UPDATE student SET name=\'" + req.body.name + "', address='" + req.body.address + "', photo='" + image.url +  "' WHERE id=" + req.params.id;
        db.query(sqlQueryWithPhoto, (err, results) => {
          if (err) throw err;
          res.sendStatus(201);
        })
        } else {
        let sqlQueryWithoutPhoto = "UPDATE student SET name=\'" + req.body.name + "', address='" + req.body.address + "' WHERE id=" + req.params.id;
        db.query(sqlQueryWithoutPhoto, (err, results) => {
          if (err) throw err;
          res.sendStatus(201);
        })
      }
    }
  })
}

exports.deleteUser = async (req, res) => {
  let sqlQueryDelete = "DELETE FROM student WHERE id=" + req.params.id;
  deleteStudentPhoto(req.params.id);

  db.query(sqlQueryDelete, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
}

function deleteStudentPhoto(id){
  let sqlQuerySelect = "SELECT * FROM student WHERE id=" + id;

  db.query(sqlQuerySelect, (err, results) => {
    if (err) throw err;
    fs.unlink(uploadDir + results[0].photo, (err) => {
      if (err) {
        throw err;
      }
    });
  });
}

