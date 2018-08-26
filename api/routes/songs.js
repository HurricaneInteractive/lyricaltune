const express = require('express')
const router = express.Router()
const SongsController = require('../controllers/SongsController')

// POST
router.post('/create', SongsController.createSongs)

// GET
router.get('/:id', SongsController.getSongs)

// DELETE
router.delete('/delete', SongsController.deleteSongs)

// PATCH
router.patch('/update/:id', SongsController.updateSongs)

module.exports = router