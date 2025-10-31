import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative mt-16 border-t border-white/10 bg-[#071a1b] text-zinc-400">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pvteal/50 to-transparent" />

      <div className="max-w-6xl mx-auto grid gap-10 px-6 py-12 md:grid-cols-4">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-white">Fundora</h3>
          <p className="mt-2 text-sm text-zinc-400 max-w-xs">
            Onchain pension vaults for the decentralized economy.
          </p>
        </motion.div>

        {/* Services */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-2"
        >
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
            Services
          </h4>
          <ul className="space-y-1 text-sm text-zinc-400">
            <li className="transition-colors hover:text-pvteal cursor-pointer">Lock &amp; Save</li>
          </ul>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="space-y-2"
        >
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
            About
          </h4>
          <ul className="space-y-1 text-sm text-zinc-400">
            <li className="transition-colors hover:text-pvteal cursor-pointer">
              Contact us
            </li>
            <li className="transition-colors hover:text-pvteal cursor-pointer">
              Documentation
            </li>
            <li className="transition-colors hover:text-pvteal cursor-pointer">
              FAQ
            </li>
          </ul>
        </motion.div>

        {/* Social */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
            Community
          </h4>
          <div className="mt-2 flex gap-4 text-zinc-400">
            <a href="https://github.com/ei-dzei/Fundora" target="_blank" rel="noopener noreferrer" className="hover:text-pvteal transition-colors">
              GitHub
            </a>
          </div>
        </motion.div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} Fundora —{" "}
          <a href="#" className="hover:text-pvteal transition-colors">
            Privacy Policy
          </a>{" "}
          •{" "}
          <a href="#" className="hover:text-pvteal transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
