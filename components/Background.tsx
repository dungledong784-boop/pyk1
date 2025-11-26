import React from 'react';

interface BackgroundProps {
  isActive: boolean;
}

const Background: React.FC<BackgroundProps> = React.memo(({ isActive }) => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    {/* Deep Space Base */}
    <div className="absolute inset-0 bg-[#020617]"></div>
    
    {/* Aurora Orbs with Float Animation */}
    <div className={`absolute top-[-10%] left-[-20%] w-[80%] h-[60%] rounded-full blur-[120px] transition-all duration-[3000ms] animate-float opacity-30 ${isActive ? 'bg-emerald-900/40' : 'bg-blue-900/20'}`}></div>
    <div className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[100px] transition-all duration-[3000ms] animate-float-delayed opacity-20 ${isActive ? 'bg-teal-900/40' : 'bg-indigo-900/20'}`}></div>
    
    {/* Grid Pattern */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black_40%,transparent_100%)]"></div>
  </div>
));

export default Background;