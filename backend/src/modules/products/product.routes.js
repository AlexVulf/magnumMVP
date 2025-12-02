const express = require('express');
const productController = require('./product.controller');

const router = express.Router();

router.post('/generate-ad', productController.generateAd);
router.post('/generate-image', productController.generateImage);
router.post('/scrape-url', productController.scrapeUrl);
router.post('/search-and-scrape', productController.searchAndScrape);

module.exports = router;
