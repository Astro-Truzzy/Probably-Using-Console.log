"use client";

import Image from "next/image";
import type { PointerEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useReducedMotion } from "./terminal/useTypewriter";

interface AboutPhotoProps {
  src?: string;
  alt?: string;
  initials?: string;
}

export default function AboutPhoto({
  src,
  alt = "Trust Williams",
  initials = "TW",
}: AboutPhotoProps) {
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 22 });
  const springY = useSpring(y, { stiffness: 260, damping: 22 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
    x.set(offsetX);
    y.set(offsetY);
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      className="about-photo-wrap"
      initial={reducedMotion ? false : { opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="about-photo-tilt"
        style={
          reducedMotion
            ? undefined
            : { rotateX, rotateY, transformPerspective: 900 }
        }
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <div className="about-photo-ring" aria-hidden="true" />
        <div className="about-photo-frame">
          <div className="about-photo-scanlines" aria-hidden="true" />
          {src ? (
            <Image
              src={src}
              alt={alt}
              width={280}
              height={280}
              className="about-photo-image"
              priority
            />
          ) : (
            <div className="about-photo-placeholder">
              <span className="about-photo-initials" aria-hidden="true">
                {initials}
              </span>
              <span className="about-photo-label font-mono">profile.jpg</span>
              <span className="about-photo-status font-mono">[ pending ]</span>
            </div>
          )}
        </div>
      </motion.div>
      {/* <p className="mt-3 text-center font-mono text-xs text-(--text-muted)">
        <span className="text-(--accent)">//</span> drop your photo in{" "}
        <code className="text-(--text-main)">public/profile.jpg</code>
      </p> */}
    </motion.div>
  );
}
