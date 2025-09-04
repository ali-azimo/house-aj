import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { 
  FaHome, FaUpload, FaTrash, FaDollarSign, FaTag,
  FaMapMarkerAlt, FaInfoCircle, FaBed, FaBath,
  FaUtensils, FaParking,
} from 'react-icons/fa';

export default function UpdateHouse() {
  const { currentUser } = useSelector((state) => state.user);
  const { id } = useParams();
  const navigate = useNavigate();

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

  // 🔹 Buscar dados da casa ao montar
  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const res = await fetch(`/api/houses/get/${id}`, 
        { credentials: "include" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erro ao buscar casa");
        
        setFormData({
          imageUrls: data.data.imageUrls || [],
          name: data.data.name || "",
          descricao: data.data.descricao || "",
          address: data.data.address || "",
          regularPrice: data.data.regularPrice || "",
          discountPrice: data.data.discountPrice || "",
          bathroom: data.data.bathroom || 1,
          bedroom: data.data.bedroom || 1,
          kitchen: data.data.kitchen || 1,
          parking: Boolean(data.data.parking),
          type: data.data.type || "rent",
          offer: Boolean(data.data.offer),
        });
      } catch (err) {
        setErrorSubmit(err.message);
      }
    };
    fetchHouse();
  }, [id]);

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

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      setUploading(true);
      setImageUploadError(false);

      Promise.all(files.map(storeImage))
        .then((urls) => {
          setFormData((prev) => ({
            ...prev,
            imageUrls: prev.imageUrls.concat(urls),
          }));
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError('Upload de imagem falhou (máx. 2MB por imagem)');
          setUploading(false);
        });
    } else {
      setImageUploadError('Só pode enviar até 6 imagens por anúncio');
    }
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
    if (name === 'type') {
      setFormData({ ...formData, type: value });
      return;
    }
    if (['regularPrice', 'discountPrice', 'bathroom', 'bedroom', 'kitchen'].includes(id)) {
      if (value && !/^\d*\.?\d*$/.test(value)) return;
    }
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) return setErrorSubmit('Deve enviar pelo menos uma imagem');
      if (formData.offer && +formData.discountPrice >= +formData.regularPrice) {
        return setErrorSubmit('O preço com desconto deve ser menor que o preço regular');
      }

      setLoadingSubmit(true);
      setErrorSubmit(false);
      setSuccessSubmit(false);

      const dataToSubmit = {
        ...formData,
        userRef: currentUser._id || currentUser.id,
        regularPrice: parseFloat(formData.regularPrice) || 0,
        discountPrice: formData.offer ? parseFloat(formData.discountPrice) || 0 : 0,
        bathroom: parseInt(formData.bathroom) || 1,
        bedroom: parseInt(formData.bedroom) || 1,
        kitchen: parseInt(formData.kitchen) || 1,
      };

      const res = await fetch(`/api/houses/update/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      });

      const data = await res.json();
      setLoadingSubmit(false);

      if (!res.ok) return setErrorSubmit(data.message || data.error || 'Erro ao atualizar anúncio');
      
      setSuccessSubmit("Propriedade atualizada com sucesso!");
      setTimeout(() => navigate(`/dashboard/show_item`), 1500);

    } catch (error) {
      setErrorSubmit(error.message);
      setLoadingSubmit(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#101828] rounded-2xl mb-4 shadow-lg">
            <FaHome className="text-3xl text-white" />
          </div>
          <h1 className='text-4xl font-bold text-[#101828] mb-3'>Editar Propriedade</h1>
          <p className="text-gray-600 text-lg">Atualize os detalhes da sua propriedade</p>
        </div>

          {/* Formulário */}

<div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">

            {/* Informações Básicas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-[#101828] mb-6 pb-3 border-b border-gray-200 flex items-center gap-3">
                  <div className="w-3 h-8 bg-[#101828] rounded-full"></div>
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
                  <div className="w-3 h-8 bg-[#101828] rounded-full"></div>
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
                      className="w-5 h-5 text-[#101828] rounded focus:ring-[#101828]"
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
                    <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${formData.type === 'sale' ? 'border-[#101828] bg-gray-100' : 'border-gray-200 hover:border-[#101828]'}`}>
                      <input 
                        type="radio" 
                        name="type"
                        value="sale"
                        checked={formData.type === 'sale'}
                        onChange={handleChange}
                        className="w-5 h-5 text-[#101828] focus:ring-[#101828]"
                      />
                      <span className="font-medium">Venda</span>
                    </label>
                    
                    <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${formData.type === 'rent' ? 'border-[#101828] bg-gray-100' : 'border-gray-200 hover:border-[#101828]'}`}>
                      <input 
                        type="radio" 
                        name="type"
                        value="rent"
                        checked={formData.type === 'rent'}
                        onChange={handleChange}
                        className="w-5 h-5 text-[#101828] focus:ring-[#101828]"
                      />
                      <span className="font-medium">Aluguel</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Especificações */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
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

              <div className="bg-gray-50 p-6 rounded-2xl text-center flex items-center justify-center">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    id="parking" 
                    checked={formData.parking} 
                    onChange={handleChange} 
                    className="w-5 h-5 text-[#101828] focus:ring-[#101828]" 
                  />
                  <FaParking className="text-[#101828] text-xl" />
                  <span className="text-sm font-semibold text-[#101828]">Estacionamento</span>
                </label>
              </div>
            </div>

            {/* Galeria de Imagens */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#101828] mb-6 pb-3 border-b border-gray-200 flex items-center gap-3">
                <div className="w-3 h-8 bg-[#101828] rounded-full"></div>
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
                        onChange={(e) => setFiles(Array.from(e.target.files))}
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
                    <button 
                      type="button" 
                      onClick={handleImageSubmit} 
                      disabled={uploading}
                      className="mt-4 px-6 py-2 bg-[#101828] text-white rounded-xl hover:bg-[#0a1424] transition-colors disabled:opacity-50"
                    >
                      {uploading ? 'Enviando...' : `Adicionar ${files.length} Imagem(ns)`}
                    </button>
                  )}

                  {imageUploadError && <p className="text-red-500 mt-2 text-sm">{imageUploadError}</p>}
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
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    ))}
                    {formData.imageUrls.length === 0 && (
                      <div className="col-span-3 text-center py-10 text-gray-500">
                        Nenhuma imagem adicionada ainda
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Botão de Submissão */}

             <div className="text-center">
              {errorSubmit && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 border border-red-200">
                  {errorSubmit}
                </div>
              )}
              {successSubmit && (
                <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 border border-green-200">
                  {successSubmit}
                </div>
              )}

              <button 
                type="submit"
                disabled={loadingSubmit}
                className="px-10 py-4 bg-[#101828] text-white font-semibold rounded-xl hover:bg-[#0a1424] transition-colors disabled:opacity-50 w-full md:w-auto"
              >
                {loadingSubmit ? 'Atualizando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </main>
  );
}
