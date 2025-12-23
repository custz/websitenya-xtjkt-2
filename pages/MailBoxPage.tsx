
import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, MessageSquare, Send, Trash2, ShieldCheck, User, 
  Sparkles, Globe, Plus, X, Reply, Image, Video, Loader2, Share2, Check, Shield, Star, Zap
} from 'lucide-react';
import { useStore } from '../services/store';
import { Post, Comment, Reply as ReplyType } from '../types';
import { PostSkeleton } from '../components/Skeleton';
import { uploadFileToCloud } from '../services/uploadService';

const MailBoxPage: React.FC = () => {
  const { data, updateData, userRole, userProfile } = useStore();
  const [isPosting, setIsPosting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [isCommenting, setIsCommenting] = useState<string | null>(null); // Store postId being commented on
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Store postId being deleted
  const [pageLoading, setPageLoading] = useState(true);
  const [postType, setPostType] = useState<'text' | 'image' | 'video'>('text');
  const [caption, setCaption] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Simulasi pengambilan data awal dari "server"
    const timer = setTimeout(() => setPageLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      try {
        const result = await uploadFileToCloud(file);
        if (result.success) {
          setMediaUrl(result.url);
          setPostType(file.type.startsWith('video/') ? 'video' : 'image');
        } else {
          alert("Gagal upload: " + result.error);
        }
      } catch (err) {
        alert("Terjadi kesalahan saat menghubungi server.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const createPost = async () => {
    if (!caption.trim() && !mediaUrl) return;
    
    setIsSubmittingPost(true);
    // Simulasi delay pengiriman ke cloud
    await new Promise(resolve => setTimeout(resolve, 1200));

    const newPost: Post = {
      id: Date.now().toString(),
      authorName: data.adminProfile.name,
      authorImage: data.adminProfile.image,
      authorRole: data.adminProfile.role,
      type: postType,
      contentUrl: mediaUrl,
      caption: caption,
      timestamp: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
      likes: 0,
      likedBy: [],
      comments: [],
      isAdmin: true
    };

    updateData({ posts: [newPost, ...data.posts] });
    setIsSubmittingPost(false);
    setIsPosting(false);
    setCaption('');
    setMediaUrl('');
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLike = (postId: string) => {
    const updated = data.posts.map(post => {
      if (post.id === postId) {
        const hasLiked = post.likedBy.includes(userProfile.name);
        return {
          ...post,
          likes: hasLiked ? post.likes - 1 : post.likes + 1,
          likedBy: hasLiked 
            ? post.likedBy.filter(n => n !== userProfile.name) 
            : [...(userProfile.name ? [userProfile.name] : []), ...post.likedBy]
        };
      }
      return post;
    });
    updateData({ posts: updated });
  };

  const handleComment = async (postId: string) => {
    if (!commentText.trim()) return;
    
    setIsCommenting(postId);
    // Simulasi sinkronisasi komentar ke cloud
    await new Promise(resolve => setTimeout(resolve, 800));

    const updated = data.posts.map(post => {
      if (post.id === postId) {
        const newComment: Comment = {
          id: Date.now().toString(),
          userId: userProfile.name,
          userName: userProfile.name,
          userImage: userProfile.image,
          text: commentText,
          timestamp: "Baru aja",
          replies: []
        };
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    });

    updateData({ posts: updated });
    setIsCommenting(null);
    setCommentText('');
  };

  const handleDeletePost = async (postId: string) => {
    if(!window.confirm("Hapus postingan ini secara permanen?")) return;
    
    setIsDeleting(postId);
    // Simulasi request delete ke server
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    updateData({ posts: data.posts.filter(p => p.id !== postId) });
    setIsDeleting(null);
  };

  return (
    <div className="min-h-screen pt-32 pb-40 px-4 md:px-8 bg-[#020205] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px]"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
          <div className="space-y-4">
             <div className="flex items-center gap-3 text-blue-500">
               <Globe size={24} className="animate-spin-slow" />
               <span className="mono text-[10px] font-black uppercase tracking-[0.5em]">TJKT Network Activity Hub</span>
             </div>
             <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic">
               Cerita <span className="text-stroke-blue">Kelas</span>
             </h1>
          </div>
          {userRole === 'admin' && (
            <button onClick={() => setIsPosting(true)} className="px-8 py-5 bg-blue-600 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-2 transition-all hover:bg-blue-500 hover:scale-105 active:scale-95"><Plus size={18} /> Update Status</button>
          )}
        </header>

        {isPosting && (
          <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in">
             <div className="w-full max-w-lg glass-card rounded-[3.5rem] p-8 border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl pointer-events-none"></div>
                
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <Shield size={20} className="text-blue-500" />
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Admin Update</h3>
                  </div>
                  <button onClick={() => !isSubmittingPost && setIsPosting(false)} className="p-2 text-slate-500 hover:text-white transition-colors disabled:opacity-50" disabled={isSubmittingPost}><X size={24} /></button>
                </div>

                <div className="space-y-6">
                  {/* Posting Header Preview */}
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center overflow-hidden border border-blue-500/50">
                        {data.adminProfile.image ? <img src={data.adminProfile.image} className="w-full h-full object-cover" /> : <User size={20} className="text-white" />}
                     </div>
                     <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                           <span className="text-xs font-black text-white uppercase">{data.adminProfile.name}</span>
                           <ShieldCheck size={12} className="text-blue-500" />
                        </div>
                        <span className="mono text-[8px] text-slate-500 font-bold uppercase tracking-widest">{data.adminProfile.role}</span>
                     </div>
                  </div>

                  {mediaUrl && !isProcessing && (
                    <div className="relative aspect-video rounded-[2rem] overflow-hidden border border-white/10 bg-black group">
                       {postType === 'video' ? <video src={mediaUrl} className="w-full h-full object-contain" controls /> : <img src={mediaUrl} className="w-full h-full object-cover" />}
                       {!isSubmittingPost && (
                         <button onClick={() => setMediaUrl('')} className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={16} /></button>
                       )}
                    </div>
                  )}

                  {isProcessing && (
                    <div className="flex flex-col items-center justify-center py-12 bg-blue-600/5 rounded-[2rem] border border-blue-500/20">
                      <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
                      <p className="mono text-[10px] text-blue-500 font-bold uppercase tracking-widest">Memproses File Ke Cloud...</p>
                    </div>
                  )}

                  {!mediaUrl && !isProcessing && (
                    <button 
                      onClick={() => fileInputRef.current?.click()} 
                      className="w-full py-12 border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center gap-4 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
                    >
                      <div className="p-4 bg-slate-900 rounded-2xl group-hover:scale-110 transition-transform shadow-xl">
                        <Video className="text-slate-500 group-hover:text-blue-500" size={32} />
                      </div>
                      <span className="mono text-[10px] text-slate-500 font-bold uppercase tracking-widest">Sematkan Foto / Video Momen</span>
                    </button>
                  )}

                  <textarea 
                    className="w-full bg-slate-900/50 border border-white/5 rounded-[2rem] p-6 text-white outline-none focus:border-blue-500/50 h-32 resize-none text-sm placeholder:text-slate-700 font-medium disabled:opacity-50" 
                    placeholder="Apa yang lagi asik di kelas hari ini?" 
                    value={caption} 
                    onChange={(e) => setCaption(e.target.value)} 
                    disabled={isSubmittingPost}
                  />
                  
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileUpload} />
                  
                  <button 
                    onClick={createPost} 
                    disabled={(!caption.trim() && !mediaUrl) || isProcessing || isSubmittingPost} 
                    className="w-full py-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] transition-all shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-2"
                  >
                    {isSubmittingPost ? (
                      <>
                        <Loader2 className="animate-spin" size={16} /> Menyebarkan Postingan...
                      </>
                    ) : (
                      <>
                        <Send size={16} /> Posting Sekarang
                      </>
                    )}
                  </button>
                </div>
             </div>
          </div>
        )}

        <div className="space-y-16">
          {pageLoading ? (
            Array(3).fill(0).map((_, i) => <PostSkeleton key={i} />)
          ) : data.posts.length === 0 ? (
            <div className="text-center py-48 glass-card rounded-[3.5rem] border-white/5 flex flex-col items-center">
               <div className="p-8 rounded-full bg-white/5 mb-8">
                  <Zap size={48} className="text-slate-800 animate-pulse" />
               </div>
               <p className="mono text-[10px] text-slate-600 font-black uppercase tracking-[0.5em] italic">Jaringan_Sunyi_Senyap_Tanpa_Update</p>
            </div>
          ) : (
            data.posts.map((post) => (
              <article key={post.id} className={`glass-card rounded-[4rem] border-white/5 overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-700 shadow-2xl relative ${post.isAdmin ? 'ring-1 ring-blue-500/10' : ''}`}>
                 
                 {/* Delete Loading Overlay */}
                 {isDeleting === post.id && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center space-y-4 animate-in fade-in">
                       <Loader2 className="animate-spin text-red-500" size={48} />
                       <span className="mono text-[10px] text-white font-black uppercase tracking-widest">Menghapus Postingan...</span>
                    </div>
                 )}

                 {/* Post Header with Elite Styling for Admins */}
                 <div className={`p-8 flex items-center justify-between border-b border-white/5 ${post.isAdmin ? 'bg-gradient-to-r from-blue-600/5 to-transparent' : ''}`}>
                    <div className="flex items-center gap-5">
                       <div className={`w-14 h-14 rounded-2xl overflow-hidden border transition-all duration-500 flex items-center justify-center bg-slate-900 p-1 ${post.isAdmin ? 'border-blue-500/50 glow-blue scale-105' : 'border-white/10'}`}>
                          {post.authorImage ? <img src={post.authorImage} className="w-full h-full object-cover rounded-[1.2rem]" /> : <User size={24} className="text-slate-700" />}
                       </div>
                       <div className="flex flex-col">
                          <div className="flex items-center gap-2.5">
                             <span className="text-xl font-black text-white tracking-tighter uppercase">{post.authorName}</span>
                             {post.isAdmin && (
                               <div className="group relative">
                                  <ShieldCheck size={18} className="text-blue-500 animate-pulse" />
                                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Verified Admin</div>
                               </div>
                             )}
                          </div>
                          <div className="flex items-center gap-3">
                             <span className={`mono text-[8px] font-black uppercase tracking-widest ${post.isAdmin ? 'text-blue-400' : 'text-slate-500'}`}>{post.isAdmin ? 'Admin_System' : 'Warga_Node'}</span>
                             <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                             <span className="mono text-[8px] font-bold text-slate-600 uppercase tracking-tighter">{post.timestamp}</span>
                          </div>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {post.contentUrl && (
                        <button 
                          onClick={() => copyToClipboard(post.contentUrl!, post.id)} 
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${copiedId === post.id ? 'bg-emerald-600/20 text-emerald-500' : 'text-slate-600 hover:text-white hover:bg-white/5 border border-white/5'}`}
                        >
                          {copiedId === post.id ? <Check size={20} /> : <Share2 size={20} />}
                        </button>
                      )}
                      {userRole === 'admin' && (
                        <button 
                          onClick={() => handleDeletePost(post.id)} 
                          disabled={isDeleting === post.id}
                          className="w-12 h-12 rounded-2xl border border-white/5 flex items-center justify-center text-slate-600 hover:text-red-500 hover:bg-red-500/5 transition-all disabled:opacity-30"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                 </div>

                 {/* Media Content */}
                 {post.contentUrl && (
                   <div className="bg-black/40 group relative">
                      {post.type === 'video' ? <video src={post.contentUrl} className="w-full max-h-[600px] object-contain" controls /> : <img src={post.contentUrl} className="w-full max-h-[600px] object-contain group-hover:scale-[1.02] transition-transform duration-1000" />}
                      
                      <div className="absolute top-6 left-6 flex gap-3 pointer-events-none">
                        <div className="px-4 py-1.5 glass-card border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-white backdrop-blur-md flex items-center gap-2 shadow-2xl">
                           <Star size={12} className="text-yellow-500 fill-current" />
                           Elite Momen
                        </div>
                      </div>
                   </div>
                 )}

                 {/* Caption & Interaction */}
                 <div className="p-10 space-y-10">
                    <div className="relative">
                       {post.isAdmin && <div className="absolute -left-6 top-0 bottom-0 w-1.5 bg-blue-600/30 rounded-full"></div>}
                       <p className={`text-xl md:text-2xl font-medium leading-relaxed italic ${post.isAdmin ? 'text-slate-200' : 'text-slate-400'}`}>
                         "{post.caption}"
                       </p>
                    </div>

                    <div className="flex items-center gap-10 border-t border-white/5 pt-10">
                      <button onClick={() => handleLike(post.id)} className={`flex items-center gap-3 transition-colors ${post.likedBy.includes(userProfile.name) ? 'text-pink-500' : 'text-slate-500 hover:text-white'}`}>
                        <div className={`p-3 rounded-2xl ${post.likedBy.includes(userProfile.name) ? 'bg-pink-500/10' : 'bg-white/5'} transition-all`}>
                           <Heart size={22} fill={post.likedBy.includes(userProfile.name) ? "currentColor" : "none"} />
                        </div>
                        <span className="mono text-xs font-black tracking-widest">{post.likes}</span>
                      </button>

                      <button onClick={() => setActiveCommentPost(activeCommentPost === post.id ? null : post.id)} className={`flex items-center gap-3 transition-colors ${activeCommentPost === post.id ? 'text-blue-500' : 'text-slate-500 hover:text-white'}`}>
                        <div className={`p-3 rounded-2xl ${activeCommentPost === post.id ? 'bg-blue-500/10' : 'bg-white/5'} transition-all`}>
                           <MessageSquare size={22} />
                        </div>
                        <span className="mono text-xs font-black tracking-widest">{post.comments.length}</span>
                      </button>
                    </div>

                    {/* Comment Section */}
                    {activeCommentPost === post.id && (
                      <div className="space-y-8 pt-4 animate-in slide-in-from-top-4 duration-500">
                        <div className="flex gap-4 group">
                           <div className="flex-1 relative">
                              <input 
                                className="w-full bg-slate-950 border border-white/10 rounded-[1.5rem] pl-14 pr-6 py-5 text-sm text-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-700 disabled:opacity-50" 
                                placeholder={isCommenting === post.id ? "Menunggu sinkronisasi..." : "Tulis komentar asik kamu..."} 
                                value={commentText} 
                                onChange={(e) => setCommentText(e.target.value)} 
                                onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)} 
                                disabled={isCommenting === post.id}
                              />
                              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-blue-500 transition-colors">
                                 {isCommenting === post.id ? <Loader2 size={18} className="animate-spin text-blue-500" /> : <MessageSquare size={18} />}
                              </div>
                           </div>
                           <button 
                             onClick={() => handleComment(post.id)} 
                             disabled={!commentText.trim() || isCommenting === post.id}
                             className="w-16 h-16 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                           >
                              {isCommenting === post.id ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
                           </button>
                        </div>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                          {post.comments.length === 0 ? (
                            <p className="text-center py-10 text-[9px] text-slate-700 font-black uppercase tracking-[0.4em]">Belum ada obrolan di sini</p>
                          ) : (
                            post.comments.map(c => (
                              <div key={c.id} className="flex gap-5 items-start animate-in fade-in slide-in-from-left-4">
                                <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-slate-900 flex items-center justify-center">
                                  {c.userImage ? <img src={c.userImage} className="w-full h-full object-cover" /> : <User size={16} className="text-slate-700" />}
                                </div>
                                <div className="bg-white/5 p-5 rounded-[2rem] flex-1 border border-white/5 relative overflow-hidden group/comment">
                                   <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 blur-2xl opacity-0 group-hover/comment:opacity-100 transition-opacity"></div>
                                   <div className="flex justify-between items-center mb-2">
                                      <span className="text-[10px] font-black text-white uppercase tracking-tight">{c.userName}</span>
                                      <span className="mono text-[7px] text-slate-600 font-bold uppercase">{c.timestamp}</span>
                                   </div>
                                   <p className="text-sm text-slate-400 font-medium leading-relaxed">{c.text}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                 </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MailBoxPage;
