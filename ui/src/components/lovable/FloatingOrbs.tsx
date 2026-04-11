import { motion } from "framer-motion";

export function FloatingOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Primary cyan orb */}
      <motion.div
        animate={{
          x: [0, 100, -50, 80, 0],
          y: [0, -80, 60, -40, 0],
          scale: [1, 1.2, 0.9, 1.1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full animate-morph"
        style={{
          background: "radial-gradient(circle, oklch(0.78 0.16 195 / 8%), transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      {/* Violet orb */}
      <motion.div
        animate={{
          x: [0, -80, 60, -30, 0],
          y: [0, 60, -80, 40, 0],
          scale: [1, 0.9, 1.15, 0.95, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 -right-32 h-[400px] w-[400px] rounded-full animate-morph"
        style={{
          background: "radial-gradient(circle, oklch(0.70 0.22 290 / 8%), transparent 70%)",
          filter: "blur(60px)",
          animationDelay: "-4s",
        }}
      />
      {/* Emerald orb bottom */}
      <motion.div
        animate={{
          x: [0, 60, -40, 20, 0],
          y: [0, -40, 30, -20, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full"
        style={{
          background: "radial-gradient(circle, oklch(0.72 0.19 155 / 5%), transparent 70%)",
          filter: "blur(50px)",
        }}
      />
    </div>
  );
}
