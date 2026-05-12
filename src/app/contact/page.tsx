import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-grow pt-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 mb-32">
            {/* Contact Info */}
            <div className="flex flex-col justify-between py-12">
              <div>
                <span className="text-[10px] tracking-[0.4em] text-stone-400 uppercase font-bold mb-12 block">Get in Touch</span>
                <h1 className="text-6xl md:text-8xl font-serif font-black leading-[0.85] mb-16">
                  LET'S <br />
                  <span className="italic font-normal text-stone-300">CONNECT.</span>
                </h1>

                <div className="space-y-12">
                  <div>
                    <h3 className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-400 mb-4">Email Us</h3>
                    <p className="text-2xl font-serif">hello@rewayabooks.com</p>
                  </div>
                  <div>
                    <h3 className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-400 mb-4">Visit Us</h3>
                    <p className="text-2xl font-serif">123 Wisdom Ave, <br />Knowledge District, NY 10001</p>
                  </div>
                  <div>
                    <h3 className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-400 mb-4">Follow</h3>
                    <div className="flex gap-8">
                      <a href="#" className="text-xs tracking-widest font-bold uppercase hover:text-stone-400 transition-colors">Instagram</a>
                      <a href="#" className="text-xs tracking-widest font-bold uppercase hover:text-stone-400 transition-colors">Twitter</a>
                      <a href="#" className="text-xs tracking-widest font-bold uppercase hover:text-stone-400 transition-colors">Pinterest</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-24 pt-12 border-t border-stone-100">
                <p className="text-[10px] text-stone-400 tracking-[0.2em] uppercase max-w-xs leading-loose">
                  Our team typically responds within 24-48 business hours. We look forward to hearing your thoughts.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-stone-50 p-12 md:p-20">
              <form className="space-y-12">
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-400">Full Name</label>
                  <Input
                    type="text"
                    placeholder="ENTER YOUR NAME"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-400">Email Address</label>
                  <Input
                    type="email"
                    placeholder="EMAIL@EXAMPLE.COM"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-400">Message</label>
                  <textarea
                    rows={4}
                    className="w-full bg-transparent border-b border-stone-300 py-4 focus:outline-none focus:border-black transition-colors text-sm uppercase tracking-widest resize-none"
                    placeholder="WHAT'S ON YOUR MIND?"
                  />
                </div>

                <Button variant="premium" className="w-full h-16">
                  Send Message
                  <span className="ml-4 transform group-hover:translate-x-2 transition-transform">→</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
