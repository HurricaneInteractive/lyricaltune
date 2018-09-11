const express = require('express')
const router = express.Router()
const SiteSearch = require('../controllers/Search/SiteSearch')

router.post('/search', SiteSearch)

module.exports = router