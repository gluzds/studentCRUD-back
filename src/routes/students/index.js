const express = require('express');
const router = express.Router();
const studentController = require('../../controllers/student.controller');

router.get('/students', studentController.getUsers);

router.get('/students/:id', studentController.getUser);

router.post('/students', studentController.createUser);

router.put('/students/:id', studentController.updateUser);

router.delete('/students/:id', studentController.deleteUser);

module.exports = router;