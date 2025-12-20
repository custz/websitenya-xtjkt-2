
import React, { useState, useRef } from 'react';
import { ImageIcon, PlayCircle, X, Plus, Trash2, Video, Film, Upload, Loader2, AlertTriangle } from 'lucide-react';
import { useStore } from '../services/store';
import { GalleryItem } from '../types';

const GalleryPage: React.FC = () => {
  const { data, updateData, isEditMode } = useStore();
  const [filter, setFilter] = useState('all');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newItem, setNewItem] = useState<Partial<GalleryItem>>({
    type: 'image', url: '', title: '', category: 'gambar', thumbnail: ''
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fungsi untuk mengambil thumbnail dari video
  const generateVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        video.currentTime = 1; // Ambil frame pada detik ke-1
      };
      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Batasan aman untuk localStorage (5MB per file agar tidak crash)
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file terlalu besar! Gunakan file di bawah 5MB agar tersimpan dengan aman di browser.");
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        let thumb = '';
        
        if (file.type.startsWith('video/')) {
          thumb = await generateVideoThumbnail(file);
        }

        setNewItem(prev => ({ 
          ...prev, 
          url: base64, 
          thumbnail: thumb,
          type: file.type.startsWith('video/') ? 'video' : 'image',
          category: file.type.startsWith('video/') ? 'video' : 'gambar'
        }));
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setIsUploading(false);
    }
  };

  const addItem = () => {
    if (!newItem.url || !newItem.title?.trim()) {
      alert("Harap isi judul dan pilih file!");
      return;
    }
    
    const item: GalleryItem = {
      id: Date.now().toString(),
      type: newItem.type as 'image' | 'video',
      url: newItem.url!,
      thumbnail: newItem.thumbnail,
      title: newItem.title!.trim(),
      category: newItem.category || (newItem.type === 'video' ? 'video' : 'gambar')
    };

    updateData({ gallery: [...data.gallery, item] });
    setIsAdding(false);
    setNewItem({ type: 'image', url: '', title: '', category: 'gambar', thumbnail: '' });
  };

  const filteredMedia = data.gallery.filter(m => filter === 'all' || m.category === filter);

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-40 px-4 sm:px-6 lg:px-8 bg-[#020617]">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="inline-flex p-3 rounded-2xl bg-blue-600/10 mb-4 border border-blue-500/20">
              <ImageIcon className="text-blue-500" size={24} />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-2">
              Gallery <span className="text-blue-500 italic">Digital</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-md font-medium">
              Dokumentasi visual perjalanan akademik dan momen terbaik kelas TJKT.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto animate-in fade-in slide-in-from-right-4 duration-700">
            {isEditMode && (
              <button 
                onClick={() => setIsAdding(true)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
              >
                <Plus size={18} /> Tambah Momen
              </button>
            )}
            <div className="flex bg-slate-900/50 p-1.5 rounded-xl border border-white/5 backdrop-blur-md w-full md:w-auto overflow-x-auto no-scrollbar">
              {['all', 'gambar', 'video'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`flex-1 md:flex-none px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                    filter === cat ? 'bg-white text-slate-950 shadow-md' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredMedia.map((item, index) => (
            <div 
              key={item.id} 
              className="group relative rounded-[2rem] overflow-hidden border border-white/5 bg-slate-900/30 flex flex-col shadow-xl animate-in fade-in zoom-in-95 duration-500"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {isEditMode && (
                <button 
                  onClick={() => updateData({ gallery: data.gallery.filter(g => g.id !== item.id) })}
                  className="absolute top-4 right-4 p-2.5 bg-red-600/90 backdrop-blur-md text-white rounded-xl z-20 hover:bg-red-500 transition-all shadow-lg active:scale-90"
                >
                  <Trash2 size={16} />
                </button>
              )}

              <div className="relative aspect-[4/3] overflow-hidden cursor-pointer" onClick={() => item.type === 'video' ? setSelectedVideo(item.url) : null}>
                {item.type === 'image' ? (
                  <img 
                    src={item.url} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" 
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full relative">
                    <img 
                      src={item.thumbnail || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=600'} 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-all">
                      <div className="p-4 bg-blue-600/90 text-white rounded-full shadow-2xl transform transition-transform group-hover:scale-110">
                        <PlayCircle size={32} />
                      </div>
                    </div>
                    <div className="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-white text-[9px] font-bold uppercase rounded-full tracking-widest shadow-lg">
                      Video
                    </div>
                  </div>
                )}
                
                {/* Overlay Content */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 md:p-8">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-1 block">
                    {item.category}
                  </span>
                  <h5 className="text-white font-bold text-lg md:text-xl leading-tight">{item.title}</h5>
                </div>
              </div>
            </div>
          ))}

          {filteredMedia.length === 0 && (
            <div className="col-span-full py-32 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-slate-900/10">
              <Film className="mx-auto text-slate-800 mb-6" size={64} strokeWidth={1} />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Belum ada momen yang diunggah.</p>
            </div>
          )}
        </div>

        {/* Video Player Overlay */}
        {selectedVideo && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 md:p-12 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-500">
            <button 
              onClick={() => setSelectedVideo(null)} 
              className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all z-[210] active:scale-90"
            >
              <X size={28} />
            </button>
            <div className="w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black animate-in zoom-in-95 duration-300">
              <video 
                src={selectedVideo} 
                controls 
                autoPlay 
                playsInline
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        {/* Add Momen Modal */}
        {isAdding && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="bg-slate-900 border border-white/10 p-6 sm:p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl my-auto animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black tracking-tight">Upload Momen</h3>
                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-800 rounded-xl transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div 
                  className={`relative flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed border-slate-700 rounded-3xl bg-slate-800/30 hover:bg-slate-800/50 hover:border-blue-500/50 transition-all cursor-pointer group ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading ? (
                    <div className="text-center">
                      <Loader2 size={32} className="text-blue-500 animate-spin mx-auto mb-4" />
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Memproses File...</p>
                    </div>
                  ) : newItem.url ? (
                    <div className="w-full text-center">
                      {newItem.type === 'image' ? (
                        <img src={newItem.url} className="h-32 mx-auto rounded-xl shadow-lg border border-white/10" />
                      ) : (
                        <div className="relative h-32 w-full max-w-[200px] mx-auto rounded-xl overflow-hidden border border-white/10 shadow-lg">
                           <img src={newItem.thumbnail} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                             <PlayCircle size={24} className="text-white" />
                           </div>
                        </div>
                      )}
                      <p className="text-[10px] text-blue-400 font-black mt-4 uppercase tracking-[0.2em]">Klik untuk ganti file</p>
                    </div>
                  ) : (
                    <>
                      <div className="p-4 bg-slate-900 rounded-2xl mb-4 text-slate-500 group-hover:text-blue-500 transition-colors">
                        <Upload size={32} />
                      </div>
                      <p className="text-sm font-bold text-slate-300">Pilih Gambar atau Video</p>
                      <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest font-black">Maksimal 5MB</p>
                    </>
                  )}
                  <input 
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Judul Momen</label>
                  <input 
                    className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                    placeholder="Contoh: Praktikum Server Debian"
                    value={newItem.title}
                    onChange={e => setNewItem({...newItem, title: e.target.value})}
                    maxLength={40}
                  />
                </div>

                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex gap-3">
                   <AlertTriangle className="text-orange-500 shrink-0" size={18} />
                   <p className="text-[10px] text-orange-200/70 font-medium leading-relaxed uppercase">
                     Data disimpan di browser lokal. Menghapus cache browser akan menghapus data yang diunggah secara manual.
                   </p>
                </div>

                <button 
                  onClick={addItem}
                  disabled={!newItem.url || isUploading || !newItem.title?.trim()}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black transition-all shadow-xl shadow-blue-600/20 uppercase tracking-[0.2em] text-xs"
                >
                  Publish Momen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
