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

import pillar_1 from '../../static/audio/pillar_1.mp3';
import pillar_2 from '../../static/audio/pillar_2.mp3';
import pillar_3 from '../../static/audio/pillar_3.mp3';
import pillar_4 from '../../static/audio/pillar_4.mp3';
import pillar_5 from '../../static/audio/pillar_5.mp3';
import pillar_6 from '../../static/audio/pillar_6.mp3';

import video_1 from '../../static/videos/pillar_1.mp4';
import video_2 from '../../static/videos/pillar_2.mp4';
import video_3 from '../../static/videos/pillar_3.mp4';
import video_4 from '../../static/videos/pillar_4.mp4';
import video_5 from '../../static/videos/pillar_5.mp4';
import video_6 from '../../static/videos/pillar_6.mp4';

import '../../static/css/PillarsPage.css';   // ✅ Import styles

const audioMap = {
  "pillar_1.mp3": pillar_1,
  "pillar_2.mp3": pillar_2,
  "pillar_3.mp3": pillar_3,
  "pillar_4.mp3": pillar_4,
  "pillar_5.mp3": pillar_5,
  "pillar_6.mp3": pillar_6,
};

const videoMap = {
  "pillar_1.mp4": video_1,
  "pillar_2.mp4": video_2,
  "pillar_3.mp4": video_3,
  "pillar_4.mp4": video_4,
  "pillar_5.mp4": video_5,
  "pillar_6.mp4": video_6,
};

