import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SignupPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-32 px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <span className="text-[10px] tracking-[0.4em] text-stone-400 uppercase font-bold mb-4 block">Join the Circle</span>
            <h1 className="text-5xl font-serif font-black mb-4">SIGN <span className="italic font-normal">UP</span>.</h1>
            <p className="text-stone-500 text-xs tracking-widest uppercase font-bold">
              Become a part of our global community of seekers.
            </p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-400">Full Name</label>
              <Input type="text" placeholder="YOUR NAME" required />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-400">Email Address</label>
              <Input type="email" placeholder="EMAIL@EXAMPLE.COM" required />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-400">Password</label>
              <Input type="password" placeholder="••••••••" required />
            </div>

            <p className="text-[9px] text-stone-400 leading-relaxed uppercase tracking-widest text-center py-4">
              By creating an account, you agree to our <br />
              <Link href="#" className="underline hover:text-black">Terms of Service</Link> and <Link href="#" className="underline hover:text-black">Privacy Policy</Link>.
            </p>

            <Button variant="premium" className="w-full h-14">
              Create Account
            </Button>
          </form>

          <div className="mt-12 pt-8 border-t border-stone-100 text-center">
            <p className="text-[10px] tracking-widest uppercase font-bold text-stone-400">
              Already have an account?{" "}
              <Link href="/login" className="text-black hover:text-primary transition-colors ml-2">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
