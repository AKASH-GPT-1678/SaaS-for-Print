import { ArrowRight, Bookmark } from "lucide-react";
import { FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa6";

export default function FooterCTA() {
  return (
    <footer>
      {/* CTA Section */}
      <section className="relative overflow-hidden bg-[#FF8A34]">
        <div className="mx-auto max-w-7xl px-8 py-24">
          {/* Decorative Lines */}
          <div className="absolute right-0 top-0 h-full w-full pointer-events-none">
            <div className="absolute right-[12%] top-0 h-full w-px bg-black/30" />
            <div className="absolute right-[12%] top-[30%] h-px w-[40%] rotate-[32deg] bg-black/30 origin-right" />
          </div>

          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left */}
            <div className="max-w-2xl">
              <p className="mb-5 text-sm font-medium italic">
                ▪ See it in action
              </p>

              <h2 className="text-4xl font-semibold leading-tight md:text-6xl">
                Make every print request
                <br />
                easier to manage
              </h2>

              <button type="button" className="mt-10 inline-flex items-center gap-2 rounded-full bg-black px-7 py-4 text-sm font-medium text-white transition hover:scale-105">
                Request a demo
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Illustration Placeholder */}
            <div className="flex justify-center lg:justify-end">
              <div className="flex h-[300px] w-[300px] items-center justify-center rounded-3xl border-2 border-dashed border-black/30">
                <span className="text-black/50">Illustration Placeholder</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-8 py-20">
          <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
            {/* Logo */}
            <div>
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 border border-white" />
                <span className="text-xl font-medium">Printar</span>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="mb-6 text-sm text-zinc-400">Product</h4>

              <ul className="space-y-4 text-sm">
                <li>Overview</li>
                <li>QR uploads</li>
                <li>Live notifications</li>
                <li>File management</li>
                <li>Pricing</li>
              </ul>
            </div>

            {/* Stories */}
            <div>
              <h4 className="mb-6 text-sm text-zinc-400">Customer stories</h4>

              <ul className="space-y-4 text-sm">
                <li>Print shop workflows</li>
                <li>Customer experience</li>
                <li>Getting started</li>
              </ul>

              <h4 className="mt-12 mb-6 text-sm text-zinc-400">Resources</h4>

              <ul className="space-y-4 text-sm">
                <li>Blog</li>
                <li>Help centre</li>
                <li>Privacy</li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="mb-6 text-sm text-zinc-400">Company</h4>

              <ul className="space-y-4 text-sm">
                <li>About Printar</li>
                <li>Contact</li>
                <li>Terms</li>
                <li>Privacy</li>
              </ul>

              <h4 className="mt-12 mb-6 text-sm text-zinc-400">
                Media enquiries
              </h4>

              <ul className="space-y-4 text-sm">
                <li>hello@printar.in</li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-20 border-t border-zinc-800 pt-8">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex items-center gap-5">
                <FaLinkedin size={18} />
                <FaTwitter size={18} />
                <Bookmark size={18} />
                <FaYoutube size={18} />
              </div>

              <p className="text-sm text-zinc-500">© 2026 Printar. Built for busy print shops.</p>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}
