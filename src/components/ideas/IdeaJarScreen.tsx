import React, { useState } from 'react';
import { useTether } from '../../context/TetherContext';
import { IdeaCategory, IdeaItem } from '../../types/tether';
import { 
  Lightbulb, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  X, 
  Sparkles, 
  Lock,
  Utensils,
  MapPin,
  Tv,
  Calendar,
  Compass,
  Heart
} from 'lucide-react';

export const IdeaJarScreen: React.FC = () => {
  const { 
    ideas, 
    user, 
    partner, 
    addIdea, 
    toggleIdeaCompleted, 
    deleteIdea, 
    triggerPaywall, 
    isAddIdeaModalOpen, 
    setIsAddIdeaModalOpen 
  } = useTether();

  const [activeCategory, setActiveCategory] = useState<IdeaCategory | 'all'>('all');
  const [newTitle, setNewTitle] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newCategory, setNewCategory] = useState<IdeaCategory>('date');

  const categories: { id: IdeaCategory | 'all'; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'all', label: 'All Ideas', icon: Sparkles },
    { id: 'date', label: 'Dates', icon: Heart },
    { id: 'cook', label: 'To Cook', icon: Utensils },
    { id: 'place', label: 'Places', icon: MapPin },
    { id: 'watch', label: 'To Watch', icon: Tv },
    { id: 'activity', label: 'Activities', icon: Compass },
    { id: 'future', label: 'Future Plans', icon: Calendar },
  ];

  if (!user.isPremium) {
    return (
      <div className="min-h-screen bg-[#FAF7F5] pb-24 text-[#2B2320]">
        <div className="max-w-md mx-auto px-5 pt-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[#F3ECE6] border border-[#E5DAD2] flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="w-7 h-7 text-[#C86D51]" />
          </div>
          <h1 className="font-serif text-3xl font-normal text-[#2B2320] mb-2">
            Shared Idea Jar
          </h1>
          <p className="text-xs text-[#736A64] max-w-xs mx-auto mb-6 leading-relaxed">
            A quiet sanctuary for spontaneous date ideas, recipes to try together, and dreams for the upcoming weekend.
          </p>
          <button
            onClick={() => triggerPaywall('Shared Idea Jar')}
            className="px-6 py-3 rounded-xl bg-[#C86D51] text-white text-xs font-semibold uppercase tracking-wider shadow-sm hover:bg-[#B75F44] transition-colors"
          >
            Unlock Idea Jar
          </button>
        </div>
      </div>
    );
  }

  const filteredIdeas = ideas.filter(i => activeCategory === 'all' || i.category === activeCategory);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addIdea(newTitle, newCategory, newNote);
    setNewTitle('');
    setNewNote('');
    setIsAddIdeaModalOpen(false);
  };

  const getCategoryIcon = (cat: IdeaCategory) => {
    switch (cat) {
      case 'cook': return Utensils;
      case 'place': return MapPin;
      case 'watch': return Tv;
      case 'activity': return Compass;
      case 'future': return Calendar;
      case 'date':
      default:
        return Heart;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] pb-24 text-[#2B2320]">
      {/* Top Bar */}
      <div className="sticky top-14 z-20 px-5 py-3 bg-[#FAF7F5]/90 backdrop-blur-md border-b border-[#E8E2DD] flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-normal text-[#2B2320]">
            Idea Jar
          </h1>
          <p className="text-[11px] text-[#736A64]">
            Shared spark list · {ideas.length} ideas collected
          </p>
        </div>

        <button
          onClick={() => setIsAddIdeaModalOpen(true)}
          className="px-3.5 py-1.5 rounded-full bg-[#C86D51] text-white text-xs font-medium flex items-center gap-1 shadow-xs hover:bg-[#B75F44] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Idea</span>
        </button>
      </div>

      <div className="max-w-md mx-auto px-4 pt-4">
        {/* Horizontal Category Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-4">
          {categories.map((c) => {
            const Icon = c.icon;
            const isSelected = activeCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0 ${
                  isSelected
                    ? 'bg-[#2B2320] text-white shadow-xs'
                    : 'bg-white text-[#736A64] border border-[#E8E2DD] hover:text-[#2B2320]'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Ideas List */}
        {filteredIdeas.length === 0 ? (
          <div className="text-center py-20 px-6">
            <div className="w-14 h-14 rounded-full bg-[#F2ECE7] flex items-center justify-center mx-auto mb-3 text-[#A89F97]">
              <Lightbulb className="w-7 h-7 text-[#C86D51]" />
            </div>
            <h3 className="font-serif text-xl font-normal text-[#2B2320] mb-1">
              Your Jar is ready for a spark
            </h3>
            <p className="text-xs text-[#736A64] max-w-xs mx-auto mb-4 leading-relaxed">
              Drop in a cozy recipe, weekend getaway thought, or movie you want to watch together.
            </p>
            <button
              onClick={() => setIsAddIdeaModalOpen(true)}
              className="px-4 py-2 bg-[#C86D51] text-white rounded-xl text-xs font-medium"
            >
              Add the first idea
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredIdeas.map((idea) => {
              const Icon = getCategoryIcon(idea.category);
              const isMine = idea.createdBy === user.id;

              return (
                <div
                  key={idea.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    idea.isCompleted
                      ? 'bg-[#FAF7F5] border-[#E8E2DD] opacity-75'
                      : 'bg-white border-[#ECE5DF] shadow-xs hover:border-[#DDD3CB]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox trigger */}
                    <button
                      onClick={() => toggleIdeaCompleted(idea.id)}
                      className="mt-0.5 min-h-[44px] min-w-[44px] flex items-center justify-center -m-2 text-[#C86D51]"
                      aria-label={idea.isCompleted ? 'Mark idea incomplete' : 'Mark idea complete'}
                    >
                      {idea.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 fill-[#C86D51]/15 text-[#C86D51]" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#C2B7AE] hover:text-[#C86D51]" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-4 h-4 rounded-md bg-[#F4EFEA] text-[#736A64] flex items-center justify-center">
                          <Icon className="w-2.5 h-2.5" />
                        </span>
                        <h4 className={`text-xs font-semibold ${
                          idea.isCompleted ? 'line-through text-[#8C837C]' : 'text-[#2B2320]'
                        }`}>
                          {idea.title}
                        </h4>
                      </div>

                      {idea.note && (
                        <p className="text-[11px] text-[#736A64] mb-2 leading-relaxed pl-5">
                          {idea.note}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-[#A89F97] pl-5">
                        <span>
                          Added by {isMine ? 'You' : idea.createdByName}
                        </span>
                        <button
                          onClick={() => deleteIdea(idea.id)}
                          className="hover:text-rose-500 transition-colors p-1"
                          title="Delete idea"
                          aria-label="Delete idea"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ADD IDEA MODAL */}
      {isAddIdeaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-sm bg-[#1E1B19] text-[#FAF7F5] rounded-3xl p-6 shadow-2xl border border-white/10 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl font-normal text-[#FAF7F5]">
                Drop an idea into the Jar
              </h3>
              <button
                onClick={() => setIsAddIdeaModalOpen(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2 text-[#8C837C] hover:text-white"
                aria-label="Close add idea modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-[#A89F97] mb-1.5 uppercase tracking-wider">
                  Category
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['date', 'cook', 'place', 'watch', 'activity', 'future'] as IdeaCategory[]).map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setNewCategory(cat)}
                      className={`py-2 px-2 rounded-xl text-[11px] font-medium capitalize border transition-all ${
                        newCategory === cat
                          ? 'bg-[#C86D51] text-white border-[#C86D51]'
                          : 'bg-[#28221F] text-[#D8CDC4] border-white/5 hover:border-white/20'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#A89F97] mb-1.5 uppercase tracking-wider">
                  Idea Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Stargazing picnic on the cliff"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#28221F] border border-white/10 text-xs text-white placeholder-[#8A7F77] focus:outline-none focus:border-[#C86D51]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#A89F97] mb-1.5 uppercase tracking-wider">
                  Quick Note (Optional)
                </label>
                <textarea
                  rows={2}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Details, ingredients, or timing thoughts..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#28221F] border border-white/10 text-xs text-white placeholder-[#8A7F77] focus:outline-none focus:border-[#C86D51] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-[#C86D51] hover:bg-[#B75F44] active:scale-[0.98] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg transition-transform"
              >
                <span>Save to Jar</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
