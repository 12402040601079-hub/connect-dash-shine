import React, { useRef, useState } from "react";

interface TiltCard3DProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  maxTilt?: number;
  glowColor?: string;
  onClick?: () => void;
}

export default function TiltCard3D({
  children,
  className = "",
  style = {},
  maxTilt = 12,
  glowColor = "rgba(99, 102, 241, 0.25)",
  onClick,
}: TiltCard3DProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = ((y - centerY) / centerY) * -maxTilt;
    const tiltY = ((x - centerX) / centerX) * maxTilt;

    setTilt({ x: tiltX, y: tiltY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.18,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
        transition: isHovered
          ? "transform 0.08s ease-out, box-shadow 0.2s ease"
          : "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.45s ease",
        transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${
          isHovered ? "scale3d(1.02, 1.02, 1.02)" : "scale3d(1, 1, 1)"
        }`,
        boxShadow: isHovered
          ? `0 24px 48px -12px ${glowColor}, 0 0 20px 0 ${glowColor}`
          : undefined,
        position: "relative",
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {/* Specular 3D Glare Sheen */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 10,
          background: `radial-gradient(circle 350px at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 80%)`,
          transition: "opacity 0.2s ease",
        }}
      />
      {children}
    </div>
  );
}
