import React from 'react';
import { Rocket } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <Rocket className="w-8 h-8 text-indigo-600" />
      <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Raze
      </span>
    </div>
  );
};

export default Logo;