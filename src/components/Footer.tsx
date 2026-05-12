import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

// Brand SVG components for social media
const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TwitterIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-400 py-20 mt-20 border-t border-stone-900">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="mb-8">
              <img
                src="/Al%20Rewaya%20Book%20World%20Approved%20Logo%201.png"
                alt="Al Rewaya Logo"
                className="h-16 w-auto object-contain"
              />
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Rewaya is more than just a bookstore. It's a gateway to knowledge, imagination, and spiritual growth. Founded in the heart of the UAE, serving the global reader.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-stone-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all text-stone-400 hover:border-primary">
                <InstagramIcon size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-stone-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all text-stone-400 hover:border-primary">
                <TwitterIcon size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-stone-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all text-stone-400 hover:border-primary">
                <FacebookIcon size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-primary">Quick Links</h4>
            <ul className="flex flex-col gap-4 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Track Order</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Return Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-primary">Categories</h4>
            <ul className="flex flex-col gap-4 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Islamic Books</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Personal Development</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Biographies</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Children's Books</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">New Releases</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-primary">Store Info</h4>
            <ul className="flex flex-col gap-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary mt-1" />
                <span>Dubai Design District, Building 4, Office 302, Dubai, UAE</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary" />
                <span>+971 4 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary" />
                <span>hello@rewayabooks.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs">© 2024 Rewaya Books. All rights reserved.</p>
          <div className="flex gap-6 text-xs uppercase tracking-widest font-bold">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
