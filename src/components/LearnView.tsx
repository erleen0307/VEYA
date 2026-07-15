import { useState } from 'react';
import { BookOpen, Sparkles, Clock, Search, ArrowLeft, Heart, ChevronRight, Apple, Activity, Award } from 'lucide-react';
import { LearningArticle } from '../types';

const ARTICLES: LearningArticle[] = [
  {
    id: "learn-phases",
    title: "Understanding Your Four Cycle Seasons",
    category: "Cycle Phases",
    readTime: "4 min read",
    summary: "Learn how progesterone and estrogen waves naturally guide your mental focus, physical stamina, and social desire across 28 days.",
    content: `### The Four Cycle Seasons

Just as the earth transitions through seasonal weather, your body transitions through four distinct physiological and psychological phases every cycle.

#### 1. Winter: The Menstrual Phase
*Estrogen and progesterone are at their lowest baseline.*
This is a cycle phase focused on rest, release, and physical renewal. The body requires additional hydration and magnesium to support smooth muscle contractions.
- **Physical Stamina**: Low.
- **Supportive Foods**: Bone broths, root vegetables, warm stews, dark cocoa.
- **Ritual**: Reflect, journal, and rest without guilt.

#### 2. Spring: The Follicular Phase
*Estrogen levels begin a rapid ascent, peaking near the end.*
You will notice rising motivation, mental clarity, and verbal fluency.
- **Physical Stamina**: Increasing. Perfect for planning new physical or business goals.
- **Supportive Foods**: Sprouted seeds, light steamed greens, citrus.
- **Ritual**: Brainstorm, design, and take action.

#### 3. Summer: The Ovulatory Phase
*LH and Estrogen peak, triggering ovulation.*
Your social confidence, physical power, and verbal magnetism are at their maximum.
- **Physical Stamina**: Vibrant. Excellent window for heavy lifting, high-intensity workouts, or complex social presentations.
- **Supportive Foods**: Raw vegetables, cooling foods, fresh fruits.
- **Ritual**: Present, pitch, socialize, and connect.

#### 4. Autumn: The Luteal Phase
*Progesterone ascends to its peak.*
Energy shifts inwards. This is your "audit" phase—excellent for organizing, wrapping up projects, and practicing solid boundaries.
- **Physical Stamina**: Moderated. Transition workouts to slow strength, Pilates, or hiking.
- **Supportive Foods**: Complex carbohydrates, sweet potatoes, brown rice.
- **Ritual**: Declutter, organize, practice nourishing boundaries.`
  },
  {
    id: "learn-hormones",
    title: "Estrogen vs. Progesterone: The Balancing Act",
    category: "Hormones",
    readTime: "3 min read",
    summary: "Meet the two core directors of your endocrine system and how their interplay dictates daily focus, mood, and sleep.",
    content: `### The Endocrine Orchestrators

Your hormonal cycle is driven by the rise and fall of two key chemical messengers: **Estrogen** and **Progesterone**. Understanding their interaction is the secret to body awareness.

#### The Progesterone Factor
Progesterone is synthesized after ovulation (luteal phase). It is your body's natural calming hormone, interacting with GABA receptors in the brain to support sleep, slow down digestion, and lower body anxiety.
*When balanced, it promotes beautiful restorative sleep.*
*When too low, it causes luteal anxiety and pre-period restless sleep.*

#### The Estrogen Spark
Estrogen dominates the first half of your cycle. It supports muscle tone, serotonin production, skin elasticity, and cardiovascular performance.
*When balanced, it gives you glowing skin, social confidence, and sharp mental focus.*
*When out of balance, it can lead to heavy periods or pelvic bloating.*`
  },
  {
    id: "learn-pain",
    title: "Natural Support for Pelvic Discomfort",
    category: "Pain Management",
    readTime: "5 min read",
    summary: "Gentle, non-clinical practices to soothe menstrual cramps, support tissue oxygenation, and ease bloating.",
    content: `### Supporting Your Pelvis

Cramps (Dysmenorrhea) occur when uterine muscle walls contract to shed lining, temporarily restricting local blood flow. Here are supportive lifestyle practices to keep discomfort mild:

#### 1. Magnesium and Warmth
Magnesium is a natural smooth-muscle relaxant. Warm baths or a hot water bottle placed on the lower back/pelvis increases local vascular circulation, restoring oxygenated blood flow to uterine tissues.

#### 2. Herbal Infusions
- **Ginger Tea**: Acts as a natural anti-inflammatory agent.
- **Raspberry Leaf**: Long used to tone uterine muscles and alleviate mild spasms.
- **Peppermint**: Relieves accompanying digestive gas and abdominal pressure.

#### 3. Restorative Movements
Avoid high intensity workouts. Focus on:
- **Child's Pose**: Stretches the lower spine and pelvic basin.
- **Supta Baddha Konasana (Reclined Butterfly)**: Supports pelvic open space and deep diaphragmatic breathing.`
  },
  {
    id: "learn-pcos",
    title: "Understanding PCOS and Hormonal Flow",
    category: "Hormonal Support",
    readTime: "4 min read",
    summary: "An educational dive into Polycystic Ovary Syndrome, focusing on cycle length variability and insulin-hormone balance.",
    content: `### Demystifying PCOS

Polycystic Ovary Syndrome (PCOS) is a common endocrine variance characterized by fluctuating menstrual cycle lengths, insulin resistance, or mild elevations in androgen hormones.

#### Key Patterns to Track
- **Cycle Length**: Cycles longer than 35 days, or highly variable rhythm lengths.
- **Insomnia and Fatigue**: Fatigue patterns related to morning glucose spikes.

#### Lifestyle Adaptations
1. **Glucose Flow**: Pair carbohydrates with healthy fibers, fats, and proteins to minimize sharp insulin spikes that interfere with ovulation.
2. **Stress Management**: High levels of cortisol can suppress progesterone and disrupt ovulation. Prioritize deep sleep and restorative wind-downs.
3. **Daily Movement**: Light strength training or slow, intentional walks support muscular insulin sensitivity without over-stressing the adrenal glands.`
  }
];

