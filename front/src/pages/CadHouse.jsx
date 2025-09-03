import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { 
  FaHome, 
  FaUpload, 
  FaTrash, 
  FaDollarSign, 
  FaTag,
  FaMapMarkerAlt,
  FaPlus,
  FaSpinner,
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBed,
  FaBath,
  FaUtensils,
  FaParking,
} from 'react-icons/fa';

export default function CadHouse() {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]); 
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorSubmit, setErrorSubmit] = useState(false);
  const [successSubmit, setSuccessSubmit] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    descricao: "",
    address: "",
    regularPrice: "",
    discountPrice: "",
    bathroom: 1,
    bedroom: 1,
    kitchen: 1,
    parking: false,
    type: "rent",
    offer: false,
  });

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData, 
            imageUrls: formData.imageUrls.concat(urls),
          });
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError('Upload de imagem falhou (máx. 2MB por imagem)');
          setUploading(false);
        });
    } else {
      setImageUploadError('Só pode enviar até 6 imagens por anúncio');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      uploadTask.on(
        'state_changed',
        null,
        (error) => reject(error),
        () => getDownloadURL(uploadTask.snapshot.ref).then(resolve)
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    const { id, name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData({ ...formData, [id]: checked });
      return;
    }

    if (type === 'radio') {
      setFormData({ ...formData, [name]: value });
      return;
    }

    setFormData({ ...formData, [id]: value });
  };

  const cleanFormData = (data) => {
    const cleaned = { ...data };
    
    Object.keys(cleaned).forEach(key => {
      if (cleaned[key] === "" || cleaned[key] === undefined) cleaned[key] = null;
      if (['regularPrice', 'discountPrice', 'bathroom', 'bedroom', 'kitchen'].includes(key)) {
        cleaned[key] = cleaned[key] ? Number(cleaned[key]) : 0;
      }
    });
    
    return cleaned;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (formData.imageUrls.length < 1) return setErrorSubmit('Deve enviar pelo menos uma imagem');
      if (formData.offer && +formData.discountPrice >= +formData.regularPrice) return setErrorSubmit('O preço com desconto deve ser menor que o preço regular');

      setLoadingSubmit(true);
      setErrorSubmit(false);
      setSuccessSubmit(false);
      
      const cleanedData = cleanFormData({ ...formData, userRef: currentUser._id || currentUser.id });
      const res = await fetch('/api/houses', {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData),
      });
      
      const data = await res.json();
      setLoadingSubmit(false);

      if (!res.ok) return setErrorSubmit(data.message || data.error || 'Erro ao criar anúncio');
      
      // Reset form
      setFormData({
        imageUrls: [],
        name: "",
        descricao: "",
        address: "",
        regularPrice: "",
        discountPrice: "",
        bathroom: 1,
        bedroom: 1,
        kitchen: 1,
        parking: false,
        type: "rent",
        offer: false,
      });
      setFiles([]);
      setSuccessSubmit('Propriedade cadastrada com sucesso!');
      setTimeout(() => setSuccessSubmit(false), 3000);

    } catch (error) {
      setErrorSubmit(error.message);
      setLoadingSubmit(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#101828] to-[#1e293b] rounded-2xl mb-4 shadow-lg">
            <FaHome className="text-3xl text-white" />
          </div>
          <h1 className='text-4xl font-bold text-[#101828] mb-3'>Cadastrar Nova Propriedade</h1>
          <p className="text-gray-600 text-lg">Preencha todos os detalhes para criar um anúncio atrativo</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">

            {/* Informações Básicas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-[#101828] mb-6 pb-3 border-b border-gray-200 flex items-center gap-3">
                  <div className="w-3 h-8 bg-gradient-to-b from-[#101828] to-[#2d3748] rounded-full"></div>
                  Informações Básicas
                </h2>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <label className="block text-sm font-semibold text-[#101828] mb-3 flex items-center gap-2">
                    <FaHome className="text-[#101828]" />
                    Nome da Propriedade *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ex: Apartamento Premium com Vista para o Mar"
                    className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-[#101828] focus:border-transparent transition-all duration-200 bg-white"
                    required
                  />
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl">
                  <label className="block text-sm font-semibold text-[#101828] mb-3 flex items-center gap-2">
                    <FaInfoCircle className="text-[#101828]" />
                    Descrição Detalhada *
                  </label>
                  <textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    placeholder="Descreva os detalhes da propriedade, localização, vistas, amenities exclusivas..."
                    className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-[#101828] focus:border-transparent transition-all duration-200 h-32 resize-none bg-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <label className="block text-sm font-semibold text-[#101828] mb-3 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#101828]" />
                    Endereço Completo *
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Rua, número, bairro, cidade, estado"
                    className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-[#101828] focus:border-transparent transition-all duration-200 bg-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Informações Financeiras */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-[#101828] mb-6 pb-3 border-b border-gray-200 flex items-center gap-3">
                  <div className="w-3 h-8 bg-gradient-to-b from-[#101828] to-[#2d3748] rounded-full"></div>
                  Informações Financeiras
                </h2>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <label className="block text-sm font-semibold text-[#101828] mb-3 flex items-center gap-2">
                    <FaDollarSign className="text-[#101828]" />
                    Preço Regular ($) *
                  </label>
                  <input
                    type="number"
                    id="regularPrice"
                    value={formData.regularPrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-[#101828] focus:border-transparent transition-all duration-200 bg-white"
                    required
                  />
                </div>

                <div className="bg-white p-6 rounded-2xl border-2 border-gray-200">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      id="offer" 
                      checked={formData.offer} 
                      onChange={handleChange}
                      className="w-5 h-5 text-[#101828] rounded"
                    />
                    <span className="font-semibold text-[#101828]">Oferecer desconto</span>
                  </label>
                </div>
              </div>

              <div className="space-y-6">
                {formData.offer && (
                  <div className="bg-gray-50 p-6 rounded-2xl">
                    <label className="block text-sm font-semibold text-[#101828] mb-3 flex items-center gap-2">
                      <FaTag className="text-[#101828]" />
                      Preço com Desconto ($) *
                    </label>
                    <input
                      type="number"
                      id="discountPrice"
                      value={formData.discountPrice}
                      onChange={handleChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-[#101828] focus:border-transparent transition-all duration-200 bg-white"
                      required={formData.offer}
                    />
                  </div>
                )}

                <div className="bg-gray-50 p-6 rounded-2xl">
                  <label className="block text-sm font-semibold text-[#101828] mb-4">Tipo de Transação *</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-[#101828] transition-colors">
                      <input 
                        type="radio" 
                        name="type"
                        value="sale"
                        checked={formData.type === 'sale'}
                        onChange={handleChange}
                        className="w-5 h-5 text-[#101828]"
                      />
                      <span className="font-medium">Venda</span>
                    </label>
                    
                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-[#101828] transition-colors">
                      <input 
                        type="radio" 
                        name="type"
                        value="rent"
                        checked={formData.type === 'rent'}
                        onChange={handleChange}
                        className="w-5 h-5 text-[#101828]"
                      />
                      <span className="font-medium">Aluguel</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Especificações */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
              <div className="bg-gray-50 p-6 rounded-2xl text-center">
                <FaBed className="text-2xl text-[#101828] mx-auto mb-3" />
                <label className="block text-sm font-semibold text-[#101828] mb-2">Quartos *</label>
                <input
                  type="number"
                  id="bedroom"
                  value={formData.bedroom}
                  onChange={handleChange}
                  min="1"
                  max="20"
                  className="w-full border border-gray-300 p-3 rounded-xl text-center focus:ring-2 focus:ring-[#101828] bg-white"
                  required
                />
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl text-center">
                <FaBath className="text-2xl text-[#101828] mx-auto mb-3" />
                <label className="block text-sm font-semibold text-[#101828] mb-2">Banheiros *</label>
                <input
                  type="number"
                  id="bathroom"
                  value={formData.bathroom}
                  onChange={handleChange}
                  min="1"
                  max="20"
                  className="w-full border border-gray-300 p-3 rounded-xl text-center focus:ring-2 focus:ring-[#101828] bg-white"
                  required
                />
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl text-center">
                <FaUtensils className="text-2xl text-[#101828] mx-auto mb-3" />
                <label className="block text-sm font-semibold text-[#101828] mb-2">Cozinhas *</label>
                <input
                  type="number"
                  id="kitchen"
                  value={formData.kitchen}
                  onChange={handleChange}
                  min="1"
                  max="5"
                  className="w-full border border-gray-300 p-3 rounded-xl text-center focus:ring-2 focus:ring-[#101828] bg-white"
                  required
                />
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl text-center col-span-1">
                <label className="flex items-center gap-3">
                  <input type="checkbox" id="parking" checked={formData.parking} onChange={handleChange} className="w-4 h-4 text-[#101828]" />
                  <FaParking className="text-[#101828]" />
                  <span className="text-sm">Estacionamento</span>
                </label>
              </div>
            </div>

            {/* Galeria de Imagens */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#101828] mb-6 pb-3 border-b border-gray-200 flex items-center gap-3">
                <div className="w-3 h-8 bg-gradient-to-b from-[#101828] to-[#2d3748] rounded-full"></div>
                Galeria de Imagens
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <label className="block text-sm font-semibold text-[#101828] mb-4 flex items-center gap-2">
                    <FaUpload className="text-[#101828]" />
                    Upload de Imagens
                  </label>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-[#101828] transition-colors group">
                    <FaUpload className="mx-auto text-gray-400 group-hover:text-[#101828] mb-4 text-3xl" />
                    <p className="text-sm text-gray-600 mb-2">Arraste e solte imagens aqui ou</p>
                    <label className="inline-block bg-[#101828] text-white px-6 py-3 rounded-xl cursor-pointer hover:bg-[#0a1424] transition-colors">
                      <span>Selecionar Arquivos</span>
                      <input 
                        onChange={(e) => setFiles(e.target.files)}
                        className="hidden" 
                        type="file" 
                        id="images" 
                        accept="image/*" 
                        multiple
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-3">Máximo 6 imagens • PNG, JPG, JPEG • 2MB cada</p>
                  </div>

                  {files.length > 0 && (
                    <button type="button" onClick={handleImageSubmit} className="mt-4 px-6 py-2 bg-[#101828] text-white rounded-xl hover:bg-[#0a1424] transition-colors">
                      {uploading ? 'Enviando...' : 'Adicionar Imagens'}
                    </button>
                  )}

                  {imageUploadError && <p className="text-red-500 mt-2">{imageUploadError}</p>}
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl">
                  <label className="block text-sm font-semibold text-[#101828] mb-4">Pré-visualização das Imagens</label>
                  <div className="grid grid-cols-3 gap-4">
                    {formData.imageUrls.map((img, index) => (
                      <div key={index} className="relative group rounded-xl overflow-hidden">
                        <img src={img} alt={`Imagem ${index+1}`} className="w-full h-32 object-cover rounded-xl" />
                        <button 
                          type="button" 
                          onClick={() => handleRemoveImage(index)} 
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Botão de Submissão */}
            <div className="text-center">
              {errorSubmit && <p className="text-red-600 mb-2">{errorSubmit}</p>}
              {successSubmit && <p className="text-green-600 mb-2">{successSubmit}</p>}

              <button 
                type="submit"
                disabled={loadingSubmit}
                className="px-10 py-3 bg-[#101828] text-white font-semibold rounded-xl hover:bg-[#0a1424] transition-colors"
              >
                {loadingSubmit ? 'A enviar...' : 'Cadastrar Propriedade'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
