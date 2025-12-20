
import React, { useState, useRef } from 'react';
import { ImageIcon, PlayCircle, X, Plus, Trash2, Video, Film, Upload, Loader2 } from 'lucide-react';
import { useStore } from '../services/store';
import { GalleryItem } from '../types';

const GalleryPage: React.FC = () => {
  const { data, updateData, isEditMode } = useStore();
  const [filter, setFilter] = useState('all');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Partial<GalleryItem>>({
    type: 'image', url: '', title: '', category: 'gambar'
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addItem = () => {
    if (!newItem.url) return;
    const item: GalleryItem = {
      id: Date.now().toString(),
      type: newItem.type as 'image' | 'video',
      url: newItem.url!,
      title: newItem.title || 'Momen Baru',
      category: newItem.type === 'video' ? 'video' : 'gambar'
    };
    updateData({ gallery: [...data.gallery, item] });
    setIsAdding(false);
    setNewItem({ type: 'image', url: '', title: '', category: 'gambar' });
  };

  const removeItem = (id: string) => {
    if(window.confirm("Hapus momen ini secara permanen?")) {
      updateData({ gallery: data.gallery.filter(g => g.id !== id) });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) { // 20MB limit for local storage stability
        alert("Ukuran file terlalu besar (Maks 20MB untuk kestabilan browser)");
        return;
      }
      
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem(prev => ({ ...prev, url: reader.result as string }));
        setIsUploading(false);
      };
      reader.onerror = () => {
        alert("Gagal membaca file");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredMedia = data.gallery.filter(m => filter === 'all' || m.category === filter);

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-40 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="w-full md:w-auto">
            <div className="inline-flex p-3 md:p-4 rounded-2xl md:rounded-3xl bg-purple-600/10 mb-4 md:mb-6">
              <ImageIcon className="text-purple-500" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4">Gallery Digital</h1>
            <p className="text-slate-400 text-sm md:text-lg">Dokumentasi visual perjalanan akademik TJKT.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {isEditMode && (
              <button 
                onClick={() => setIsAdding(true)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-600/20 hover:bg-purple-500 transition-all"
              >
                <Plus size={18} /> Upload
              </button>
            )}
            <div className="flex bg-slate-900/50 p-1 rounded-xl md:rounded-2xl border border-white/5 backdrop-blur-md w-full md:w-auto overflow-x-auto">
              {['all', 'gambar', 'video'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`flex-1 px-4 md:px-6 py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                    filter === cat ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredMedia.map((item) => (
            <div key={item.id} className="relative group rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-slate-900/50 flex flex-col">
              
              {isEditMode && (
                <button 
                  onClick={() => removeItem(item.id)}
                  className="absolute top-3 right-3 p-2 bg-red-600/80 backdrop-blur-md text-white rounded-xl z-20 hover:bg-red-500 transition-colors shadow-lg"
                >
                  <Trash2 size={16} />
                </button>
              )}

              <div className="relative aspect-video overflow-hidden">
                {item.type === 'image' ? (
                   <img 
                   src={item.url} 
                   alt={item.title} 
                   className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105" 
                   loading="lazy"
                 />
                ) : (
                  <div className="w-full h-full bg-slate-800 relative group cursor-pointer" onClick={() => setSelectedVideo(item.url)}>
                    {/* Live Preview Video - Muted & Loop for Thumbnail effect */}
                    <video 
                      src={item.url} 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                      muted 
                      loop 
                      playsInline 
                      onMouseOver={e => (e.target as HTMLVideoElement).play()}
                      onMouseOut={e => (e.target as HTMLVideoElement).pause()}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="p-3 bg-white/10 backdrop-blur-xl rounded-full text-white border border-white/30 group-hover:scale-110 transition-transform shadow-2xl">
                        <PlayCircle size={32} />
                      </div>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 md:p-8">
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest mb-1 block">
                    {item.category}
                  </span>
                  <h5 className="text-white font-bold text-base md:text-lg leading-tight">{item.title}</h5>
                </div>
              </div>
            </div>
          ))}
          
          {filteredMedia.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
              <Film className="mx-auto text-slate-800 mb-4" size={48} />
              <p className="text-slate-500 font-medium">Belum ada konten di kategori ini.</p>
            </div>
          )}
        </div>

        {/* Video Player Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-12 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300">
            <button onClick={() => setSelectedVideo(null)} className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all z-[160]">
              <X size={24} />
            </button>
            <div className="w-full max-w-5xl aspect-video rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black flex items-center justify-center">
              <video 
                src={selectedVideo} 
                controls 
                autoPlay 
                playsInline
                className="w-full h-full max-h-full" 
              />
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {isAdding && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="bg-slate-900 border border-white/10 p-6 md:p-8 rounded-[2rem] w-full max-w-md shadow-2xl my-auto animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl md:text-2xl font-bold">Upload Momen</h3>
                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-800 rounded-xl transition-all">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-5">
                <div className="flex bg-slate-800 p-1 rounded-xl">
                  <button 
                    onClick={() => setNewItem({...newItem, type: 'image', category: 'gambar'})}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${newItem.type === 'image' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}
                  >
                    <Film size={16} /> Gambar
                  </button>
                  <button 
                    onClick={() => setNewItem({...newItem, type: 'video', category: 'video'})}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${newItem.type === 'video' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}
                  >
                    <Video size={16} /> Video
                  </button>
                </div>
                
                <div 
                  className={`flex flex-col items-center p-6 md:p-10 border-2 border-dashed border-slate-700 rounded-2xl bg-slate-800/30 hover:bg-slate-800/50 transition-all group cursor-pointer relative overflow-hidden min-h-[160px] justify-center ${isUploading ? 'opacity-50 pointer-events-none' : ''}`} 
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 size={32} className="text-blue-500 animate-spin mb-4" />
                      <p className="text-sm font-bold text-slate-300">Memproses File...</p>
                    </div>
                  ) : newItem.url ? (
                    <div className="w-full text-center">
                      {newItem.type === 'image' ? (
                        <img src={newItem.url} className="h-28 mx-auto rounded-lg object-contain" />
                      ) : (
                        <div className="flex flex-col items-center">
                          <Film size={40} className="text-blue-500 mb-2" />
                          <p className="text-[10px] text-slate-400">File Video Siap</p>
                        </div>
                      )}
                      <p className="text-[10px] text-blue-400 font-bold mt-3 uppercase tracking-widest">Klik untuk ganti</p>
                    </div>
                  ) : (
                    <>
                      <Upload size={32} className="text-slate-500 group-hover:text-blue-500 transition-colors mb-3" />
                      <p className="text-sm font-bold text-slate-300">Pilih File</p>
                      <p className="text-[10px] text-slate-500 mt-1 uppercase">Maksimal 20MB</p>
                    </>
                  )}
                  <input 
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept={newItem.type === 'image' ? "image/*" : "video/*"}
                    onChange={handleFileUpload}
                  />
                </div>

                <input 
                  className="bg-slate-800 border border-white/5 rounded-xl px-4 py-3 w-full text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50"
                  placeholder="Beri Judul Momen..."
                  value={newItem.title}
                  onChange={e => setNewItem({...newItem, title: e.target.value})}
                />

                <button 
                  onClick={addItem}
                  disabled={!newItem.url || isUploading}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 uppercase tracking-widest text-xs"
                >
                  Publish Sekarang
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
