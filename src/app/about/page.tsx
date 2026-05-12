import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB]">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-24 md:py-32 border-b border-stone-100">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              <span className="text-[10px] tracking-[0.4em] text-stone-400 uppercase font-bold mb-8 block">Our Story</span>
              <h1 className="text-5xl md:text-8xl font-serif font-black leading-[0.9] mb-12">
                WHERE WORDS <br /> 
                <span className="italic font-normal text-stone-300">MEET</span> SOUL.
              </h1>
              <p className="text-xl md:text-2xl text-stone-600 leading-relaxed font-light max-w-2xl">
                Rewaya was born from a simple belief: that books are more than paper and ink—they are the vessels of our shared humanity and divine wisdom.
              </p>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop" 
                  alt="Aesthetic library" 
                  className="w-full aspect-[3/4] object-cover grayscale"
                />
              </div>
              <div className="flex flex-col gap-12">
                <div>
                  <h3 className="text-3xl font-serif font-bold mb-6">Curated with Purpose</h3>
                  <p className="text-stone-500 leading-relaxed uppercase tracking-widest text-[11px] font-bold">
                    Every title in our collection is hand-selected. We don't just sell books; we offer pathways to reflection, growth, and peace. From classical Islamic texts to modern masterpieces of fiction and self-improvement.
                  </p>
                </div>
                <div>
                  <h3 className="text-3xl font-serif font-bold mb-6">A Global Community</h3>
                  <p className="text-stone-500 leading-relaxed uppercase tracking-widest text-[11px] font-bold">
                    Rewaya serves seekers from all walks of life. We bridge the gap between tradition and modernity, creating a space where everyone is welcome to explore the world's most profound ideas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision */}
        <section className="py-32 bg-black text-white">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-serif font-black mb-12 italic">The future of reading is reflective.</h2>
              <p className="text-stone-400 text-sm tracking-[0.2em] uppercase leading-loose">
                Join us in our mission to bring back the art of deep reading and thoughtful contemplation. In a world of noise, we choose the melody of silence and the weight of words.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
