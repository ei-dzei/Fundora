import { motion } from "framer-motion";

export default function FeatureCard({
  title,
  description,
  href,
  icon,
  cta = "Learn more",
  onClick,
}) {
  const Wrapper = href ? "a" : "button";
  const wrapperProps = href
    ? { href }
    : { type: "button", onClick: onClick ?? (() => {}) };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Wrapper
        {...wrapperProps}
        className={[
          "group relative block w-full text-left",
          "rounded-2xl border border-white/10",
          "bg-gradient-to-b from-[#113334] to-[#0b2b2b]",
          "p-5 sm:p-6",
          "shadow-sm hover:shadow-lg",
          "transition-all duration-200",
          "hover:-translate-y-0.5",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-pvteal",
        ].join(" ")}
      >
        {/* subtle glow on hover */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 blur group-hover:opacity-100 transition-opacity duration-200" style={{ background: "radial-gradient(600px circle at var(--x,50%) var(--y,50%), rgba(0,255,200,0.08), transparent 40%)" }} />

        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
            {/* Icon dot fallback */}
            {icon ?? <span className="text-2xl leading-none text-pvteal">•</span>}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold text-white">
              {title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-zinc-300">
              {description}
            </p>

            <div className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-pvteal">
              <span>{cta}</span>
              <svg
                className="h-4 w-4 translate-x-0 transition-transform duration-200 group-hover:translate-x-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M11.3 4.3a1 1 0 0 0 0 1.4L14.6 9H4a1 1 0 1 0 0 2h10.6l-3.3 3.3a1 1 0 1 0 1.4 1.4l5-5a1 1 0 0 0 0-1.4l-5-5a1 1 0 0 0-1.4 0z" />
              </svg>
            </div>
          </div>
        </div>
      </Wrapper>
    </motion.div>
  );
}
