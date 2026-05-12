import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-32 px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <span className="text-[10px] tracking-[0.4em] text-stone-400 uppercase font-bold mb-4 block">Welcome Back</span>
            <h1 className="text-5xl font-serif font-black mb-4">LOG <span className="italic font-normal">IN</span>.</h1>
            <p className="text-stone-500 text-xs tracking-widest uppercase font-bold">
              Enter your credentials to access your library.
            </p>
          </div>

          <form className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-400">Email Address</label>
              <Input type="email" placeholder="EMAIL@EXAMPLE.COM" required />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-400">Password</label>
                <Link href="#" className="text-[9px] tracking-widest uppercase font-bold text-stone-300 hover:text-primary transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <Input type="password" placeholder="••••••••" required />
            </div>

            <Button variant="premium" className="w-full h-14">
              Sign In
            </Button>
          </form>

          <div className="mt-12 pt-8 border-t border-stone-100 text-center">
            <p className="text-[10px] tracking-widest uppercase font-bold text-stone-400">
              Don't have an account?{" "}
              <Link href="/signup" className="text-black hover:text-primary transition-colors ml-2">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