export default function LearnView() {
  const [selectedArticle, setSelectedArticle] = useState<LearningArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter list
  const filteredArticles = ARTICLES.filter(art => 
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    art.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedArticle) {
    return (
      <div className="bg-white dark:bg-veya-card-dark rounded-3xl p-6 sm:p-8 border border-veya-border-light shadow-veya-sm space-y-6">
        {/* Back control */}
        <button
          onClick={() => setSelectedArticle(null)}
          className="flex items-center space-x-2 text-xs font-semibold text-veya-highlight hover:text-soft-violet group transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Library</span>
        </button>

        {/* Article Meta */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-xs text-veya-text-muted font-semibold uppercase tracking-wider">
            <span className="px-2.5 py-0.5 bg-veya-bg-light dark:bg-veya-bg-dark/80 text-veya-highlight rounded-full">
              {selectedArticle.category}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {selectedArticle.readTime}
            </span>
          </div>
          <h3 className="font-serif font-medium text-3xl sm:text-4xl text-veya-text-primary dark:text-white leading-snug">
            {selectedArticle.title}
          </h3>
          <p className="text-sm text-veya-text-secondary dark:text-veya-text-secondary-dark leading-relaxed italic border-l-2 border-veya-border-light pl-4 py-1">
            {selectedArticle.summary}
          </p>
        </div>

        <div className="border-t border-veya-border-light/60 dark:border-veya-bg-dark/60 my-6" />

        {/* Main Content Area */}
        <article className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm text-[#3D3655] dark:text-[#D5C9EE] space-y-5 leading-relaxed">
          {selectedArticle.content.split('\n\n').map((block, bIdx) => {
            if (block.startsWith('###')) {
              return (
                <h4 key={bIdx} className="font-serif font-medium text-2xl text-veya-text-primary dark:text-white mt-6 mb-2">
                  {block.replace(/###/g, '').trim()}
                </h4>
              );
            }
            if (block.startsWith('####')) {
              return (
                <h5 key={bIdx} className="font-heading font-semibold text-sm text-veya-highlight mt-4 mb-1">
                  {block.replace(/####/g, '').trim()}
                </h5>
              );
            }
            if (block.startsWith('-')) {
              return (
                <ul key={bIdx} className="list-disc pl-5 space-y-2">
                  {block.split('\n').map((line, lIdx) => (
                    <li key={lIdx} className="font-sans text-xs">
                      {line.substring(1).trim()}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={bIdx} className="font-sans text-xs text-veya-text-secondary dark:text-[#D5C9EE] leading-relaxed">
                {block}
              </p>
            );
          })}
        </article>

        {/* Disclaimer banner */}
        <div className="bg-veya-bg-secondary dark:bg-veya-bg-dark/20 border border-veya-border-light p-4 rounded-2xl text-[10px] text-veya-text-muted mt-8">
          <strong>Disclaimer</strong>: This content is curated for bodily awareness and hormonal tracking support only. It is not a clinical reference, diagnostic manual, or standard health protocol. Consult with your GP or physician regarding persistent pain or health assessments.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Intro Banner */}
      <div className="bg-white dark:bg-veya-card-dark rounded-3xl p-6 sm:p-8 border border-veya-border-light shadow-veya-sm flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-veya-bg-light dark:bg-veya-bg-dark/60 border border-veya-border-light px-3 py-1 rounded-full">
            <BookOpen className="h-3.5 w-3.5 text-veya-highlight" />
            <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-veya-highlight">VEYA Academy</span>
          </div>
          <h3 className="font-serif font-medium text-3xl text-veya-text-primary dark:text-white">
            Endocrine & Hormonal Literacy
          </h3>
          <p className="text-xs sm:text-sm text-veya-text-secondary dark:text-veya-text-secondary-dark leading-relaxed max-w-xl">
            Empower your cycle journey with educational wisdom. Explore the science behind hormonal fluctuations, sleep alignment, nutrition, and pelvic support.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:w-72 flex-shrink-0">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-veya-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search wellness library..."
            className="w-full bg-veya-bg-light/60 dark:bg-veya-bg-dark/40 border border-veya-border-light dark:border-veya-card-dark rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-veya-text-primary dark:text-white placeholder-veya-text-muted focus:outline-none focus:border-veya-highlight"
          />
        </div>
      </div>

      {/* Article Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.map((art) => (
          <div
            key={art.id}
            onClick={() => setSelectedArticle(art)}
            className="bg-white dark:bg-veya-card-dark rounded-3xl p-6 border border-veya-border-light shadow-veya-sm hover:border-veya-highlight/30 hover:shadow-veya hover:-translate-y-0.5 transition duration-300 flex flex-col justify-between cursor-pointer group"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-heading font-semibold uppercase tracking-wider px-2.5 py-0.5 bg-veya-bg-light dark:bg-veya-bg-dark/80 text-veya-highlight rounded-full">
                  {art.category}
                </span>
                <span className="text-[10px] text-veya-text-muted font-medium flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {art.readTime}
                </span>
              </div>

              <h4 className="font-serif font-medium text-xl leading-snug text-veya-text-primary dark:text-white group-hover:text-veya-highlight transition">
                {art.title}
              </h4>

              <p className="text-xs text-veya-text-secondary dark:text-veya-text-secondary-dark leading-relaxed">
                {art.summary}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-veya-border-light/60 dark:border-veya-bg-dark/60 flex items-center justify-between">
              <span className="text-xs font-semibold text-veya-text-muted group-hover:text-veya-highlight transition">
                Begin Reading
              </span>
              <ChevronRight className="h-4 w-4 text-veya-text-muted group-hover:text-veya-highlight group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}

        {filteredArticles.length === 0 && (
          <div className="col-span-full text-center py-12 text-veya-text-muted font-sans text-xs">
            No library articles found matching "{searchQuery}"
          </div>
        )}
      </div>

    </div>
  );
}
