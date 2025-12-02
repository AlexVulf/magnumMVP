import React, { useState, useRef, useEffect } from 'react';
import api from '../api';

const isUrl = (text) => {
  try {
    new URL(text);
    return true;
  } catch (_) {
    return false;
  }
};

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M20 4s0-2-2-2-2 2-2 2v5h5M4 20s0 2 2 2 2-2 2-2v-5H4" />
  </svg>
);

const Produto = () => {
  const [productDescription, setProductDescription] = useState('');
  const [generatedAd, setGeneratedAd] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [isAllLoading, setIsAllLoading] = useState(false);
  const [isAdLoading, setIsAdLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const adTextareaRef = useRef(null);

  useEffect(() => {
    if (adTextareaRef.current) {
      adTextareaRef.current.style.height = '0px';
      const scrollHeight = adTextareaRef.current.scrollHeight;
      adTextareaRef.current.style.height = scrollHeight + 'px';
    }
  }, [generatedAd]);

  const handleCopy = () => {
    if (generatedAd) {
      navigator.clipboard.writeText(generatedAd);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };
  
  const handleGenerateAll = async () => {
    setIsAllLoading(true);
    setIsAdLoading(true);
    setIsImageLoading(true);
    setError('');
    setGeneratedAd('');
    setGeneratedImageUrl('');

    try {
      if (isUrl(productDescription)) {
        setError('Extraindo dados da URL...');
        const scrapeResponse = await api.post('/products/scrape-url', { url: productDescription });
        setError('');

        const { extractedDescription, extractedImageUrl } = scrapeResponse.data;

        api.post('/products/generate-ad', { description: extractedDescription })
          .then(res => setGeneratedAd(res.data.ad))
          .finally(() => setIsAdLoading(false));

        if (extractedImageUrl) {
          setGeneratedImageUrl(extractedImageUrl);
          setIsImageLoading(false);
        } else {
          api.post('/products/generate-image', { description: extractedDescription })
            .then(res => setGeneratedImageUrl(res.data.imageUrl))
            .finally(() => setIsImageLoading(false));
        }
      } else {
        // --- FLUXO PARA PALAVRA-CHAVE ---
        const response = await api.post('/products/search-and-scrape', { keywords: productDescription });
        setGeneratedAd(response.data.ad);
        setGeneratedImageUrl(response.data.imageUrl);
        setIsAdLoading(false);
        setIsImageLoading(false);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Falha ao gerar o conteúdo.';
      setError(errorMessage);
      console.error(err);
      setIsAdLoading(false);
      setIsImageLoading(false);
    } finally {
      setIsAllLoading(false);
    }
  };

  const handleRegenerateAd = async () => {
    if (!productDescription) return;
    setIsAdLoading(true);
    setError('');
    try {
      const descriptionForIA = isUrl(productDescription) ? (await api.post('/products/scrape-url', { url: productDescription })).data.extractedDescription : productDescription;
      const response = await api.post('/products/generate-ad', { description: descriptionForIA });
      setGeneratedAd(response.data.ad);
    } catch (err) {
      setError('Falha ao regenerar anúncio.');
    } finally {
      setIsAdLoading(false);
    }
  };

  const handleRegenerateImage = async () => {
    if (!productDescription) return;
    setIsImageLoading(true);
    setError('');
    try {
      const descriptionForIA = isUrl(productDescription) ? (await api.post('/products/scrape-url', { url: productDescription })).data.extractedDescription : productDescription;
      const response = await api.post('/products/generate-image', { description: descriptionForIA });
      setGeneratedImageUrl(response.data.imageUrl);
    } catch (err) {
      setError('Falha ao regenerar imagem.');
    } finally {
      setIsImageLoading(false);
    }
  };

  return (
    <div className="pt-24 bg-[#0a0708] text-white min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">Gerador de Conteúdo com IA</h1>
        <p className="mb-6 text-center text-gray-400">
          Descreva seu produto ou cole um link (Mercado Livre/Shopee).
        </p>

        <div className="space-y-4 mb-8">
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            placeholder="Cole um link ou descreva seu produto..."
            className="w-full p-3 bg-[#1f1f1f] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff0050]"
            rows="4"
          />
          <button
            type="button"
            onClick={handleGenerateAll}
            disabled={isAllLoading || !productDescription}
            className="w-full bg-white hover:bg-gray-200 text-black font-bold py-2 px-4 rounded-md transition duration-300"
          >
            {isAllLoading ? 'Gerando...' : 'Gerar Conteúdo'}
          </button>
        </div>

        {error && <p className="text-center text-red-500 mb-4">{error}</p>}

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <div className="p-4 bg-[#1f1f1f] border border-gray-600 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">Anúncio Gerado</h2>
                <div className="flex items-center gap-2">
                  <button onClick={handleCopy} className="text-sm bg-gray-600 hover:bg-gray-500 text-white py-1 px-2 rounded-md">
                    {copySuccess ? 'Copiado!' : 'Copiar'}
                  </button>
                  <button onClick={handleRegenerateAd} disabled={isAdLoading || !productDescription} className="p-1 hover:bg-gray-700 rounded-full disabled:text-gray-500">
                    <RefreshIcon />
                  </button>
                </div>
              </div>
              <div className="mt-2">
                {isAdLoading ? (
                  <div className="animate-pulse space-y-2 mt-2">
                    <div className="h-4 bg-slate-700 rounded w-full"></div>
                    <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                  </div>
                ) : (
                   <textarea
                    ref={adTextareaRef}
                    value={generatedAd || 'O texto do seu anúncio aparecerá aqui...'}
                    onChange={(e) => setGeneratedAd(e.target.value)}
                    className="w-full bg-transparent text-gray-300 whitespace-pre-wrap border-none focus:outline-none focus:ring-0 resize-none overflow-y-hidden"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="p-4 bg-[#1f1f1f] border border-gray-600 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">Imagem Sugerida</h2>
                <button onClick={handleRegenerateImage} disabled={isImageLoading || !productDescription} className="p-1 hover:bg-gray-700 rounded-full disabled:text-gray-500">
                  <RefreshIcon />
                </button>
              </div>
              <div className="flex-grow flex items-center justify-center">
                {isImageLoading ? (
                  <div className="animate-pulse w-full h-48 bg-slate-700 rounded-md"></div>
                ) : generatedImageUrl ? (
                  <img src={generatedImageUrl} alt="Produto Gerado" className="w-full h-auto rounded-md" />
                ) : (
                  <div className="w-full min-h-48 bg-transparent border-2 border-dashed border-gray-600 rounded-md flex items-center justify-center">
                    <p className="text-gray-500 text-sm">A imagem aparecerá aqui...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Produto;
