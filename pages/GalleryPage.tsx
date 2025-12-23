
import React, { useState, useRef, useEffect } from 'react';
import { ImageIcon, PlayCircle, X, Plus, Trash2, Video, Film, Upload, Loader2, AlertTriangle, Zap, Cloud, CheckCircle } from 'lucide-react';
import { useStore } from '../services/store';
import { GalleryItem } from '../types';
import { CardSkeleton } from '../components/Skeleton';
import { uploadFileToCloud } from '../services/uploadService';

const GalleryPage: React.FC = () => {
  const { data, updateData, isEditMode } = useStore();
  const [filter, setFilter] = useState('all');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);
  const [newItem, setNewItem] = useState<Partial<GalleryItem>>({
    type: 'image', url: '', title: '', category: 'gambar', thumbnail: ''
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

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
        const dataUrl = canvas.toDataURL('image/jpeg', 0.5); // Low quality for fast thumb
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

    setUploadStatus('uploading');
    setUploadProgress(10); // Start progress

    try {
      // Simulasi progress untuk file besar
      const progressTimer = setInterval(() => {
        setUploadProgress(prev => (prev < 90 ? prev + 5 : prev));
      }, 500);

      const uploadResult = await uploadFileToCloud(file);
      clearInterval(progressTimer);
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error);
      }

      setUploadProgress(95);

      let thumb = '';
      if (file.type.startsWith('video/')) {
        thumb = await generateVideoThumbnail(file);
      }

      setNewItem(prev => ({ 
        ...prev, 
        url: uploadResult.url, 
        thumbnail: thumb,
        type: file.type.startsWith('video/') ? 'video' : 'image',
        category: file.type.startsWith('video/') ? 'video' : 'gambar'
      }));

      setUploadProgress(100);
      setUploadStatus('success');
      setTimeout(() => setUploadStatus('idle'), 2000);

    } catch (err: any) {
      setUploadStatus('error');
      alert("Gagal memproses file: " + err.message);
    }
  };

  const addItem = () => {
    if (!newItem.url || !newItem.title?.trim()) return;
    
    const item: GalleryItem = {
      id: Date.now().toString(),
      type: newItem.type as 'image' | 'video',
      url: newItem.url!,
      thumbnail: newItem.thumbnail,
      title: newItem.title!.trim(),
      category: newItem.category || (newItem.type === 'video' ? 'video' : 'gambar')
    };

    updateData({ gallery: [item, ...data.gallery] });
    setIsAdding(false);
    setNewItem({ type: 'image', url: '', title: '', category: 'gambar', thumbnail: '' });
  };

  const filteredMedia = data.gallery.filter(m => filter === 'all' || m.category === filter);

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-40 px-4 sm:px-6 lg:px-8 bg-[#020617]">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div className="animate-in fade-in slide-in-from-left-6 duration-700 flex-1">
            <div className="inline-flex p-3 rounded-2xl bg-blue-600/10 mb-4 border border-blue-500/20">
              <Cloud className="text-blue-500" size={24} />
            </div>
            {isEditMode ? (
              <div className="space-y-4">
                <input 
                  className="bg-transparent border-b border-white/10 text-4xl md:text-5xl font-black tracking-tight text-white focus:outline-none w-full uppercase"
                  value={data.galleryTitle}
                  onChange={(e) => updateData({ galleryTitle: e.target.value })}
                />
              </div>
            ) : (
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2 uppercase">
                {data.galleryTitle}
              </h1>
            )}
            <p className="text-slate-400 text-sm md:text-base max-w-md font-medium">
              Data tersimpan di <span className="text-blue-400">Vercel Edge Network</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            {isEditMode && (
              <button 
                onClick={() => setIsAdding(true)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black shadow-xl uppercase tracking-[0.2em] transition-all"
              >
                <Plus size={18} /> Upload Momen
              </button>
            )}
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {pageLoading ? (
            Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />)
          ) : (
            filteredMedia.map((item, index) => (
              <div key={item.id} className="group relative rounded-[2.5rem] overflow-hidden border border-white/5 bg-slate-900/30 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
                {isEditMode && (
                  <button onClick={() => updateData({ gallery: data.gallery.filter(g => g.id !== item.id) })} className="absolute top-5 right-5 p-3 bg-red-600/90 text-white rounded-2xl z-20"><Trash2 size={16} /></button>
                )}
                <div className="relative aspect-[4/3] overflow-hidden cursor-pointer" onClick={() => item.type === 'video' ? setSelectedVideo(item.url) : null}>
                  {item.type === 'image' ? (
                    <img src={item.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  ) : (
                    <div className="w-full h-full relative">
                      <img src={item.thumbnail || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=600'} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PlayCircle size={60} className="text-white drop-shadow-2xl" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-8 flex flex-col justify-end">
                    <h5 className="text-white font-black text-xl uppercase tracking-tighter">{item.title}</h5>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Video Player Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 z-[500] bg-black flex items-center justify-center p-4">
            <button onClick={() => setSelectedVideo(null)} className="absolute top-8 right-8 text-white p-4"><X size={40} /></button>
            <video src={selectedVideo} controls autoPlay className="max-w-full max-h-full rounded-2xl shadow-2xl" />
          </div>
        )}

        {/* Upload Modal */}
        {isAdding && (
          <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in">
            <div className="bg-slate-900 border border-white/10 p-10 rounded-[3.5rem] w-full max-w-lg shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">New Cloud Media</h3>
                <button onClick={() => setIsAdding(false)}><X size={24} className="text-slate-500" /></button>
              </div>

              <div className="space-y-8">
                <div 
                  className={`relative flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-800 rounded-[2.5rem] bg-slate-950/50 hover:border-blue-500 transition-all cursor-pointer ${uploadStatus === 'uploading' ? 'pointer-events-none opacity-50' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploadStatus === 'uploading' ? (
                    <div className="text-center space-y-4">
                      <Loader2 size={48} className="text-blue-500 animate-spin mx-auto" />
                      <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                      <p className="mono text-[10px] text-blue-400 font-bold uppercase tracking-widest">{uploadProgress}% Sending to Vercel...</p>
                    </div>
                  ) : newItem.url ? (
                    <div className="text-center">
                      <CheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />
                      <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Media Ready!</p>
                    </div>
                  ) : (
                    <>
                      <Upload size={40} className="text-slate-700 mb-4" />
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Pilih file video / gambar<br/><span className="text-[10px] text-blue-500/50">Vercel Blob Storage Active</span></p>
                    </>
                  )}
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileUpload} />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Judul Media</label>
                  <input className="w-full bg-slate-800 border border-white/5 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-blue-500" placeholder="Dokumentasi Kelas X..." value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} />
                </div>

                <button 
                  onClick={addItem}
                  disabled={!newItem.url || uploadStatus === 'uploading'}
                  className="w-full py-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-600/30 transition-all"
                >
                  Publish to Global Node
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
