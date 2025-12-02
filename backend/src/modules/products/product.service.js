const axios = require('axios');
const cheerio = require('cheerio');

const generateAd = async (description) => {
  // LÓGICA SIMULADA - Gerar um anúncio mais formatado e multi-linha
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(
        `Anúncio Exclusivo!\n\n` +
        `Descubra o ${description}, a ferramenta definitiva para suas necessidades!\n\n` +
        `Com design ergonômico e desempenho superior, este produto é ideal para:\n` +
        `- Profissionais exigentes\n` +
        `- Projetos DIY (faça você mesmo)\n` +
        `- Quem busca qualidade e durabilidade\n\n` +
        `Não perca tempo! Adquira já o seu e transforme seu trabalho!\n` +
        `Disponível agora por tempo limitado!`
      );
    }, 500);
  });
};

const generateImage = async (description) => {
  // LÓGICA SIMULADA
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop`);
    }, 1000);
  });
};

const scrapeUrl = async (url) => {
  if (url.includes('mercadolivre.com')) {
    // --- LÓGICA RESTAURADA E MELHORADA PARA MERCADO LIVRE (Axios + Cheerio com formatação) ---
    try {
      const { data } = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });
      const $ = cheerio.load(data);
      
      const title = $('.ui-pdp-title').first().text().trim();
      if (!title) {
        throw new Error('Não foi possível extrair o título do Mercado Livre. O layout do site pode ter mudado.');
      }
      
      let description = '';
      const descriptionHtml = $('.ui-pdp-description__content').first().html();
      if (descriptionHtml) {
        description = descriptionHtml
          .replace(/<br\s*\/?>/gi, '\n')      // Substitui <br> por quebra de linha
          .replace(/<\/p>/gi, '\n\n')         // Substitui </p> por duas quebras de linha
          .replace(/<[^>]*>/g, '')         // Remove todas as outras tags HTML
          .trim();
      }
      
      const imageUrl = $('.ui-pdp-gallery__figure__image').first().attr('src');
      
      const extractedDescription = `${title}\n\n${description}`;
      return { extractedDescription, extractedImageUrl: imageUrl };

    } catch (error) {
      console.error("Erro no scraping do Mercado Livre:", error.message);
      throw new Error('Falha ao processar link do Mercado Livre.');
    }

  } else if (url.includes('shopee.com')) {
    // --- LÓGICA DE API DIRETA PARA SHOPEE (via Axios) ---
    try {
      const match = url.match(/-i\.d+\.d+/);
      if (!match) {
        throw new Error('Não foi possível extrair shopid e itemid da URL da Shopee.');
      }
      const [, shopid, itemid] = match;
      
      const apiUrl = `https://shopee.com.br/api/v4/item/get?itemid=${itemid}&shopid=${shopid}`;
      
      const { data } = await axios.get(apiUrl, {
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36)',
          'Referer': url 
        }
      });

      if (!data || !data.data) {
        throw new Error('A resposta da API da Shopee não contém os dados esperados.');
      }
      
      const productData = data.data;
      const title = productData.name || '';
      const description = productData.description || '';
      const imageUrl = productData.images ? `https://down-br.img.susercontent.com/${productData.images[0]}` : '';

      if (title) return { extractedDescription: `${title}. ${description}`, extractedImageUrl: imageUrl };
      throw new Error('Título do produto não encontrado na resposta da API da Shopee.');

    } catch (error) {
      console.error("Erro no scraping da Shopee:", error.message);
      throw new Error('Falha ao processar link da Shopee.');
    }
  } else {
    throw new Error('URL não suportada. Use um link do Mercado Livre ou Shopee.');
  }
};

const searchAndScrape = async (keywords) => {
  try {
    // 1. Buscar na API do Mercado Livre
    const searchUrl = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(keywords)}`;
    const searchResponse = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (!searchResponse.data || !searchResponse.data.results || searchResponse.data.results.length === 0) {
      throw new Error('Nenhum resultado encontrado para as palavras-chave.');
    }

    // 2. Pegar o link do primeiro resultado
    const firstResult = searchResponse.data.results[0];
    const productUrl = firstResult.permalink;

    // 3. Usar nossa função de scrape existente
    const { extractedDescription, extractedImageUrl } = await scrapeUrl(productUrl);

    // 4. Gerar o anúncio com a descrição extraída
    const finalAd = await generateAd(extractedDescription);

    return { ad: finalAd, imageUrl: extractedImageUrl };

  } catch (error) {
    console.error('Erro no processo de busca e extração:', error.message);
    throw new Error('Falha ao buscar e processar o produto do Mercado Livre.');
  }
};

module.exports = {
  generateAd,
  generateImage,
  scrapeUrl,
  searchAndScrape,
};
