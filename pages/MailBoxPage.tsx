
import React, { useState, useRef } from 'react';
import { 
  Heart, MessageSquare, Send, Trash2, ShieldCheck, User, 
  Sparkles, Inbox, CheckCircle2, Image, Video, Camera, 
  X, Reply, MoreVertical, Globe, Plus
} from 'lucide-react';
import { useStore } from '../services/store';
import { Post, Comment, Reply as ReplyType } from '../types';

const MailBoxPage: React.FC = () => {
  const { data, updateData, userRole, userProfile } = useStore();
  const [isPosting, setIsPosting] = useState(false);
  const [postType, setPostType] = useState<'text' | 'image' | 'video'>('text');
  const [caption, setCaption] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<{ postId: string, commentId: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaUrl(reader.result as string);
        setPostType(file.type.startsWith('video/') ? 'video' : 'image');
      };
      reader.readAsDataURL(file);
    }
  };

  const createPost = () => {
    if (!caption.trim() && !mediaUrl) return;
    
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
    setIsPosting(false);
    setCaption('');
    setMediaUrl('');
    setPostType('text');
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
            : [...post.likedBy, userProfile.name]
        };
      }
      return post;
    });
    updateData({ posts: updated });
  };

  const handleComment = (postId: string) => {
    if (!commentText.trim()) return;

    const updated = data.posts.map(post => {
      if (post.id === postId) {
        if (replyTo && replyTo.postId === postId) {
          // Add reply to specific comment
          const updatedComments = post.comments.map(comm => {
            if (comm.id === replyTo.commentId) {
              const newReply: ReplyType = {
                id: Date.now().toString(),
                userId: userProfile.name,
                userName: userProfile.name,
                userImage: userProfile.image,
                text: commentText,
                timestamp: "Baru saja"
              };
              return { ...comm, replies: [...comm.replies, newReply] };
            }
            return comm;
          });
          return { ...post, comments: updatedComments };
        } else {
          // Add main comment
          const newComment: Comment = {
            id: Date.now().toString(),
            userId: userProfile.name,
            userName: userProfile.name,
            userImage: userProfile.image,
            text: commentText,
            timestamp: "Baru saja",
            replies: []
          };
          return { ...post, comments: [...post.comments, newComment] };
        }
      }
      return post;
    });

    updateData({ posts: updated });
    setCommentText('');
    setReplyTo(null);
  };

  const deletePost = (id: string) => {
    if (window.confirm("Hapus status ini?")) {
      updateData({ posts: data.posts.filter(p => p.id !== id) });
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-40 px-4 md:px-8 bg-[#020205] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px]"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
          <div className="space-y-4">
             <div className="flex items-center gap-3 text-blue-500">
               <Globe size={24} className="animate-spin-slow" />
               <span className="mono text-[10px] font-black uppercase tracking-[0.5em]">TJKT Network Activity Hub</span>
             </div>
             <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic">
               Class <span className="text-stroke-blue">Feed</span>
             </h1>
          </div>
          
          {userRole === 'admin' && (
            <button 
              onClick={() => setIsPosting(true)}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-blue-600/20 hover:bg-blue-500 transition-all flex items-center gap-2"
            >
              <Plus size={16} /> Buat Status
            </button>
          )}
        </header>

        {/* Posting Form Modal */}
        {isPosting && (
          <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in">
             <div className="w-full max-w-lg glass-card rounded-[3rem] p-8 border-white/10 shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">New Broadcast</h3>
                  <button onClick={() => setIsPosting(false)} className="p-2 text-slate-500 hover:text-white"><X size={24} /></button>
                </div>

                <div className="space-y-6">
                  {/* Media Preview */}
                  {mediaUrl && (
                    <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10">
                       {postType === 'video' ? (
                         <video src={mediaUrl} className="w-full h-full object-cover" controls />
                       ) : (
                         <img src={mediaUrl} className="w-full h-full object-cover" alt="Preview" />
                       )}
                       <button 
                         onClick={() => setMediaUrl('')}
                         className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-red-600 transition-colors"
                       >
                         <X size={16} />
                       </button>
                    </div>
                  )}

                  <textarea 
                    className="w-full bg-slate-900/50 border border-white/5 rounded-3xl p-6 text-white font-medium focus:outline-none focus:border-blue-500/50 transition-all resize-none h-40 placeholder:text-slate-700"
                    placeholder="Apa yang ingin kamu broadcast ke jaringan?"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  />

                  <div className="flex gap-4">
                    <button 
                      onClick={() => { setPostType('image'); fileInputRef.current?.click(); }}
                      className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-widest"
                    >
                      <Image size={18} /> Foto
                    </button>
                    <button 
                      onClick={() => { setPostType('video'); fileInputRef.current?.click(); }}
                      className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-widest"
                    >
                      <Video size={18} /> Video
                    </button>
                  </div>

                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileUpload} />

                  <button 
                    onClick={createPost}
                    disabled={!caption.trim() && !mediaUrl}
                    className="w-full py-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-blue-600/30 transition-all"
                  >
                    Transmit Data
                  </button>
                </div>
             </div>
          </div>
        )}

        {/* Feed List */}
        <div className="space-y-12">
          {data.posts.length === 0 ? (
            <div className="py-40 text-center opacity-30 italic text-slate-500 text-sm uppercase tracking-widest">
              No signal found in this sector.
            </div>
          ) : data.posts.map((post) => (
            <article key={post.id} className="glass-card rounded-[3.5rem] border-white/5 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
               {/* Post Header */}
               <div className="p-8 md:p-10 flex items-center justify-between border-b border-white/5">
                  <div className="flex items-center gap-5">
                     <div className="relative">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-blue-500/30 glow-blue flex items-center justify-center bg-slate-800">
                          {post.authorImage ? (
                            <img src={post.authorImage} className="w-full h-full object-cover" alt="Author" />
                          ) : (
                            <User size={24} className="text-slate-600" />
                          )}
                        </div>
                        {post.isAdmin && (
                          <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full border-2 border-slate-950">
                            <ShieldCheck size={12} />
                          </div>
                        )}
                     </div>
                     <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black text-white tracking-tighter uppercase">{post.authorName}</span>
                          {post.isAdmin && (
                            <span className="px-1.5 py-0.5 bg-blue-600/10 text-blue-500 text-[7px] font-black border border-blue-500/20 rounded uppercase tracking-widest">ADMIN</span>
                          )}
                        </div>
                        <span className="mono text-[8px] font-bold text-slate-500 uppercase tracking-widest">{post.timestamp}</span>
                     </div>
                  </div>
                  {userRole === 'admin' && (
                    <button onClick={() => deletePost(post.id)} className="p-3 text-slate-600 hover:text-red-500 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  )}
               </div>

               {/* Post Media */}
               {post.contentUrl && (
                 <div className="border-b border-white/5">
                    {post.type === 'video' ? (
                      <video src={post.contentUrl} className="w-full h-auto max-h-[600px] object-contain bg-black" controls />
                    ) : (
                      <img src={post.contentUrl} className="w-full h-auto max-h-[600px] object-contain bg-black/20" alt="Content" />
                    )}
                 </div>
               )}

               {/* Post Caption */}
               <div className="p-8 md:p-12 space-y-8">
                  {post.caption && (
                    <p className="text-xl text-slate-300 font-medium leading-relaxed italic border-l-4 border-blue-600/20 pl-8">
                      "{post.caption}"
                    </p>
                  )}

                  {/* Interactions Bar */}
                  <div className="flex items-center gap-8 border-t border-white/5 pt-8">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-3 transition-all active:scale-90 ${post.likedBy.includes(userProfile.name) ? 'text-pink-500' : 'text-slate-500 hover:text-pink-400'}`}
                    >
                      <div className={`p-3 rounded-2xl ${post.likedBy.includes(userProfile.name) ? 'bg-pink-500/10 glow-blue border-pink-500/30' : 'bg-white/5 border-white/5'} border`}>
                        <Heart size={20} fill={post.likedBy.includes(userProfile.name) ? "currentColor" : "none"} />
                      </div>
                      <span className="mono text-[10px] font-black uppercase">{post.likes} <span className="hidden sm:inline">Likes</span></span>
                    </button>

                    <button 
                      onClick={() => setActiveCommentPost(activeCommentPost === post.id ? null : post.id)}
                      className={`flex items-center gap-3 transition-all ${activeCommentPost === post.id ? 'text-blue-500' : 'text-slate-500 hover:text-blue-400'}`}
                    >
                      <div className={`p-3 rounded-2xl ${activeCommentPost === post.id ? 'bg-blue-500/10 glow-blue border-blue-500/30' : 'bg-white/5 border-white/5'} border`}>
                        <MessageSquare size={20} />
                      </div>
                      <span className="mono text-[10px] font-black uppercase">{post.comments.length} <span className="hidden sm:inline">Comments</span></span>
                    </button>
                  </div>

                  {/* Comments Section */}
                  {activeCommentPost === post.id && (
                    <div className="space-y-8 animate-in slide-in-from-top-4">
                      {/* Comment Form */}
                      <div className="flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-white/10">
                          {userProfile.image ? <img src={userProfile.image} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-800 flex items-center justify-center"><User size={16} /></div>}
                        </div>
                        <div className="flex-1 relative">
                          {replyTo && (
                            <div className="mb-2 flex items-center justify-between bg-blue-600/10 p-2 rounded-lg border border-blue-500/20">
                              <span className="text-[9px] font-black uppercase text-blue-500 tracking-widest">Membalas {replyTo.commentId.substring(0,4)}...</span>
                              <button onClick={() => setReplyTo(null)} className="text-slate-500 hover:text-white"><X size={12} /></button>
                            </div>
                          )}
                          <input 
                            className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-blue-500/30 placeholder:text-slate-800"
                            placeholder="Tulis pendapat kamu..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)}
                          />
                          <button 
                            onClick={() => handleComment(post.id)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-400 transition-colors"
                          >
                            <Send size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Comments List */}
                      <div className="space-y-6 pt-4">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="space-y-4">
                            <div className="flex gap-4 items-start group">
                              <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-white/5">
                                {comment.userImage ? <img src={comment.userImage} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-800 flex items-center justify-center"><User size={16} /></div>}
                              </div>
                              <div className="flex-1 bg-white/5 rounded-[1.5rem] p-5 border border-white/5">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-[10px] font-black text-white uppercase tracking-tight">{comment.userName}</span>
                                  <span className="mono text-[8px] text-slate-700 font-bold uppercase">{comment.timestamp}</span>
                                </div>
                                <p className="text-xs text-slate-400 font-medium leading-relaxed">{comment.text}</p>
                                <button 
                                  onClick={() => { setReplyTo({ postId: post.id, commentId: comment.id }); setCommentText(''); }}
                                  className="mt-3 flex items-center gap-2 text-[8px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors"
                                >
                                  <Reply size={10} /> Balas
                                </button>
                              </div>
                            </div>

                            {/* Replies */}
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex gap-4 items-start pl-12 md:pl-14">
                                <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-white/5">
                                  {reply.userImage ? <img src={reply.userImage} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-800 flex items-center justify-center"><User size={12} /></div>}
                                </div>
                                <div className="flex-1 bg-blue-600/5 rounded-[1.2rem] p-4 border border-blue-500/10">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-[9px] font-black text-white uppercase tracking-tight">{reply.userName}</span>
                                    <span className="mono text-[7px] text-slate-700 font-bold uppercase">{reply.timestamp}</span>
                                  </div>
                                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{reply.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
               </div>
            </article>
          ))}
        </div>

        {/* Footer Protocol */}
        <div className="mt-20 flex flex-col items-center gap-6 opacity-30">
          <div className="w-12 h-1px bg-slate-800"></div>
          <p className="mono text-[8px] text-slate-600 font-black uppercase tracking-[0.5em]">Class Ledger v2.5 Synchronized</p>
        </div>
      </div>
    </div>
  );
};

export default MailBoxPage;
