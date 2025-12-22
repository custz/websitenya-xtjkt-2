
import React, { useState, useRef, useEffect } from 'react';
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

  const generateVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;

      video.onloadedmetadata = () => {
        video.currentTime = 0.5;
      };

      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        URL.revokeObjectURL(url);
        resolve(dataUrl);
      };

      video.onerror = () => {
        URL.revokeObjectURL(url);
        resolve('https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=600');
      };

      video.src = url;
      video.load();
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert("Ukuran file terlalu besar! Maksimal 8MB untuk performa optimal.");
      return;
    }

    setIsUploading(true);
    try {
      let thumb = '';
      if (file.type.startsWith('video/')) {
        thumb = await generateVideoThumbnail(file);
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
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
      alert("Harap lengkapi judul dan file!");
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div className="animate-in fade-in slide-in-from-left-6 duration-700 flex-1">
            <div className="inline-flex p-3 rounded-2xl bg-blue-600/10 mb-4 border border-blue-500/20">
              <ImageIcon className="text-blue-500" size={24} />
            </div>
            {isEditMode ? (
              <div className="space-y-4">
                <input 
                  className="bg-transparent border-b border-white/10 text-4xl md:text-5xl font-black tracking-tight text-white focus:outline-none w-full uppercase"
                  value={data.galleryTitle}
                  onChange={(e) => updateData({ galleryTitle: e.target.value })}
                />
                <textarea 
                  className="bg-transparent border border-white/10 rounded-xl p-4 text-slate-400 text-sm md:text-base w-full h-24 focus:outline-none"
                  value={data.galleryDescription}
                  onChange={(e) => updateData({ galleryDescription: e.target.value })}
                />
              </div>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2 uppercase">
                  {data.galleryTitle.split(' ').map((word, i, arr) => (
                    <span key={i}>
                      {i === arr.length - 1 ? <span className="text-blue-500 italic">{word}</span> : word + ' '}
                    </span>
                  ))}
                </h1>
                <p className="text-slate-400 text-sm md:text-base max-w-md font-medium">
                  {data.galleryDescription}
                </p>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto animate-in fade-in slide-in-from-right-6 duration-700">
            {isEditMode && (
              <button 
                onClick={() => setIsAdding(true)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black shadow-xl shadow-blue-600/20 transition-all active:scale-95 uppercase tracking-widest"
              >
                <Plus size={18} /> Upload Momen
              </button>
            )}
            <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl w-full md:w-auto">
              {['all', 'gambar', 'video'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                    filter === cat ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMedia.map((item, index) => (
            <div 
              key={item.id} 
              className="group relative rounded-[2.5rem] overflow-hidden border border-white/5 bg-slate-900/30 flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-500 h-full"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {isEditMode && (
                <button 
                  onClick={() => updateData({ gallery: data.gallery.filter(g => g.id !== item.id) })}
                  className="absolute top-5 right-5 p-3 bg-red-600/90 backdrop-blur-md text-white rounded-2xl z-20 hover:bg-red-500 transition-all shadow-xl active:scale-90"
                >
                  <Trash2 size={16} />
                </button>
              )}

              <div className="relative aspect-[4/3] overflow-hidden cursor-pointer bg-slate-950" onClick={() => item.type === 'video' ? setSelectedVideo(item.url) : null}>
                {item.type === 'image' ? (
                  <img 
                    src={item.url} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" 
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full relative">
                    <img 
                      src={item.thumbnail || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=600'} 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="p-5 bg-blue-600 text-white rounded-full shadow-2xl transform transition-transform group-hover:scale-110 group-hover:bg-blue-500">
                        <PlayCircle size={40} />
                      </div>
                    </div>
                    <div className="absolute top-5 left-5 px-3 py-1 bg-blue-600 text-white text-[9px] font-black uppercase rounded-lg tracking-[0.2em] shadow-lg">
                      Video
                    </div>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-2 block">
                    {item.category}
                  </span>
                  <h5 className="text-white font-black text-xl leading-tight">{item.title}</h5>
                </div>
              </div>
            </div>
          ))}

          {filteredMedia.length === 0 && (
            <div className="col-span-full py-40 text-center border-2 border-dashed border-white/5 rounded-[3.5rem] bg-slate-900/10">
              <Film className="mx-auto text-slate-800 mb-8" size={80} strokeWidth={1} />
              <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-sm">Belum ada koleksi di kategori ini.</p>
            </div>
          )}
        </div>

        {selectedVideo && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-12 bg-black/98 backdrop-blur-3xl animate-in fade-in duration-500">
            <button 
              onClick={() => setSelectedVideo(null)} 
              className="absolute top-8 right-8 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all z-[210] active:scale-90 border border-white/10"
            >
              <X size={32} />
            </button>
            <div className="w-full max-w-6xl aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 bg-black animate-in zoom-in-95 duration-500">
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

        {isAdding && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-white/10 p-8 md:p-12 rounded-[3.5rem] w-full max-w-lg shadow-2xl my-auto animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black tracking-tight uppercase">Upload Momen</h3>
                <button onClick={() => setIsAdding(false)} className="p-3 hover:bg-slate-800 rounded-2xl transition-all">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-8">
                <div 
                  className={`relative flex flex-col items-center justify-center p-10 md:p-16 border-2 border-dashed border-slate-800 rounded-[2.5rem] bg-slate-950/50 hover:bg-slate-900 hover:border-blue-500/50 transition-all cursor-pointer group ${isUploading ? 'pointer-events-none' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading ? (
                    <div className="text-center">
                      <Loader2 size={48} className="text-blue-500 animate-spin mx-auto mb-6" />
                      <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Memproses Node...</p>
                    </div>
                  ) : newItem.url ? (
                    <div className="w-full text-center">
                      <div className="relative h-40 w-full max-w-[240px] mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                        <img src={newItem.type === 'video' ? newItem.thumbnail : newItem.url} className="w-full h-full object-cover" />
                        {newItem.type === 'video' && <PlayCircle className="absolute inset-0 m-auto text-white opacity-80" size={48} />}
                      </div>
                      <p className="text-[10px] text-blue-400 font-black mt-6 uppercase tracking-[0.3em]">Klik untuk mengganti</p>
                    </div>
                  ) : (
                    <>
                      <div className="p-5 bg-slate-900 rounded-3xl mb-6 text-slate-700 group-hover:text-blue-500 transition-all group-hover:scale-110 shadow-inner">
                        <Upload size={40} />
                      </div>
                      <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Pilih Media</p>
                      <p className="text-[10px] text-slate-600 mt-3 uppercase tracking-[0.2em] font-bold">Maksimal 8MB</p>
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

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1">Nama Konten</label>
                  <input 
                    className="w-full bg-slate-800 border border-white/5 rounded-2xl px-6 py-5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600 font-bold"
                    placeholder="Contoh: Dokumentasi Server Rack"
                    value={newItem.title}
                    onChange={e => setNewItem({...newItem, title: e.target.value})}
                    maxLength={50}
                  />
                </div>

                <div className="p-5 bg-blue-600/5 border border-blue-600/10 rounded-3xl flex gap-4">
                   <AlertTriangle className="text-blue-500 shrink-0" size={24} />
                   <p className="text-[10px] text-blue-300/60 font-black leading-relaxed uppercase tracking-wider">
                     Media akan disimpan secara lokal di browser. Pastikan untuk melakukan backup manual di Settings jika data penting.
                   </p>
                </div>

                <button 
                  onClick={addItem}
                  disabled={!newItem.url || isUploading || !newItem.title?.trim()}
                  className="w-full py-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-3xl font-black transition-all shadow-2xl shadow-blue-600/30 uppercase tracking-[0.3em] text-xs"
                >
                  Publish ke Jaringan
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
