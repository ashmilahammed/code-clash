import { useNavigate } from "react-router-dom";
import { 
    Zap, 
    Handshake, 
    Trophy, 
    Globe, 
    Users, 
    Palette
} from "lucide-react";
import { motion } from "framer-motion";


const LandingPage = () => {
    const navigate = useNavigate();

    const stats = [
        { label: "Active Coders", value: "10K+" },
        { label: "Challenges", value: "500+" },
        { label: "Languages", value: "50+" },
        { label: "Success Rate", value: "99%" },
    ];


    const features = [
        {
            title: "Progressive Challenges",
            description: "From beginner-friendly puzzles to expert-level algorithmic nightmares. Each challenge is designed to push your boundaries and expand your coding horizons.",
            icon: <Zap className="text-cyan-400" size={32} />,
        },
        {
            title: "Real Time Feedback",
            description: "Get instant feedback on your code with our advanced syntax analyzer. Learn from mistakes and optimize your solutions in real-time.",
            icon: <Handshake className="text-cyan-400" size={32} />,
        },
        {
            title: "XP & Levelling System",
            description: "Earn experience points, unlock achievements, and climb the leaderboards. Gamify your learning journey and compete with coders worldwide.",
            icon: <Trophy className="text-cyan-400" size={32} />,
        },
        {
            title: "Multi Language Support",
            description: "Practice in JavaScript, Python, Java, C++, and 40+ other programming languages. Master the syntax that matters to your career.",
            icon: <Globe className="text-cyan-400" size={32} />,
        },
        {
            title: "Community Driven",
            description: "Join study groups, share solutions, and learn from experienced developers. Our community is here to support your coding journey.",
            icon: <Users className="text-cyan-400" size={32} />,
        },
        {
            title: "Interactive Editor",
            description: "Code in our feature-rich editor with syntax highlighting, auto-completion, and debugging tools. It's like having an IDE in your browser.",
            icon: <Palette className="text-cyan-400" size={32} />,
        },
    ];

    
    return (
        <div className="min-h-screen bg-[#050B18] text-slate-300 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
            {/* Background Pattern */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#1E293B 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

       
            {/* Hero Section */}
            <section className="relative z-10 pt-20 pb-32 px-6 text-center max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                    Master Code Through Challenges
                </h1>
                <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                    Dive into the depths of programming with interactive challenges. 
                    Repair digital ecosystems, solve complex algorithms, and level up 
                    your coding skills in our immersive platform.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                        onClick={() => navigate("/auth/login")}
                        className="w-full sm:w-auto bg-linear-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white px-8 py-4 rounded-full font-bold transition-all shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        Enter Matrix
                    </button>
                    <button 
                        onClick={() => navigate("/auth/login")}
                        className="w-full sm:w-auto bg-[#1E293B]/50 hover:bg-[#1E293B] border border-slate-700 text-white px-8 py-4 rounded-full font-bold transition-all backdrop-blur-sm cursor-pointer"
                    >
                        Explore Challenges
                    </button>
                </div>


                
                    <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-20 bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-2xl text-left max-w-3xl mx-auto"
        >
          <div className="flex gap-2 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          </div>

          <pre className="text-sm text-cyan-400">
{`function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) return [map.get(diff), i];
    map.set(nums[i], i);
  }
}`}
          </pre>
        </motion.div>
            </section>

            {/* Stats Section */}
               <section className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center py-16 border-y border-slate-800 bg-[#070F21]">
        {stats.map((s, i) => (
          <div key={i}>
            <div className="text-3xl md:text-4xl font-black text-white">
                {s.value}</div>
            <div className="text-xs uppercase tracking-widest text-slate-500">
              {s.label}
            </div>
          </div>
        ))}
      </section>

            {/* Why Choose Section */}
            <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-16">
                    Why Choose Code-Clash ?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, idx) => (
                        <div 
                            key={idx} 
                            className="group p-8 rounded-2xl bg-[#0F172A]/40 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 hover:bg-[#0F172A]/80 flex flex-col items-center text-center backdrop-blur-sm"
                        >
                            <div className="mb-6 p-4 rounded-2xl bg-cyan-500/10 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Ready Section */}
            <section className="relative z-10 py-32 px-6 max-w-4xl mx-auto text-center">
                <div className="p-12 rounded-3xl bg-linear-to-b from-[#0F172A] to-transparent border border-slate-800/50">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ready to Accept the Challenge?
                    </h2>
                    <p className="text-lg text-slate-400 mb-10">
                        Join thousands of developers who are leveling up their skills while having fun.
                    </p>
                    <button 
                        onClick={() => navigate("/auth/login")}
                        className="bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-10 py-4 rounded-full font-bold transition-all shadow-2xl shadow-cyan-500/30 cursor-pointer"
                    >
                        Create Free Account
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 max-w-7xl mx-auto px-6 py-12 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-8 text-sm font-medium">
                    <button onClick={() => navigate("/auth/login")} className="hover:text-white transition cursor-pointer">About</button>
                    <button onClick={() => navigate("/auth/login")} className="hover:text-white transition cursor-pointer">Privacy</button>
                    <button onClick={() => navigate("/auth/login")} className="hover:text-white transition cursor-pointer">Terms</button>
                    <button onClick={() => navigate("/auth/login")} className="hover:text-white transition cursor-pointer">Support</button>
                </div>
                <div className="text-sm text-slate-500 uppercase font-bold tracking-tight">
                    © 2025 <span className="text-cyan-500">CODE-CLASH</span>. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;





// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import {
//   Zap,
//   Trophy,
//   Users,
//   Globe,
//   Crown,
//   Code,
// } from "lucide-react";

// const LandingPage = () => {
//   const navigate = useNavigate();

//   const stats = [
//     { label: "Active Coders", value: "10K+" },
//     { label: "Challenges", value: "500+" },
//     { label: "Languages", value: "50+" },
//     { label: "Success Rate", value: "99%" },
//   ];

//   const features = [
//     {
//       title: "Progressive Challenges",
//       desc: "From beginner to expert level problems.",
//       icon: <Zap className="text-cyan-400" />,
//     },
//     {
//       title: "Gamified XP System",
//       desc: "Earn XP, badges and climb leaderboard.",
//       icon: <Trophy className="text-purple-400" />,
//     },
//     {
//       title: "Community Groups",
//       desc: "Collaborate and grow with coders.",
//       icon: <Users className="text-pink-400" />,
//     },
//     {
//       title: "Multi Language Support",
//       desc: "Solve problems in 50+ languages.",
//       icon: <Globe className="text-indigo-400" />,
//     },
//   ];

//   return (
//     <div className="bg-[#050B18] text-slate-300 min-h-screen overflow-x-hidden">

     
//       {/* HERO */}
//       <section className="pt-32 pb-24 px-6 text-center max-w-6xl mx-auto">
//         <motion.h1
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-5xl md:text-7xl font-extrabold text-white leading-tight"
//         >
//           Master Coding <br /> Through Challenges
//         </motion.h1>

//         <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
//           Solve real algorithmic problems, gain XP, compete globally,
//           and become a better developer every day.
//         </p>

//         <div className="mt-10 flex gap-4 justify-center flex-wrap">
//           <button
//             onClick={() => navigate("/auth/login")}
//             className="bg-gradient-to-r from-purple-600 to-cyan-500 px-8 py-4 rounded-full font-bold text-white shadow-xl hover:scale-105 transition"
//           >
//             Solve First Challenge
//           </button>

//           <button className="border border-slate-700 px-8 py-4 rounded-full hover:bg-slate-800 transition">
//             Explore Platform
//           </button>
//         </div>

//         {/* MOCK EDITOR */}
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="mt-20 bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-2xl text-left max-w-3xl mx-auto"
//         >
//           <div className="flex gap-2 mb-4">
//             <div className="w-3 h-3 bg-red-500 rounded-full" />
//             <div className="w-3 h-3 bg-yellow-500 rounded-full" />
//             <div className="w-3 h-3 bg-green-500 rounded-full" />
//           </div>

//           <pre className="text-sm text-cyan-400">
// {`function twoSum(nums, target) {
//   const map = new Map();
//   for (let i = 0; i < nums.length; i++) {
//     const diff = target - nums[i];
//     if (map.has(diff)) return [map.get(diff), i];
//     map.set(nums[i], i);
//   }
// }`}
//           </pre>
//         </motion.div>
        
//       </section>

//       {/* STATS */}
//       <section className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center py-16 border-y border-slate-800 bg-[#070F21]">
//         {stats.map((s, i) => (
//           <div key={i}>
//             <div className="text-4xl font-black text-white">{s.value}</div>
//             <div className="text-xs uppercase tracking-widest text-slate-500">
//               {s.label}
//             </div>
//           </div>
//         ))}
//       </section>

//       {/* HOW IT WORKS */}
//       <section className="py-24 px-6 max-w-6xl mx-auto">
//         <h2 className="text-4xl font-bold text-white text-center mb-16">
//           How It Works
//         </h2>

//         <div className="grid md:grid-cols-3 gap-8">
//           {[
//             { step: "1", title: "Pick Challenge", icon: <Code /> },
//             { step: "2", title: "Solve in Editor", icon: <Zap /> },
//             { step: "3", title: "Earn XP & Rank", icon: <Trophy /> },
//           ].map((item, i) => (
//             <div key={i} className="bg-[#0F172A] border border-slate-800 rounded-2xl p-8 text-center hover:border-cyan-500 transition">
//               <div className="text-cyan-400 mb-4">{item.icon}</div>
//               <h3 className="text-white font-bold text-xl mb-2">{item.title}</h3>
//               <p className="text-slate-400 text-sm">
//                 Level up your coding skills step by step.
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* FEATURES */}
//       <section className="py-24 px-6 max-w-6xl mx-auto">
//         <h2 className="text-4xl font-bold text-white text-center mb-16">
//           Platform Features
//         </h2>

//         <div className="grid md:grid-cols-2 gap-8">
//           {features.map((f, i) => (
//             <div key={i} className="bg-[#0F172A] border border-slate-800 p-8 rounded-2xl hover:border-purple-500 transition">
//               <div className="mb-4">{f.icon}</div>
//               <h3 className="text-white font-bold text-xl mb-2">{f.title}</h3>
//               <p className="text-slate-400 text-sm">{f.desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* PREMIUM */}
//       <section className="py-24 text-center bg-gradient-to-b from-transparent to-[#070F21]">
//         <Crown className="mx-auto text-yellow-400 mb-6" size={40} />
//         <h2 className="text-4xl font-bold text-white mb-4">
//           Unlock Premium Challenges
//         </h2>
//         <p className="text-slate-400 mb-8">
//           Get unlimited submissions, advanced problems, and faster ranking.
//         </p>

//         <button
//           onClick={() => navigate("/auth/login")}
//           className="bg-gradient-to-r from-yellow-500 to-orange-500 px-10 py-4 rounded-full text-white font-bold shadow-xl hover:scale-105 transition"
//         >
//           Upgrade Now
//         </button>
//       </section>

//       {/* CTA */}
//       <section className="py-24 text-center">
//         <h2 className="text-5xl font-extrabold text-white mb-6">
//           Ready to Become a Better Developer?
//         </h2>
//         <button
//           onClick={() => navigate("/auth/login")}
//           className="bg-gradient-to-r from-indigo-600 to-cyan-500 px-12 py-5 rounded-full text-white font-bold shadow-2xl hover:scale-110 transition"
//         >
//           Create Free Account
//         </button>
//       </section>

//       {/* FOOTER */}
//       <footer className="border-t border-slate-800 py-10 text-center text-slate-500">
//         © 2026 CODE-CLASH. All Rights Reserved.
//       </footer>

//     </div>
//   );
// };

// export default LandingPage;