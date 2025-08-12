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

const PillarsPage = () => {
  const [pillars, setPillars] = useState(null);
  const { language } = useContext(LanguageContext);
  const audioRefs = useRef([]);
  const videoRefs = useRef([]);
  const backgroundVideoRefs = useRef([]);
  const volumeRef = useRef(0.2);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [progresses, setProgresses] = useState({});
  const sectionRefs = useRef([]);

  // Fetch data
  useEffect(() => {
    axios
      .get('http://localhost:8000/content/pillars')
      .then((res) => setPillars(res.data))
      .catch(() => toast.error('Failed to fetch pillars data'));
  }, []);

  // Initialize audio objects on pillars load
  useEffect(() => {
    if (!pillars?.sections) return;

    audioRefs.current = pillars.sections.map((section, i) => {
      const audioPath = section.audioPath;
      const src = audioMap[audioPath];
      if (src) {
        const audio = new Audio(src);
        audio.volume = volumeRef.current;
        audio.loop = false;
        audio.onended = () => setPlayingIndex(null);
        audio.ontimeupdate = () => {
          setProgresses((prev) => ({
            ...prev,
            [i]: audio.currentTime / audio.duration || 0,
          }));
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
    audioRefs.current.forEach(audio => {
      if (audio) audio.volume = vol;
    });
    toast(`🔊 Volume: ${(vol * 100).toFixed(0)}%`, { duration: 1200 });
  };

  // Seek audio progress by clicking on progress bar
  const seekAudio = (index, e) => {
    const audio = audioRefs.current[index];
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    audio.currentTime = percentage * audio.duration;
    setProgresses((prev) => ({
      ...prev,
      [index]: percentage,
    }));
  };

  const extractH2Text = (html) => {
    const match = html.match(/<h2[^>]*>(.*?)<\/h2>/i);
    if (match && match[1]) {
      return match[1].replace(/<[^>]+>/g, '').trim();
    }
    return 'PILLARS';
  };

  const cleanText = (text) => text.replace(/^\[[A-Z]{2}\]\s*/, '');

  // Scrollbar color animation based on scroll progress
  const handleScroll = (e) => {
    const el = e.target;
    const scrollPercent = el.scrollTop / (el.scrollHeight - el.clientHeight);
    const thumb = el.querySelector('.scrollbar-thumb');
    if (thumb) {
      // Map scrollPercent [0-1] to hue rotation 0-360deg for nice color cycling
      const hue = Math.floor(scrollPercent * 360);
      thumb.style.background = `linear-gradient(270deg, hsl(${hue}, 80%, 65%), hsl(${(hue + 60) % 360}, 80%, 65%), hsl(${(hue + 120) % 360}, 80%, 65%), hsl(${(hue + 180) % 360}, 80%, 65%))`;
      thumb.style.backgroundSize = '800% 800%';
    }
  };

  return (
    <Layout>
      <Toaster />
      {/* Scrollbar & custom styles */}
      <style>{`
        /* Section container separation */
        section.pillar-section {
          margin-bottom: 4rem;
          position: relative;
          border-radius: 1.5rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          background: rgba(0,0,0,0.45);
          overflow: hidden;
          backdrop-filter: saturate(180%) blur(20px);
          transition: box-shadow 0.3s ease;
        }
        section.pillar-section:hover {
          box-shadow: 0 15px 40px rgba(0,0,0,0.7);
        }

        /* Scrollable content with custom scrollbar */
        .scrollable-content {
          max-height: 85vh;
          overflow-y: auto;
          padding-right: 12px; /* space for scrollbar */
          position: relative;
          scrollbar-width: thin;
          scrollbar-color: transparent transparent; /* Hide default */
        }

        /* Hide native scrollbar for WebKit */
        .scrollable-content::-webkit-scrollbar {
          width: 12px;
        }
        .scrollable-content::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollable-content::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 12px;
          transition: background 0.3s ease;
        }

        /* Custom scrollbar track and thumb */
        .scrollbar-track {
          position: absolute;
          top: 0; bottom: 0; right: 4px;
          width: 8px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
        }
        .scrollbar-thumb {
          position: absolute;
          right: 4px;
          width: 8px;
          border-radius: 12px;
          background: linear-gradient(270deg, #ff6ec4, #7873f5, #4ade80, #facc15);
          background-size: 800% 800%;
          animation: scrollbarGradient 10s ease infinite;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        @keyframes scrollbarGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Audio player styles */
        .audio-player {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          user-select: none;
        }
        .audio-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
          width: 100%;
          max-width: 400px;
        }
        .play-pause-btn {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          border: none;
          color: white;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          font-size: 1.5rem;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(34, 197, 94, 0.6);
          transition: background 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .play-pause-btn:hover {
          background: linear-gradient(135deg, #16a34a, #15803d);
          box-shadow: 0 6px 14px rgba(22, 163, 74, 0.8);
        }
        .progress-bar-container {
          flex: 1;
          height: 8px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 9999px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #22c55e, #4ade80);
          border-radius: 9999px 0 0 9999px;
          transition: width 0.2s ease;
        }
        .volume-slider {
          width: 100px;
          accent-color: #22c55e;
          cursor: pointer;
        }
        .volume-container {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: #22c55e;
          font-weight: 600;
          user-select: none;
        }
      `}</style>

      <div className="relative w-full min-h-screen overflow-x-hidden bg-gradient-to-b from-[#010101] via-[#101010] to-[#050505] text-white dark:from-white dark:via-gray-200 dark:to-gray-100 dark:text-black">
        {/* Background Ornament */}
        <div
          className="fixed inset-0 z-0 opacity-10 bg-repeat pointer-events-none"
          style={{ backgroundImage: `url(${quran1})` }}
        />

        {/* Calligraphy Elements */}
        <Parallax speed={-10}>
          <motion.img
            src={calligraphy1}
            alt="Calligraphy"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 0.2, y: 0 }}
            transition={{ duration: 4, repeat: Infinity, repeatType: 'mirror' }}
            className="absolute top-10 left-10 w-32 sm:w-40 object-contain z-0"
          />
        </Parallax>

        <Parallax speed={10}>
          <motion.img
            src={calligraphy2}
            alt="Calligraphy 2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.2, y: 0 }}
            transition={{ duration: 4, repeat: Infinity, repeatType: 'mirror' }}
            className="absolute bottom-10 right-10 w-36 sm:w-48 object-contain z-0"
          />
        </Parallax>

        {/* Sections */}
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 space-y-16">
          {pillars?.sections?.map((sec, i) => {
            const translation =
              sec.translations?.find((t) => t.language === language) ||
              sec.translations?.find((t) => t.language === 'en');
            if (!translation) return null;

            const sectionTitle = extractH2Text(translation.text);
            const cleanedHtml = cleanText(translation.text);

            const sectionAudio = audioMap[sec.audioPath];
            const sectionVideo = videoMap[sec.videoPath];

            // Track scrollbar thumb height & position dynamically
            const [thumbHeight, setThumbHeight] = React.useState(20);
            const [thumbTop, setThumbTop] = React.useState(0);

            // Ref for scrollable content div
            const scrollContentRef = React.useRef(null);

            // Update scrollbar thumb on scroll & resize
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

            React.useEffect(() => {
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

            // Scrollbar color cycling based on scroll position
            const handleScrollForColor = (e) => {
              const el = e.target;
              const scrollPercent = el.scrollTop / (el.scrollHeight - el.clientHeight);
              const hue = Math.floor(scrollPercent * 360);
              const thumbEl = el.parentNode.querySelector('.scrollbar-thumb');
              if (thumbEl) {
                thumbEl.style.background = `linear-gradient(270deg, hsl(${hue}, 80%, 65%), hsl(${(hue + 60) % 360}, 80%, 65%), hsl(${(hue + 120) % 360}, 80%, 65%), hsl(${(hue + 180) % 360}, 80%, 65%))`;
                thumbEl.style.backgroundSize = '800% 800%';
              }
            };

            return (
              <section
                key={sec.section_key}
                className="pillar-section flex flex-col lg:flex-row items-center justify-center gap-10 p-8"
                ref={(el) => (sectionRefs.current[i] = el)}
              >
                {/* Background video (muted autoplay loop) */}
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

                {/* Text & audio container */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="relative z-10 w-full lg:w-1/2 max-h-[85vh] rounded-3xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-black/30 shadow-lg"
                >
                  {/* Scrollable content */}
                  <div
                    className="scrollable-content prose prose-invert dark:prose-dark max-w-none p-8 text-white dark:text-gray-100 relative"
                    onScroll={(e) => {
                      updateThumb();
                      handleScrollForColor(e);
                    }}
                    ref={scrollContentRef}
                  >
                    <h2 className="text-4xl font-serif font-bold mb-6 tracking-wide text-yellow-400 dark:text-emerald-600 relative z-10">
                      {sectionTitle}
                    </h2>
                    <div
                      dangerouslySetInnerHTML={{ __html: cleanedHtml }}
                      className="relative z-10"
                    />
                  </div>

                  {/* Custom Scrollbar */}
                  <div className="scrollbar-track pointer-events-none">
                    <div
                      className="scrollbar-thumb"
                      style={{
                        height: `${thumbHeight}px`,
                        top: `${thumbTop}px`,
                        pointerEvents: 'auto',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        const startY = e.clientY;
                        const startTop = thumbTop;

                        const onMouseMove = (moveEvent) => {
                          if (!scrollContentRef.current) return;
                          const deltaY = moveEvent.clientY - startY;
                          const maxTop =
                            scrollContentRef.current.clientHeight - thumbHeight;
                          let newTop = startTop + deltaY;
                          newTop = Math.max(0, Math.min(newTop, maxTop));
                          const scrollRatio = newTop / maxTop;
                          scrollContentRef.current.scrollTop =
                            scrollRatio *
                            (scrollContentRef.current.scrollHeight -
                              scrollContentRef.current.clientHeight);
                        };

                        const onMouseUp = () => {
                          document.removeEventListener('mousemove', onMouseMove);
                          document.removeEventListener('mouseup', onMouseUp);
                        };

                        document.addEventListener('mousemove', onMouseMove);
                        document.addEventListener('mouseup', onMouseUp);
                      }}
                    />
                  </div>
                </motion.div>

                {/* Video with controls & audio player */}
                <div className="relative z-10 w-full lg:w-1/2 flex flex-col items-center gap-6 rounded-3xl">
                  {/* Controlled Video Bar */}
                  {sectionVideo && (
                    <video
                      controls
                      preload="metadata"
                      className="w-full max-w-lg rounded-xl shadow-xl border border-white/30 dark:border-black/50"
                      src={sectionVideo}
                      muted={false}
                      playsInline
                    />
                  )}

                  {/* Audio Player */}
                  {sectionAudio && (
                    <div className="audio-player w-full max-w-lg">
                      <div className="audio-controls">
                        <button
                          className="play-pause-btn"
                          onClick={() => toggleAudio(i)}
                          aria-label={playingIndex === i ? 'Pause audio' : 'Play audio'}
                        >
                          {playingIndex === i ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 5v14l11-7L5 5z"
                              />
                            </svg>
                          )}
                        </button>
                        <div
                          className="progress-bar-container"
                          onClick={(e) => seekAudio(i, e)}
                          aria-label="Seek audio"
                          role="slider"
                          tabIndex={0}
                        >
                          <div
                            className="progress-bar"
                            style={{ width: `${(progresses[i] || 0) * 100}%` }}
                          />
                        </div>
                        <div className="volume-container" title="Volume">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9 4a.75.75 0 00-1.5 0v12a.75.75 0 001.5 0V4z" />
                            <path
                              fillRule="evenodd"
                              d="M13.28 5.72a.75.75 0 00-1.06 1.06 3.75 3.75 0 010 5.3.75.75 0 001.06 1.06 5.25 5.25 0 000-7.42z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            defaultValue={volumeRef.current}
                            onChange={handleVolume}
                            className="volume-slider"
                            aria-label="Volume slider"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};


export default PillarsPage;
