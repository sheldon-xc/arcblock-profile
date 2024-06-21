const express = require('express');

const router = express.Router();
const infoController = require('../../controllers/info');

// GET user by ID
router.get('/:id', infoController.getUserById);

// POST create new user
router.post('/', infoController.createUser);

// PUT update user by ID
router.put('/:id', infoController.updateUser);

module.exports = router;
