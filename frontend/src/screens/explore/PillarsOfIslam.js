// Imports
import React, { useEffect, useState, useRef, useContext } from 'react';
import Layout from '../../components/layout/Layout';
import axios from 'axios';
import LanguageContext from '../../context/LanguageContext';
import { motion } from 'framer-motion';
import { Parallax } from 'react-scroll-parallax';
import { Toaster, toast } from 'react-hot-toast';

import quran1 from "../../static/images/quran1.jpg";
import calligraphy1 from '../../static/images/calligraphy1.png';
import calligraphy2 from '../../static/images/calligraphy2.png';

// Audio and video imports
const audioContext = require.context('../../static/audio', false, /\.mp3$/);
const quranAudioFiles = audioContext.keys().map(audioContext);
const videoContext = require.context('../../static/videos', false, /\.mp4$/);
const videoImports = videoContext.keys().map(videoContext);

const PillarsPage = () => {
  const [pillars, setPillars] = useState(null);
  const { language } = useContext(LanguageContext);
  const audioRefs = useRef([]);
  const volumeRef = useRef(0.05);
  const backgroundAudioRef = useRef(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(true);
  const canvasRef = useRef(null);
  const audioAnalyserRef = useRef(null);
  const sectionRefs = useRef([]);

  useEffect(() => {
    axios
      .get('http://localhost:8000/content/pillars')
      .then((res) => setPillars(res.data))
      .catch(() => toast.error('Failed to fetch pillars data'));
  }, []);

  useEffect(() => {
    if (!pillars?.sections) return;
    audioRefs.current = pillars.sections.map(() => new Audio());
  }, [pillars]);

  // Play one random background audio per session
  useEffect(() => {
    const playInitialAudio = () => {
      if (backgroundAudioRef.current) return;

      const randomAudio = quranAudioFiles[Math.floor(Math.random() * quranAudioFiles.length)];
      const audio = new Audio(randomAudio);
      audio.loop = true;
      audio.volume = 0;
      fadeInAudio(audio);
      backgroundAudioRef.current = audio;

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaElementSource(audio);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      audioAnalyserRef.current = analyser;

      drawVisualizer(analyser);

      document.removeEventListener('click', playInitialAudio);
      document.removeEventListener('scroll', playInitialAudio);
    };

    document.addEventListener('click', playInitialAudio);
    document.addEventListener('scroll', playInitialAudio);

    return () => {
      document.removeEventListener('click', playInitialAudio);
      document.removeEventListener('scroll', playInitialAudio);
    };
  }, []);

  const fadeInAudio = (audio) => {
    audio.play().catch(() => toast.error('Background audio failed'));
    let vol = 0;
    const interval = setInterval(() => {
      if (vol < 0.1) {
        vol += 0.01;
        audio.volume = vol;
      } else {
        clearInterval(interval);
      }
    }, 100);
  };

  const drawVisualizer = (analyser) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      dataArray.forEach((value) => {
        const barHeight = value;
        ctx.fillStyle = `rgba(255, 255, 255, ${value / 255})`;
        ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
        x += barWidth + 1;
      });
    };
    draw();
  };

  const handleVolume = (e) => {
    const vol = parseFloat(e.target.value);
    volumeRef.current = vol;
    audioRefs.current.forEach((audio) => (audio.volume = vol));
    if (backgroundAudioRef.current) backgroundAudioRef.current.volume = vol * 0.6;
    toast(`🔊 Volume: ${(vol * 100).toFixed(0)}%`, { duration: 1200 });
  };

  const toggleAudio = () => {
    if (backgroundAudioRef.current) {
      if (backgroundAudioRef.current.paused) {
        backgroundAudioRef.current.play();
        setIsAudioPlaying(true);
      } else {
        backgroundAudioRef.current.pause();
        setIsAudioPlaying(false);
      }
    }
  };

  return (
    <Layout>
      <div className="relative w-full bg-gradient-to-b from-[#020202] via-[#0a0a0a] to-black text-white min-h-screen overflow-x-hidden">
        <canvas
          ref={canvasRef}
          width={window.innerWidth}
          height={100}
          className="fixed top-0 left-0 z-40 opacity-10 pointer-events-none"
        />

        <div
          className="fixed inset-0 z-0 opacity-10 bg-repeat pointer-events-none"
          style={{ backgroundImage: `url(${quran1})` }}
        />

        {/* Calligraphy */}
        <Parallax speed={-10}>
          <div className="absolute z-0 top-10 left-5 w-40 h-40 opacity-15">
            <img src={calligraphy1} className="w-full h-full object-contain" alt="Calligraphy" />
          </div>
        </Parallax>

        <Parallax speed={5}>
          <div className="absolute z-0 bottom-10 right-5 w-48 h-48 opacity-15">
            <img src={calligraphy2} className="w-full h-full object-contain" alt="Calligraphy" />
          </div>
        </Parallax>

        {pillars?.sections?.map((sec, i) => {
          const translation = sec.translations?.find((t) => t.language === language)
            || sec.translations?.find((t) => t.language === 'en');
          if (!translation) return null;

          return (
            <section
              key={sec.section_key}
              ref={(el) => (sectionRefs.current[i] = el)}
              className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover brightness-[0.3] z-0"
                src={videoImports[i % videoImports.length]}
              />

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative z-10 max-w-4xl bg-white/5 backdrop-blur-xl p-6 sm:p-10 rounded-2xl text-white text-center border border-white/20 shadow-2xl"
                style={{
                  boxShadow: `0 0 30px rgba(0, 255, 255, 0.1)`,
                  border: "1px solid rgba(0,255,255,0.1)",
                  animation: "glowPulse 4s ease-in-out infinite"
                }}
              >
                <h2 className="text-4xl sm:text-5xl font-semibold mb-4 tracking-wide">{sec.title}</h2>
                <div
                  className="prose dark:prose-invert prose-lg max-w-none text-white"
                  dangerouslySetInnerHTML={{ __html: translation.text }}
                />
              </motion.div>
            </section>
          );
        })}

        {/* Volume & Audio Control */}
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4 bg-black/60 backdrop-blur-md px-5 py-2 rounded-full shadow-lg">
          <button
            onClick={toggleAudio}
            className="text-sm bg-white/10 px-3 py-1 rounded hover:bg-white/20"
          >
            {isAudioPlaying ? '⏸ Pause Audio' : '▶️ Play Audio'}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm opacity-80">🔉</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              defaultValue={volumeRef.current}
              onChange={handleVolume}
              className="w-32 h-2 appearance-none rounded bg-gradient-to-r from-green-400 to-blue-500 accent-white"
            />
          </div>
        </div>

        <style jsx>{`
          @keyframes glowPulse {
            0% {
              box-shadow: 0 0 10px rgba(0,255,255,0.1);
            }
            50% {
              box-shadow: 0 0 30px rgba(0,255,255,0.4);
            }
            100% {
              box-shadow: 0 0 10px rgba(0,255,255,0.1);
            }
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default PillarsPage;
