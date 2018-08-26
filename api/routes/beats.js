const express = require('express')
const router = express.Router()
const BeatsController = require('../controllers/BeatsController')

// POST
router.post('/create', BeatsController.createBeats)

// GET
router.get('/:id', BeatsController.getBeats)

// DELETE
router.delete('/delete', BeatsController.deleteBeats)

// PATCH
router.patch('/update/:id', BeatsController.updateBeats)

module.exports = router