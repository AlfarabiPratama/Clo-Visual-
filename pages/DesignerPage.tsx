
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from '../components/Navbar';
import { Download, Save, Wand2, Upload, MessageSquare, X, Send, Box } from 'lucide-react';
import { DesignState, GarmentType, ChatMessage, FitType } from '../types';
import ThreeDViewer from '../components/ThreeDViewer';
import { generateDesignFromText, generateDesignFromImage, chatWithAiAssistant } from '../services/aiService';

const DesignerPage: React.FC = () => {
  const location = useLocation();
  const initialState = location.state as any;

  // --- State ---
  const [designState, setDesignState] = useState<DesignState>({
    projectName: initialState?.name || 'Untitled Project',
    garmentType: initialState?.type || initialState?.project?.garmentType || GarmentType.TSHIRT,
    color: '#ffffff',
    textureUrl: null, // Start with no texture
    description: initialState?.project?.description || '',
    fit: 'Regular', // Default fit
    textureScale: 3, // Default scale
    customModelUrl: null // Start with no custom model
  });

  const [promptText, setPromptText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  
  // Chat Assistant State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Halo! Ada yang bisa saya bantu dengan desain Anda hari ini?' }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Ref for the 3D Canvas (for export)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // --- Handlers ---

  const handleTextGeneration = async () => {
    if (!promptText.trim()) return;
    
    setIsGenerating(true);
    setStatusMessage('AI sedang menganalisis prompt...');
    
    try {
      const result = await generateDesignFromText(promptText);
      setStatusMessage('Menerapkan desain...');
      
      setDesignState(prev => ({
        ...prev,
        color: result.suggestedColor,
        textureUrl: result.texturePattern,
        description: result.designDescription
      }));
      
      setStatusMessage('Selesai!');
    } catch (error) {
      setStatusMessage('Gagal generate desain.');
    } finally {
      setIsGenerating(false);
      // Clear status after delay
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsGenerating(true);
      setStatusMessage('Menganalisis gambar referensi...');

      try {
        const result = await generateDesignFromImage(file);
        
        setDesignState(prev => ({
          ...prev,
          color: result.suggestedColor,
          textureUrl: result.texturePattern,
          description: result.designDescription
        }));
        setStatusMessage('Desain diterapkan dari gambar.');
      } catch (error) {
        setStatusMessage('Gagal memproses gambar.');
      } finally {
        setIsGenerating(false);
        setTimeout(() => setStatusMessage(''), 3000);
      }
    }
  };

  const handleModelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setDesignState(prev => ({ ...prev, customModelUrl: url }));
      setStatusMessage(`Model ${file.name} dimuat!`);
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsChatLoading(true);

    const reply = await chatWithAiAssistant(chatHistory, userMsg);
    
    setChatHistory(prev => [...prev, { role: 'assistant', content: reply }]);
    setIsChatLoading(false);
  };

  const handleExport = (type: 'png' | 'glb') => {
    if (type === 'png') {
      if (canvasRef.current) {
        try {
          const dataUrl = canvasRef.current.toDataURL('image/png');
          const link = document.createElement('a');
          link.download = `${designState.projectName.replace(/\s+/g, '_')}_design.png`;
          link.href = dataUrl;
          link.click();
          setStatusMessage('Gambar berhasil didownload!');
          setTimeout(() => setStatusMessage(''), 3000);
        } catch (err) {
          console.error("Screenshot failed:", err);
          alert("Gagal mengambil screenshot. Pastikan browser mendukung.");
        }
      } else {
        alert("Canvas belum siap untuk diekspor.");
      }
    } else {
      // Stub for GLB export
      alert(`Fitur Export GLB akan mengemas scene 3D saat ini ke file .glb.\n\nTODO: Implementasi GLTFExporter dari Three.js di sini.`);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-gray-100">
      
      {/* --- Left Sidebar: Controls --- */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Designer Tools</h2>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Text to Design */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi Teks (Prompt)
            </label>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-orange-500 focus:border-orange-500"
              rows={4}
              placeholder="Contoh: Batik modern warna biru laut dengan aksen emas..."
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
            />
            <button 
              onClick={handleTextGeneration}
              disabled={isGenerating}
              className={`mt-2 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isGenerating ? 'bg-orange-400' : 'bg-orange-600 hover:bg-orange-700'}`}
            >
              <Wand2 className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate Design'}
            </button>
          </div>

          <div className="border-t border-gray-100 my-4"></div>

          {/* Image to Design */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Referensi Gambar
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="text-xs text-gray-500">Click to upload sketch/photo</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
          </div>

          <div className="border-t border-gray-100 my-4"></div>

          {/* Custom Model Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model 3D (.glb)
            </label>
            <div className="flex items-center gap-2">
               <label className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                 <Box className="h-4 w-4 mr-2" />
                 {designState.customModelUrl ? 'Ganti Model' : 'Upload Model'}
                 <input type="file" className="hidden" accept=".glb,.gltf" onChange={handleModelUpload} />
               </label>
               {designState.customModelUrl && (
                 <button 
                  onClick={() => setDesignState(prev => ({ ...prev, customModelUrl: null }))}
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                  title="Hapus Model"
                 >
                   <X className="h-4 w-4" />
                 </button>
               )}
            </div>
            {designState.customModelUrl && <p className="mt-1 text-xs text-green-600">Model kustom aktif</p>}
          </div>

          <div className="border-t border-gray-100 my-4"></div>

          {/* Manual Controls */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pengaturan Dasar</label>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-500">Warna Dasar</span>
                <div className="flex gap-2 mt-1">
                  <input 
                    type="color" 
                    value={designState.color}
                    onChange={(e) => setDesignState({...designState, color: e.target.value})}
                    className="h-8 w-12 p-0 border-0 rounded cursor-pointer" 
                  />
                  <div className="text-sm py-1 px-2 bg-gray-100 rounded text-gray-600 uppercase">
                    {designState.color}
                  </div>
                </div>
              </div>
              
              {/* Only show Garment Type selector if NO custom model is loaded */}
              {!designState.customModelUrl && (
                <div>
                  <span className="text-xs text-gray-500">Tipe Pakaian</span>
                  <select 
                    value={designState.garmentType}
                    onChange={(e) => setDesignState({...designState, garmentType: e.target.value})}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  >
                    <option value={GarmentType.TSHIRT}>T-Shirt</option>
                    <option value={GarmentType.HOODIE}>Hoodie</option>
                    <option value={GarmentType.DRESS}>Dress</option>
                  </select>
                </div>
              )}

              <div>
                 <span className="text-xs text-gray-500">Ukuran / Fit (Scale)</span>
                 <select 
                  value={designState.fit}
                  onChange={(e) => setDesignState({...designState, fit: e.target.value as FitType})}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                 >
                   <option value="Regular">Regular Fit</option>
                   <option value="Slim">Slim Fit</option>
                   <option value="Oversized">Oversized / Baggy</option>
                 </select>
              </div>

              {/* Texture Scale Control */}
              {designState.textureUrl && (
                <div className="pt-2 border-t border-dashed border-gray-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">Skala Motif</span>
                    <span className="text-xs text-gray-900">{designState.textureScale}x</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    step="0.5"
                    value={designState.textureScale}
                    onChange={(e) => setDesignState({...designState, textureScale: parseFloat(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- Center: 3D Preview --- */}
      <div className="flex-1 flex flex-col relative bg-gray-200">
        <div className="flex-1 p-6 flex flex-col gap-4 h-full">
          
          {/* Top: Fabric Preview (Simulated 2D generation result) */}
          <div className="h-24 bg-white rounded-lg p-3 shadow-sm flex items-center gap-4">
             <div className="w-16 h-16 rounded bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
               {designState.textureUrl ? (
                 <img src={designState.textureUrl} alt="Generated Pattern" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 text-center">No Texture</div>
               )}
             </div>
             <div className="flex-1">
               <h4 className="text-sm font-medium text-gray-900">AI Generated Output</h4>
               <p className="text-xs text-gray-500 line-clamp-2">
                 {designState.description || "Belum ada desain yang digenerate. Gunakan panel kiri untuk mulai."}
               </p>
             </div>
          </div>

          {/* Main: 3D Viewer */}
          <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
            <ThreeDViewer 
              ref={canvasRef}
              color={designState.color} 
              textureUrl={designState.textureUrl}
              garmentType={designState.garmentType}
              fit={designState.fit}
              textureScale={designState.textureScale}
              customModelUrl={designState.customModelUrl}
            />
            {statusMessage && (
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white px-6 py-3 rounded-full text-sm font-medium backdrop-blur-md animate-pulse">
                 {statusMessage}
               </div>
            )}
          </div>
        </div>

        {/* Chat Toggle Button */}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="absolute bottom-6 right-6 bg-orange-600 text-white p-3 rounded-full shadow-lg hover:bg-orange-700 transition-colors z-20"
        >
          {isChatOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        </button>

        {/* Chat Assistant Panel */}
        {isChatOpen && (
          <div className="absolute bottom-20 right-6 w-80 bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col h-96 z-20">
            <div className="p-3 border-b bg-orange-50 rounded-t-xl flex justify-between items-center">
              <h3 className="font-semibold text-gray-800 text-sm">Asisten Desain AI</h3>
            </div>
            <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-50">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${msg.role === 'user' ? 'bg-orange-600 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isChatLoading && <div className="text-xs text-gray-400 italic">Asisten sedang mengetik...</div>}
            </div>
            <form onSubmit={handleChatSubmit} className="p-2 border-t bg-white rounded-b-xl flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Tanya ide desain..."
                className="flex-1 text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-orange-500 focus:border-orange-500"
              />
              <button type="submit" className="bg-gray-100 hover:bg-gray-200 p-2 rounded-md text-gray-600">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* --- Right Sidebar: Details & Export --- */}
      <div className="w-72 bg-white border-l border-gray-200 p-4 flex flex-col">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Detail Proyek</h2>
        
        <div className="space-y-4 mb-auto">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Proyek</label>
            <p className="text-sm font-medium text-gray-900 mt-1">{designState.projectName}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Jenis</label>
            <p className="text-sm text-gray-900 mt-1">{designState.customModelUrl ? 'Custom Model' : designState.garmentType}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Fit</label>
            <p className="text-sm text-gray-900 mt-1">{designState.fit}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Catatan</label>
            <textarea 
              className="mt-1 w-full text-sm border-gray-300 rounded-md shadow-sm border p-2 h-24"
              placeholder="Tambahkan catatan teknis..."
            ></textarea>
          </div>
        </div>

        <div className="space-y-3 pt-6 border-t border-gray-200">
           <button 
             className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
             onClick={() => alert("Project saved to local state.")}
           >
             <Save className="h-4 w-4 mr-2" />
             Simpan Desain
           </button>
           <button 
            onClick={() => handleExport('png')}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
           >
             <Download className="h-4 w-4 mr-2" />
             Export Gambar (PNG)
           </button>
           <button 
            onClick={() => handleExport('glb')}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900"
           >
             <BoxIcon className="h-4 w-4 mr-2" />
             Export 3D (GLB)
           </button>
        </div>
      </div>

    </div>
  );
};

// Simple Icon component helper
const BoxIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
);

export default DesignerPage;
