const express = require('express');
const { Submit, getTaskResultById } = require('../controllers/taskController');

const router = express.Router();

// Define routes
router.post('/', executeTask);
router.get('/:id', getTaskResultById);

module.exports = router;
