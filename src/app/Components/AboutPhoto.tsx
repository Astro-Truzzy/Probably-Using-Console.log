"use client";

import Image from "next/image";
import { useState, type PointerEvent } from "react";
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
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rotateX: -offsetY * 16, rotateY: offsetX * 16 });
  }

  function handlePointerLeave() {
    setTilt({ rotateX: 0, rotateY: 0 });
  }

  return (
    <div className={`about-photo-wrap${reducedMotion ? " about-photo-wrap--static" : ""}`}>
      <div
        className="about-photo-tilt"
        style={
          reducedMotion
            ? undefined
            : {
                transform: `perspective(900px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
              }
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
      </div>
    </div>
  );
}
