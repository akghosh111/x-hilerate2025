import React from 'react';
import { Music } from 'lucide-react';

const MusicComponent = () => {
  return (
    <div className="fixed inset-0 bg-black z-[-1]">
      {[...Array(20)].map((_, index) => (
        <Music 
          key={index}
          className="absolute text-white/10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: '100px'
          }}
        />
      ))}
    </div>
  );
};

export default MusicComponent;