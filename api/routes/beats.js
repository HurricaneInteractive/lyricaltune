const express = require('express')
const router = express.Router()
const BeatsController = require('../controllers/BeatsController')
const CheckAuthentication = require('../middleware/CheckAuthentication')

// POST
router.post('/create', CheckAuthentication, BeatsController.createBeats)

// GET
router.get('/user/:id', CheckAuthentication, BeatsController.userBeats)
router.get('/:id', CheckAuthentication, BeatsController.getBeats)

// DELETE
router.delete('/delete', CheckAuthentication, BeatsController.deleteBeats)

// PATCH
router.patch('/update/:id', CheckAuthentication, BeatsController.updateBeats)

module.exports = router