// 🔹 Section Component
const PillarSection = ({ sec, i, language, audioRefs, backgroundVideoRefs, sectionRefs, playingIndex, setPlayingIndex, progresses, setProgresses, volumeRef, toggleAudio, seekAudio, handleVolume }) => {
  const translation =
    sec.translations?.find((t) => t.language === language) ||
    sec.translations?.find((t) => t.language === 'en');
  if (!translation) return null;

  const extractH2Text = (html) => {
    const match = html.match(/<h2[^>]*>(.*?)<\/h2>/i);
    if (match && match[1]) {
      return match[1].replace(/<[^>]+>/g, '').trim();
    }
    return 'PILLARS';
  };

  const cleanText = (text) => text.replace(/<h2[^>]*>.*?<\/h2>/i, '').replace(/^\[[A-Z]{2}\]\s*/, '');

  const sectionTitle = extractH2Text(translation.text);
  const cleanedHtml = cleanText(translation.text);

  const sectionAudio = audioMap[sec.audioPath];
  const sectionVideo = videoMap[sec.videoPath];

  const [thumbHeight, setThumbHeight] = useState(20);
  const [thumbTop, setThumbTop] = useState(0);
  const scrollContentRef = useRef(null);

  const updateThumb = () => {
    if (!scrollContentRef.current) return;
    const el = scrollContentRef.current;
    const visibleRatio = el.clientHeight / el.scrollHeight;
    const newThumbHeight = Math.max(visibleRatio * el.clientHeight, 20);
    const scrollPercent = el.scrollTop / (el.scrollHeight - el.clientHeight);
    const newThumbTop = scrollPercent * (el.clientHeight - newThumbHeight);
    setThumbHeight(newThumbHeight);
    setThumbTop(newThumbTop);
  };

  useEffect(() => {
    const el = scrollContentRef.current;
    if (!el) return;
    updateThumb();
    el.addEventListener('scroll', updateThumb);
    window.addEventListener('resize', updateThumb);
    return () => {
      el.removeEventListener('scroll', updateThumb);
      window.removeEventListener('resize', updateThumb);
    };
  }, []);

  return (
    <section
      key={sec.section_key}
      className="pillar-section flex flex-col lg:flex-row items-center justify-center gap-10 p-8 relative"
      ref={(el) => (sectionRefs.current[i] = el)}
    >
      {sectionVideo && (
        <video
          ref={(el) => (backgroundVideoRefs.current[i] = el)}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover brightness-[0.15] rounded-3xl z-0 pointer-events-none"
          src={sectionVideo}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative z-10 w-full lg:w-1/2 max-h-[85vh] rounded-3xl bg-gradient-to-br from-black/40 to-black/60 dark:from-white/5 dark:to-white/10 border border-white/10 shadow-lg"
      >
        <div
          className="scrollable-content prose prose-invert max-w-none p-8 text-white font-poppins relative"
          onScroll={updateThumb}
          ref={scrollContentRef}
        >
          <h2 className="text-5xl font-playfair font-bold mb-6 tracking-wide text-yellow-400 drop-shadow-lg">
            {sectionTitle}
          </h2>
          <div dangerouslySetInnerHTML={{ __html: cleanedHtml }} className="relative z-10 text-lg leading-relaxed" />
        </div>

        {/* Custom Scrollbar */}
        <div className="scrollbar-track pointer-events-none">
          <div
            className="scrollbar-thumb"
            style={{ height: `${thumbHeight}px`, top: `${thumbTop}px`, pointerEvents: 'auto' }}
          />
        </div>
      </motion.div>

      {(sectionVideo || sectionAudio) && (
        <div className="relative z-10 w-full lg:w-1/2 flex flex-col items-center gap-6 rounded-3xl">
          {sectionVideo && (
            <video
              controls
              preload="metadata"
              className="w-full max-w-lg rounded-2xl shadow-xl border border-white/30"
              src={sectionVideo}
              playsInline
            />
          )}

          {sectionAudio && (
            <div className="audio-player w-full max-w-lg bg-black/30 p-4 rounded-2xl shadow-inner">
              <div className="audio-controls flex items-center gap-4">
                <button className="play-pause-btn text-2xl" onClick={() => toggleAudio(i)}>
                  {playingIndex === i ? '⏸' : '▶'}
                </button>
                <div className="progress-bar-container flex-1 h-2 bg-gray-600 rounded-full cursor-pointer" onClick={(e) => seekAudio(i, e)}>
                  <div className="progress-bar bg-yellow-400 h-2 rounded-full" style={{ width: `${(progresses[i] || 0) * 100}%` }} />
                </div>
                <div className="volume-container">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    defaultValue={volumeRef.current}
                    onChange={handleVolume}
                    className="volume-slider accent-yellow-400"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

const PillarsPage = () => {
  const [pillars, setPillars] = useState(null);
  const { language } = useContext(LanguageContext);
  const audioRefs = useRef([]);
  const backgroundVideoRefs = useRef([]);
  const volumeRef = useRef(0.2);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [progresses, setProgresses] = useState({});
  const sectionRefs = useRef([]);

  useEffect(() => {
    axios
      .get('http://localhost:8000/content/pillars')
      .then((res) => setPillars(res.data))
      .catch(() => toast.error('Failed to fetch pillars data'));
  }, []);

  useEffect(() => {
    if (!pillars?.sections) return;

    audioRefs.current = pillars.sections.map((section, i) => {
      const audioPath = section.audioPath;
      const src = audioMap[audioPath];
      if (src) {
        const audio = new Audio(src);
        audio.volume = volumeRef.current;
        audio.onended = () => setPlayingIndex(null);
        audio.ontimeupdate = () => {
          setProgresses((prev) => ({ ...prev, [i]: audio.currentTime / audio.duration || 0 }));
        };
        return audio;
      }
      return null;
    });
  }, [pillars]);

  const toggleAudio = (index) => {
    const audio = audioRefs.current[index];
    if (!audio) return;

    if (playingIndex === index) {
      audio.pause();
      setPlayingIndex(null);
    } else {
      if (playingIndex !== null && audioRefs.current[playingIndex]) {
        audioRefs.current[playingIndex].pause();
      }
      audio.play().catch(() => toast.error('Failed to play audio'));
      setPlayingIndex(index);
    }
  };

  const handleVolume = (e) => {
    const vol = parseFloat(e.target.value);
    volumeRef.current = vol;
    audioRefs.current.forEach((audio) => audio && (audio.volume = vol));
  };

  const seekAudio = (index, e) => {
    const audio = audioRefs.current[index];
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    audio.currentTime = percentage * audio.duration;
    setProgresses((prev) => ({ ...prev, [index]: percentage }));
  };

  return (
    <Layout>
      <Toaster />
      <div className="relative w-full min-h-screen overflow-x-hidden bg-gradient-to-b from-[#010101] via-[#101010] to-[#050505] text-white">
        <div className="fixed inset-0 z-0 opacity-10 bg-repeat pointer-events-none" style={{ backgroundImage: `url(${quran1})` }} />

        <Parallax speed={-10}>
          <motion.img src={calligraphy1} alt="Calligraphy" className="absolute top-10 left-10 w-32 sm:w-40 object-contain z-0" />
        </Parallax>
        <Parallax speed={10}>
          <motion.img src={calligraphy2} alt="Calligraphy 2" className="absolute bottom-10 right-10 w-36 sm:w-48 object-contain z-0" />
        </Parallax>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 space-y-16">
          {pillars?.sections?.map((sec, i) => (
            <PillarSection
              key={sec.section_key}
              sec={sec}
              i={i}
              language={language}
              audioRefs={audioRefs}
              backgroundVideoRefs={backgroundVideoRefs}
              sectionRefs={sectionRefs}
              playingIndex={playingIndex}
              setPlayingIndex={setPlayingIndex}
              progresses={progresses}
              setProgresses={setProgresses}
              volumeRef={volumeRef}
              toggleAudio={toggleAudio}
              seekAudio={seekAudio}
              handleVolume={handleVolume}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default PillarsPage;
