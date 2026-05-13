import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Sequence } from 'remotion';

const facts = [
  "Artisan beans are hand-picked at peak ripeness.",
  "Roasted in small batches to lock in delicate flavors.",
  "Sourced ethically from single-origin farms globally."
];

const FactOverlay = ({ fact }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Total duration of this sequence is 300 frames (10 seconds at 30fps)
  // Fade in: 0-30, hold: 30-270, fade out: 270-300
  const opacity = interpolate(
    frame,
    [0, 30, 270, 300],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const translateY = interpolate(
    frame,
    [0, 30, 270, 300],
    [20, 0, 0, -20],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div
        className="glass-card"
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          padding: '2rem 3rem',
          maxWidth: '600px',
          textAlign: 'center',
          pointerEvents: 'none'
        }}
      >
        <h3 style={{ 
          color: '#F5E6D3', 
          fontFamily: "'Playfair Display', Georgia, serif", 
          fontSize: '2rem', 
          margin: 0, 
          letterSpacing: '-0.02em',
          textShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}>
          {fact}
        </h3>
      </div>
    </AbsoluteFill>
  );
};

export const FloatingFactsComp = () => {
  const { fps } = useVideoConfig();
  const durationPerFact = fps * 10; // 10 seconds

  return (
    <AbsoluteFill>
      {facts.map((fact, index) => (
        <Sequence
          key={index}
          from={index * durationPerFact}
          durationInFrames={durationPerFact}
        >
          <FactOverlay fact={fact} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
