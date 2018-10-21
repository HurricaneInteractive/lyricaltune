const express = require('express')
const router = express.Router()
const CheckAuthentication = require('../middleware/CheckAuthentication')
const PhrasesController = require('../controllers/PhrasesController')

// POST
router.post('/create', CheckAuthentication, PhrasesController.createPhrase)
router.post('/like', CheckAuthentication, PhrasesController.likePhrase)

// GET
router.get('/user/:id', PhrasesController.userPhrases)
router.get('/:id', CheckAuthentication, PhrasesController.getPhrase)
router.get('/', PhrasesController.getPhrases)

// DELETE
router.delete('/delete', CheckAuthentication, PhrasesController.deletePhrase)

// PATCH
router.patch('/update/:id', CheckAuthentication, PhrasesController.updatePhrase)

module.exports = router