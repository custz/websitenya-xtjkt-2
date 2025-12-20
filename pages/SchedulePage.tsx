
import React, { useState } from 'react';
import { Calendar, Clock, BookOpen, User, Hash, Plus, Trash2, Layers, Briefcase } from 'lucide-react';
import { useStore } from '../services/store';
import { Lesson } from '../types';

const SchedulePage: React.FC = () => {
  const { data, updateData, isEditMode } = useStore();
  const [activeDay, setActiveDay] = useState("Senin");

  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

  const updateLesson = (day: string, id: string, updates: Partial<Lesson>) => {
    const updatedDay = data.schedule[day].map(l => l.id === id ? { ...l, ...updates } : l);
    updateData({ schedule: { ...data.schedule, [day]: updatedDay } });
  };

  const addLesson = (day: string, type: 'umum' | 'produktif') => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      time: "00:00 - 00:00",
      subject: "Pelajaran Baru",
      teacher: "Nama Guru",
      type
    };
    updateData({ schedule: { ...data.schedule, [day]: [...data.schedule[day], newLesson] } });
  };

  const removeLesson = (day: string, id: string) => {
    updateData({ schedule: { ...data.schedule, [day]: data.schedule[day].filter(l => l.id !== id) } });
  };

  const currentLessons = data.schedule[activeDay] || [];
  const umum = currentLessons.filter(l => l.type === 'umum');
  const produktif = currentLessons.filter(l => l.type === 'produktif');

  return (
    <div className="min-h-screen pt-32 pb-40 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex p-4 rounded-3xl bg-emerald-600/10 mb-6">
            <Calendar className="text-emerald-500" size={32} />
          </div>
          <h1 className="text-5xl font-bold mb-4">Jadwal Akademik</h1>
          <p className="text-slate-400 text-lg">Sinkronisasi waktu dan pengetahuan X TJKT 2.</p>
        </div>

        {/* Day Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-8 py-3 rounded-2xl font-bold transition-all border ${activeDay === day ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-900 border-white/5 text-slate-500 hover:text-slate-300'}`}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Pelajaran Umum */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600/10 rounded-xl">
                  <Layers className="text-blue-500" size={24} />
                </div>
                <h2 className="text-2xl font-bold">Pelajaran Umum</h2>
              </div>
              {isEditMode && (
                <button onClick={() => addLesson(activeDay, 'umum')} className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                  <Plus size={20} />
                </button>
              )}
            </div>

            <div className="space-y-4">
              {umum.length > 0 ? umum.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} isEditMode={isEditMode} onUpdate={(u) => updateLesson(activeDay, lesson.id, u)} onRemove={() => removeLesson(activeDay, lesson.id)} />
              )) : (
                <div className="p-12 border border-dashed border-slate-800 rounded-3xl text-center text-slate-500 italic">Tidak ada pelajaran umum hari ini</div>
              )}
            </div>
          </div>

          {/* Pelajaran Produktif */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-600/10 rounded-xl">
                  <Briefcase className="text-orange-500" size={24} />
                </div>
                <h2 className="text-2xl font-bold">Pelajaran Produktif</h2>
              </div>
              {isEditMode && (
                <button onClick={() => addLesson(activeDay, 'produktif')} className="p-2 bg-orange-600/20 text-orange-400 rounded-lg hover:bg-orange-600 hover:text-white transition-all">
                  <Plus size={20} />
                </button>
              )}
            </div>

            <div className="space-y-4">
              {produktif.length > 0 ? produktif.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} isEditMode={isEditMode} onUpdate={(u) => updateLesson(activeDay, lesson.id, u)} onRemove={() => removeLesson(activeDay, lesson.id)} />
              )) : (
                <div className="p-12 border border-dashed border-slate-800 rounded-3xl text-center text-slate-500 italic">Tidak ada pelajaran produktif hari ini</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Fixed: Explicitly typed LessonCard as React.FC to handle React's 'key' prop correctly
const LessonCard: React.FC<{ 
  lesson: Lesson; 
  isEditMode: boolean; 
  onUpdate: (u: Partial<Lesson>) => void; 
  onRemove: () => void; 
}> = ({ lesson, isEditMode, onUpdate, onRemove }) => (
  <div className="group bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 hover:border-blue-500/30 transition-all shadow-xl relative">
    {isEditMode && (
      <button onClick={onRemove} className="absolute top-4 right-4 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
        <Trash2 size={16} />
      </button>
    )}
    <div className="flex justify-between items-start mb-4">
      {isEditMode ? (
        <input 
          className="bg-slate-800 border border-white/5 rounded-lg px-2 py-1 text-xs text-blue-400 font-mono w-32 focus:outline-none"
          value={lesson.time}
          onChange={e => onUpdate({ time: e.target.value })}
        />
      ) : (
        <div className="flex items-center gap-2 text-slate-500 font-mono text-xs uppercase tracking-widest">
          <Clock size={14} className="text-blue-500" />
          {lesson.time}
        </div>
      )}
      <Hash size={16} className="text-slate-800" />
    </div>
    
    {isEditMode ? (
      <div className="space-y-3">
        <input 
          className="bg-slate-800 border border-white/5 rounded-lg px-3 py-1.5 text-lg font-bold text-white w-full focus:outline-none"
          value={lesson.subject}
          onChange={e => onUpdate({ subject: e.target.value })}
        />
        <div className="flex items-center gap-3">
          <User size={14} className="text-slate-500" />
          <input 
            className="bg-slate-800 border border-white/5 rounded-lg px-3 py-1 text-sm text-slate-400 w-full focus:outline-none italic"
            value={lesson.teacher}
            onChange={e => onUpdate({ teacher: e.target.value })}
          />
        </div>
      </div>
    ) : (
      <>
        <h4 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
          {lesson.subject}
        </h4>
        <div className="flex items-center gap-3 text-slate-400 text-sm italic">
          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center">
            <User size={12} />
          </div>
          {lesson.teacher}
        </div>
      </>
    )}
  </div>
);

export default SchedulePage;
