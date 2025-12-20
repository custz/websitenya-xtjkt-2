
import React, { useState, useRef } from 'react';
import { ImageIcon, PlayCircle, X, Plus, Trash2, Video, Film, Upload } from 'lucide-react';
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
    updateData({ gallery: data.gallery.filter(g => g.id !== id) });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For large videos, base64 in localStorage is very heavy.
      // For images it's fine.
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem(prev => ({ ...prev, url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredMedia = data.gallery.filter(m => filter === 'all' || m.category === filter);

  return (
    <div className="min-h-screen pt-32 pb-40 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <div className="inline-flex p-4 rounded-3xl bg-purple-600/10 mb-6">
              <ImageIcon className="text-purple-500" size={32} />
            </div>
            <h1 className="text-5xl font-bold mb-4">Gallery Digital</h1>
            <p className="text-slate-400 text-lg">Dokumentasi visual perjalanan akademik dan non-akademik.</p>
          </div>

          <div className="flex items-center gap-4">
            {isEditMode && (
              <button 
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-600/20 hover:bg-purple-500 transition-all"
              >
                <Plus size={18} /> Upload Momen
              </button>
            )}
            <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
              {['all', 'gambar', 'video'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                    filter === cat ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMedia.map((item) => (
            <div key={item.id} className="relative group rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-slate-900/50">
              
              {isEditMode && (
                <button 
                  onClick={() => removeItem(item.id)}
                  className="absolute top-4 right-4 p-2 bg-red-600 text-white rounded-xl z-20 hover:scale-110 transition-transform shadow-lg"
                >
                  <Trash2 size={16} />
                </button>
              )}

              <div className="relative aspect-video overflow-hidden group">
                {item.type === 'image' ? (
                   <img 
                   src={item.url} 
                   alt={item.title} 
                   className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110" 
                 />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center relative">
                    <Film className="text-slate-600" size={48} />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-colors">
                      <button 
                        onClick={() => setSelectedVideo(item.url)}
                        className="p-4 bg-white/20 backdrop-blur-xl rounded-full text-white border border-white/30 hover:scale-110 transition-transform shadow-xl"
                      >
                        <PlayCircle size={40} />
                      </button>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-1 block">
                        Category: {item.category}
                      </span>
                      <h5 className="text-white font-bold text-lg">{item.title}</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Player Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/90 backdrop-blur-xl">
            <button onClick={() => setSelectedVideo(null)} className="absolute top-8 right-8 p-4 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all">
              <X size={24} />
            </button>
            <div className="w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black">
              <video src={selectedVideo} controls autoPlay className="w-full h-full" />
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <div className="bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Upload Momen Baru</h3>
                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-800 rounded-xl transition-all">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex bg-slate-800 p-1 rounded-2xl mb-4">
                  <button 
                    onClick={() => setNewItem({...newItem, type: 'image', category: 'gambar'})}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${newItem.type === 'image' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                  >
                    <Film size={18} /> Gambar
                  </button>
                  <button 
                    onClick={() => setNewItem({...newItem, type: 'video', category: 'video'})}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${newItem.type === 'video' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                  >
                    <Video size={18} /> Video
                  </button>
                </div>
                
                <div className="flex flex-col items-center p-8 border-2 border-dashed border-slate-700 rounded-2xl bg-slate-800/30 hover:bg-slate-800/50 transition-colors group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  {newItem.url ? (
                    <div className="w-full text-center">
                      {newItem.type === 'image' ? (
                        <img src={newItem.url} className="h-32 mx-auto rounded-lg object-contain" />
                      ) : (
                        <div className="flex flex-col items-center">
                          <Film size={40} className="text-blue-500 mb-2" />
                          <p className="text-xs text-slate-400 truncate w-full">File video terpilih</p>
                        </div>
                      )}
                      <p className="text-[10px] text-blue-400 font-bold mt-2 uppercase">Klik untuk ganti file</p>
                    </div>
                  ) : (
                    <>
                      <Upload size={32} className="text-slate-500 group-hover:text-blue-500 transition-colors mb-4" />
                      <p className="text-sm font-bold text-slate-300">Pilih dari Penyimpanan</p>
                      <p className="text-xs text-slate-500 mt-1">Sesuai format {newItem.type === 'image' ? 'gambar' : 'video'}</p>
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
                  className="bg-slate-800 border border-white/5 rounded-xl px-4 py-3 w-full text-white placeholder:text-slate-500"
                  placeholder="Judul Momen"
                  value={newItem.title}
                  onChange={e => setNewItem({...newItem, title: e.target.value})}
                />

                <button 
                  onClick={addItem}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold transition-all shadow-lg"
                >
                  Upload Sekarang
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
