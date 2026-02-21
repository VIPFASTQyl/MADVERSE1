import React from 'react';

interface AnimatedBackgroundProps {
  className?: string;
}

export default function AnimatedBackground({ className = '' }: AnimatedBackgroundProps) {
  return (
    <>
      <style>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animated-bg {
          background: linear-gradient(-45deg, #000000, #004D4D, #00CED1, #000000);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }
      `}</style>
      <div className={`animated-bg ${className}`} />
    </>
  );
}
