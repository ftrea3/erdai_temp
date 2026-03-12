import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronRight, Cpu, Scan, Network, Zap, Award, MapPin, ArrowUpRight, Menu, X, BrainCircuit, Database, Code } from 'lucide-react';

// --- 3D COMPONENT: INTERACTIVE NEURAL SEED ---
function NeuralSeed() {
  const mountRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    let scene, camera, renderer, animationId, particles, innerMesh;
    let mouseX = 0;
    let mouseY = 0;

    const initThree = () => {
      if (!isMounted || !mountRef.current || !window.THREE) return;
      const THREE = window.THREE;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.z = 8;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      
      mountRef.current.innerHTML = '';
      mountRef.current.appendChild(renderer.domElement);

      // Inner Glowing Core (The "AI Core")
      const innerGeo = new THREE.IcosahedronGeometry(1.5, 2);
      const innerMat = new THREE.MeshBasicMaterial({
        color: 0x059669,
        wireframe: true,
        transparent: true,
        opacity: 0.15
      });
      innerMesh = new THREE.Mesh(innerGeo, innerMat);
      scene.add(innerMesh);

      // Outer Neural Particles
      const particlesGeo = new THREE.BufferGeometry();
      const particleCount = 700;
      const posArray = new Float32Array(particleCount * 3);
      
      for(let i = 0; i < particleCount * 3; i+=3) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const radius = 2 + Math.random() * 0.8;

        posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
        posArray[i+1] = radius * Math.sin(phi) * Math.sin(theta);
        posArray[i+2] = radius * Math.cos(phi);
      }

      particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      
      // Custom circular texture for particles
      const canvas = document.createElement('canvas');
      canvas.width = 16; canvas.height = 16;
      const context = canvas.getContext('2d');
      const gradient = context.createRadialGradient(8, 8, 0, 8, 8, 8);
      gradient.addColorStop(0, 'rgba(52, 211, 153, 1)');
      gradient.addColorStop(1, 'rgba(52, 211, 153, 0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 16, 16);
      const texture = new THREE.CanvasTexture(canvas);

      const particlesMat = new THREE.PointsMaterial({
        size: 0.1,
        map: texture,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      particles = new THREE.Points(particlesGeo, particlesMat);
      scene.add(particles);

      // Mouse Interaction
      const handleMouseMove = (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      };
      window.addEventListener('mousemove', handleMouseMove);

      const animate = () => {
        if (!isMounted) return;
        animationId = requestAnimationFrame(animate);
        
        const time = Date.now() * 0.0005;
        
        // Base Rotation
        innerMesh.rotation.y = time * 0.5;
        innerMesh.rotation.x = time * 0.2;
        particles.rotation.y = time * 0.3;
        particles.rotation.z = time * 0.1;
        
        // Interactive Camera Movement (Parallax effect)
        camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 1.5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
      };

      animate();

      const handleResize = () => {
         if (!mountRef.current || !camera || !renderer) return;
         const newWidth = mountRef.current.clientWidth;
         const newHeight = mountRef.current.clientHeight;
         camera.aspect = newWidth / newHeight;
         camera.updateProjectionMatrix();
         renderer.setSize(newWidth, newHeight);
      };
      window.addEventListener('resize', handleResize);
    };

    if (!window.THREE) {
      let script = document.querySelector('script[src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"]');
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        document.head.appendChild(script);
      }
      script.addEventListener('load', initThree);
    } else {
      initThree();
    }

    return () => {
      isMounted = false;
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', () => {});
      if (renderer && mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}

// --- MAIN APPLICATION ---
export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const yOffset = useTransform(scrollYProgress, [0, 1], [0, 200]);

  useEffect(() => {
    // Injecting modern tech fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Injecting custom animations for text gradient
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes gradient-x {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .animate-gradient-x {
        background-size: 200% auto;
        animation: gradient-x 4s linear infinite;
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div 
      className="min-h-screen bg-[#050505] text-[#ededed] selection:bg-[#10b981] selection:text-white overflow-x-hidden relative" 
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Background Tech Grid */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
        }}
      />

      {/* Ambient Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[60%] md:w-[40%] md:h-[40%] bg-emerald-900/20 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] md:w-[30%] md:h-[30%] bg-[#064e3b]/20 rounded-full blur-[80px] pointer-events-none z-0"></div>

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center"
          >
            {/* Logo - CSS Hilesi ile beyaz arka plan silindi, renkler parlatıldı */}
            <div className="h-12 w-40 sm:h-16 sm:w-48 relative flex items-center transition-transform hover:scale-105">
              <img 
                src="https://i.hizliresim.com/7jk2k73.png" 
                alt="ERDAI Logo" 
                className="object-contain w-full h-full"
                style={{ 
                  filter: 'invert(1) hue-rotate(180deg) brightness(1.8) contrast(1.2)', 
                  mixBlendMode: 'screen' 
                }}
              />
            </div>
          </motion.div>
          
          {/* Desktop Menu */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="hidden md:flex gap-8 text-sm font-medium text-white/60 items-center"
          >
            <a href="#about" className="hover:text-emerald-400 transition-colors">Hakkımızda</a>
            <a href="#expertise" className="hover:text-emerald-400 transition-colors">Uzmanlıklarımız</a>
            <a href="#fatges" className="hover:text-emerald-400 transition-colors">Projelerimiz</a>
            <a href="#achievements" className="hover:text-emerald-400 transition-colors">Başarılarımız</a>
            <a href="#contact" className="text-sm font-medium bg-white/10 border border-white/10 text-white px-5 py-2 rounded-full hover:bg-emerald-500 hover:border-emerald-500 hover:text-black transition-all duration-300">
              İletişime Geç
            </a>
          </motion.div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white/80 hover:text-emerald-400 transition-colors p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0a0a0a] border-b border-white/10 overflow-hidden"
            >
              <div className="flex flex-col px-6 py-4 gap-4 text-sm font-medium text-white/70">
                <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-emerald-400">Hakkımızda</a>
                <a href="#expertise" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-emerald-400">Uzmanlıklarımız</a>
                <a href="#fatges" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-emerald-400">Projelerimiz (FATGES)</a>
                <a href="#achievements" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-emerald-400">Başarılarımız</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 1. HERO SECTION (Genel AI & Tech) */}
      <section id="about" className="relative pt-32 pb-20 lg:pt-0 lg:pb-0 min-h-screen flex items-center z-10">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center w-full flex-col-reverse flex lg:grid">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 text-center lg:text-left mt-8 lg:mt-0"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide uppercase mb-6 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              YAPAY ZEKA & BİLİŞİM
            </div>
            
            <h1 className="text-7xl sm:text-8xl lg:text-9xl font-black leading-none tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-emerald-600 animate-gradient-x" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              ERDAI
            </h1>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Geleceğin Bilişim Zekası.
            </h2>
            
            <p className="text-base lg:text-lg text-white/60 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light">
              ERDAI, karmaşık problemleri yapay zeka ve ileri seviye yazılım mimarisiyle çözer. Görüntü işleme, veri analitiği ve otonom sistemler inşa eden yenilikçi teknoloji merkezi.
            </p>
            
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start">
              <a href="#expertise" className="group flex justify-center items-center gap-2 bg-emerald-500 text-black px-8 py-4 rounded-full font-semibold hover:bg-emerald-400 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)]">
                Neler Yapıyoruz?
              </a>
              <a href="#fatges" className="group flex justify-center items-center gap-2 bg-transparent text-white border border-white/20 px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all duration-300">
                Projelerimiz <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>
          </motion.div>

          {/* 3D Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative h-[40vh] sm:h-[50vh] lg:h-[80vh] w-full"
          >
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#050505] via-transparent to-transparent lg:block hidden pointer-events-none"></div>
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050505] via-transparent to-transparent block lg:hidden pointer-events-none"></div>
            <NeuralSeed />
          </motion.div>

        </div>
      </section>

      {/* 2. EXPERTISE SECTION (Genel Yetenekler) */}
      <section id="expertise" className="py-24 relative z-10 border-t border-white/5 bg-black/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold tracking-widest text-emerald-500 uppercase mb-3">Teknoloji Altyapımız</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Uzmanlık Alanlarımız
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.4 }}
              className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-8 hover:bg-emerald-500/5 transition-all group shadow-lg hover:shadow-emerald-900/20"
            >
              <BrainCircuit className="text-emerald-400 mb-6 w-10 h-10 group-hover:scale-110 transition-transform" />
              <h4 className="text-xl font-bold text-white mb-3">Yapay Zeka Modelleri</h4>
              <p className="text-sm text-white/50 leading-relaxed">Özelleştirilmiş derin öğrenme (Deep Learning) ve makine öğrenmesi algoritmalarıyla sektörel problemlere akıllı çözümler üretiyoruz.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-8 hover:bg-emerald-500/5 transition-all group shadow-lg hover:shadow-emerald-900/20"
            >
              <Scan className="text-emerald-400 mb-6 w-10 h-10 group-hover:scale-110 transition-transform" />
              <h4 className="text-xl font-bold text-white mb-3">Bilgisayarlı Görü</h4>
              <p className="text-sm text-white/50 leading-relaxed">Görüntü işleme teknolojileriyle objeleri, hastalıkları ve desenleri milisaniyeler içinde yüksek doğrulukla tespit ediyoruz.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-8 hover:bg-emerald-500/5 transition-all group sm:col-span-2 lg:col-span-1 shadow-lg hover:shadow-emerald-900/20"
            >
              <Code className="text-emerald-400 mb-6 w-10 h-10 group-hover:scale-110 transition-transform" />
              <h4 className="text-xl font-bold text-white mb-3">Özel Yazılım Mimarisi</h4>
              <p className="text-sm text-white/50 leading-relaxed">Kurumlara özel, bulut tabanlı, ölçeklenebilir ve yüksek performanslı Bilişim Sistemleri tasarlayıp hayata geçiriyoruz.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. FATGES SECTION - BENTO GRID (Agriculture Project) */}
      <section id="fatges" className="py-24 relative z-10 border-t border-white/5 bg-black/50 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="mb-16 md:flex justify-between items-end">
            <div>
              <h2 className="text-xs font-bold tracking-widest text-emerald-500 uppercase mb-3">Amiral Gemisi Projemiz</h2>
              <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Çiftçinin <span className="text-white/40">Dijital Zekası</span>
              </h3>
            </div>
            <p className="text-white/50 max-w-md mt-6 md:mt-0 text-sm leading-relaxed">
              ERDAI'nin yapay zeka gücünü tarımla buluşturan inovasyonu. FATGES, tarlanızdaki her yaprağı analiz eder, hastalıkları henüz yayılmadan tespit eder.
            </p>
          </div>

          {/* BENTO GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main FATGES Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-2 bg-white/[0.02] border border-white/10 rounded-[2rem] p-6 sm:p-10 relative overflow-hidden group hover:bg-white/[0.04] transition-all shadow-lg hover:shadow-emerald-900/20"
            >
              <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-colors duration-700 pointer-events-none"></div>
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
                  <div className="bg-white p-4 rounded-2xl w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                    <img src="https://i.hizliresim.com/1kkgyxt.png" alt="FATGES Logo" className="w-full h-full object-contain" />
                  </div>
                  <div className="bg-black/50 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-2 text-xs font-mono text-emerald-400 self-start sm:self-auto">
                    <Zap size={14} /> Model: Aktif
                  </div>
                </div>

                <div>
                  <h4 className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>FATGES</h4>
                  <p className="text-sm sm:text-base text-white/60 leading-relaxed max-w-lg mb-8">
                    Bitki hastalıklarını milisaniyeler içinde tespit eden otonom teşhis sistemi. Ziraat mühendisliğinin bilgi birikimini cebinize taşıyan akıllı tarım asistanınız.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-white/5 bg-black/40 p-4 rounded-xl flex items-center gap-4">
                      <Scan className="text-emerald-400" size={24} />
                      <div>
                        <div className="text-white text-sm font-semibold">Erken Teşhis</div>
                        <div className="text-[11px] text-white/40 mt-0.5">Görüntü İşleme AI</div>
                      </div>
                    </div>
                    <div className="border border-white/5 bg-black/40 p-4 rounded-xl flex items-center gap-4">
                      <Network className="text-emerald-400" size={24} />
                      <div>
                        <div className="text-white text-sm font-semibold">Veri Ağı</div>
                        <div className="text-[11px] text-white/40 mt-0.5">Bulut Entegrasyonu</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Side Cards Container */}
            <div className="flex flex-col gap-6 lg:col-span-1">
              {/* Side Card 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-8 flex-1 flex flex-col justify-center relative overflow-hidden group shadow-lg hover:shadow-emerald-900/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <h5 className="text-4xl font-light text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>%98.4</h5>
                <div className="text-sm text-emerald-400 font-medium mb-2">Doğruluk Oranı</div>
                <p className="text-xs text-white/40">Derin öğrenme modelimizin hastalık tespitindeki başarı metriği.</p>
              </motion.div>

              {/* Side Card 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-8 flex-1 flex flex-col justify-center relative overflow-hidden group hover:border-emerald-500/30 transition-all shadow-lg hover:shadow-emerald-900/20"
              >
                <Cpu className="text-white/20 mb-4 group-hover:text-emerald-400 transition-colors" size={32} />
                <h5 className="text-lg font-semibold text-white mb-2">Edge Computing</h5>
                <p className="text-xs text-white/40">İnternet bağlantısının zayıf olduğu tarlalarda bile cihaz üzerinde anlık veri analizi.</p>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. ACHIEVEMENTS SECTION */}
      <section id="achievements" className="py-24 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 order-2 lg:order-1"
            >
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="text-emerald-500 flex-shrink-0" size={20} />
                <span className="text-xs font-medium text-white/60 tracking-wider">BOĞAZİÇİ TEKNOPARK BATMAN GO</span>
              </div>
              
              <h3 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                İnovasyonumuz <br/>
                <span className="text-white/40">Ödüllendirildi.</span>
              </h3>
              
              <div className="pl-6 border-l-2 border-emerald-500/30 relative">
                <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-[7px] top-0 shadow-[0_0_10px_#10b981]"></div>
                <h4 className="text-lg sm:text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <Award className="text-yellow-500 flex-shrink-0" size={20} /> Demo Day 2.lik Ödülü
                </h4>
                <p className="text-white/50 leading-relaxed text-sm mb-6">
                  FATGES projemiz, yenilikçi altyapısı ve tarıma getirdiği pratik çözümle jürinin takdirini topladı ve 40.000 TL'lik ödüle layık görüldü. Ar-Ge çalışmalarımıza Teknopark bünyesinde hız kesmeden devam ediyoruz.
                </p>
                <div className="text-xs font-mono text-white/30">ERDAI KURUCU EKİP / 2024</div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:col-span-7 relative order-1 lg:order-2"
            >
              {/* Image Container with Cyberpunk/Tech Frame */}
              <div className="relative p-1 bg-gradient-to-b from-white/10 to-transparent rounded-2xl">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur opacity-50"></div>
                <div className="relative rounded-xl overflow-hidden bg-black filter grayscale hover:grayscale-0 transition-all duration-700">
                  <img 
                    src="https://i.hizliresim.com/h48p8cf.png" 
                    alt="ERDAI Demo Day Award" 
                    className="w-full h-auto object-cover opacity-80 hover:opacity-100 transition-opacity duration-700 mix-blend-luminosity hover:mix-blend-normal"
                  />
                  
                  {/* Digital Overlay Details */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/70 rounded hidden sm:block">REC</span>
                    <span className="px-2 py-1 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-[10px] font-mono text-emerald-400 rounded">ACHIEVEMENT_UNLOCKED</span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#020202] pt-16 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16">
            
            <div className="flex flex-col gap-6 w-full md:w-1/3 text-center md:text-left items-center md:items-start">
              {/* Footer Logo - Same CSS Magic applied here */}
              <div className="h-16 w-52 relative flex items-center">
                <img 
                  src="https://i.hizliresim.com/7jk2k73.png" 
                  alt="ERDAI Logo" 
                  className="object-contain w-full h-full"
                  style={{ 
                    filter: 'invert(1) hue-rotate(180deg) brightness(1.5) contrast(1.2)', 
                    mixBlendMode: 'screen' 
                  }} 
                />
              </div>
              <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                Yapay zeka ve bilişim teknolojileri üreten inovasyon merkezi. Fikirden algoritmaya, algoritmadan geleceğe.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-12 text-sm w-full md:w-auto justify-center md:justify-end">
              <div className="flex flex-col gap-3 min-w-[120px]">
                <span className="text-white font-semibold mb-2">Şirket</span>
                <a href="#about" className="text-white/50 hover:text-emerald-400 transition-colors">Hakkımızda</a>
                <a href="#expertise" className="text-white/50 hover:text-emerald-400 transition-colors">Uzmanlıklarımız</a>
                <a href="#" className="text-white/50 hover:text-emerald-400 transition-colors">İletişim</a>
              </div>
              <div className="flex flex-col gap-3 min-w-[120px]">
                <span className="text-white font-semibold mb-2">Projeler & Ar-Ge</span>
                <a href="#fatges" className="text-white/50 hover:text-emerald-400 transition-colors">FATGES</a>
                <a href="#achievements" className="text-white/50 hover:text-emerald-400 transition-colors">Teknopark</a>
              </div>
            </div>

          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/30 font-mono text-center sm:text-left">
            <p>© {new Date().getFullYear()} ERDAI Yapay Zeka ve Bilişim Teknolojileri. Tüm Hakları Saklıdır.</p>
            <p className="flex items-center gap-2 justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Sistem Durumu: Çevrimiçi
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
