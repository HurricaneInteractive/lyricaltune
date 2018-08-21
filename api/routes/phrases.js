const express = require('express')
const router = express.Router()
const CheckAuthentication = require('../middleware/CheckAuthentication')
const PhrasesController = require('../controllers/PhrasesController')

// POST
router.post('/create', CheckAuthentication, PhrasesController.createPhrase)

// GET
router.get('/user/:id', CheckAuthentication, PhrasesController.userPhrases)

module.exports = router