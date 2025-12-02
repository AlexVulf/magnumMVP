const productService = require('./product.service');

const generateAd = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ message: 'A descrição do produto é obrigatória.' });
    }
    const ad = await productService.generateAd(description);
    res.json({ ad });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao gerar anúncio.', error: error.message });
  }
};

const generateImage = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ message: 'A descrição do produto é obrigatória.' });
    }
    const imageUrl = await productService.generateImage(description);
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao gerar imagem.', error: error.message });
  }
};

const scrapeUrl = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ message: 'A URL é obrigatória.' });
    }
    const scrapedData = await productService.scrapeUrl(url);
    res.json(scrapedData);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao extrair dados da URL.', error: error.message });
  }
};

const searchAndScrape = async (req, res) => {
  try {
    const { keywords } = req.body;
    if (!keywords) {
      return res.status(400).json({ message: 'Palavras-chave são obrigatórias.' });
    }
    const result = await productService.searchAndScrape(keywords);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar e extrair produto.', error: error.message });
  }
};

module.exports = {
  generateAd,
  generateImage,
  scrapeUrl,
  searchAndScrape,
};
