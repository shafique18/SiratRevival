import React, { useContext, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import AuthContext from "../context/AuthContext";
import axiosInstance from "../components/axiosInstance";
import {
  ChevronDown,
  CheckCircle,
  PlayCircle,
  StickyNote,
  FileQuestion,
} from "lucide-react";
import Modal from "./Modal";

const MainContent = ({ selectedMenu }) => {
  const { authTokens } = useContext(AuthContext);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [moduleContent, setModuleContent] = useState(null);
  const [progress, setProgress] = useState(0);
  const [hasReported80, setHasReported80] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [videoDuration, setVideoDuration] = useState(0);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [activeContent, setActiveContent] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const playerRef = useRef(null);
  const isValidLearningPath =
    selectedMenu?.type === "learning_path" && !selectedMenu?.children;

  // Fetch modules on menu change
  useEffect(() => {
    if (!isValidLearningPath) {
      setModules([]);
      setSelectedModule(null);
      setModuleContent(null);
      return;
    }

    const fetchModules = async () => {
      try {
        const res = await axiosInstance(authTokens.access_token).get(
          `/learning/learning_paths/${selectedMenu.id}/modules`
        );
        const modulesData = res.data || [];
        setModules(modulesData);
        if (modulesData.length > 0) {
          setSelectedModule(modulesData[0]);
          setShowToast(true);
        } else {
          setSelectedModule(null);
        }
      } catch (err) {
        console.error("Error fetching modules:", err);
      }
    };
    fetchModules();
  }, [selectedMenu, authTokens, isValidLearningPath]);

  // Auto-hide toast
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Fetch module content on module change
  useEffect(() => {
    if (!selectedModule) {
      setModuleContent(null);
      return;
    }
    const fetchModuleDetails = async () => {
      try {
        const res = await axiosInstance(authTokens.access_token).get(
          `/users/module/${selectedModule.id}`
        );
        const mod = res.data;
        setModuleContent(mod);
        setProgress(mod.progress_percent || 0);
        setHasReported80(mod.progress_percent >= 80);
        setExpandedSections({});
      } catch (err) {
        console.error("Error fetching module details:", err);
      }
    };
    fetchModuleDetails();
  }, [selectedModule, authTokens]);

  const updateProgress = async (newProgress) => {
    if (!selectedModule || newProgress <= progress) return;
    try {
      await axiosInstance(authTokens.access_token).post(
        `/users/progress/${selectedModule.id}`,
        { progress: newProgress }
      );
      setProgress(newProgress);
    } catch (err) {
      console.error("Error updating progress:", err);
    }
  };

  const handleProgress = (state) => {
    if (!videoDuration) return;
    const currentProgress = Math.floor(
      (state.playedSeconds / videoDuration) * 100
    );
    if (currentProgress >= 80 && !hasReported80) {
      updateProgress(80);
      setHasReported80(true);
    }
    if (currentProgress >= 100) {
      updateProgress(100);
    }
  };

  const handleDuration = (duration) => setVideoDuration(duration);

  const toggleSection = (index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const openModal = (type, content) => {
    setActiveContent(content);
    type === "quiz" ? setQuizModalOpen(true) : setNoteModalOpen(true);
  };

  const renderContentSection = (content, index) => {
    const isOpen = expandedSections[index];

    return (
      <div
        key={content.id}
        className="rounded-xl border shadow-sm mb-5 bg-white dark:bg-gray-800 dark:border-gray-700 overflow-hidden"
      >
        <button
          onClick={() => toggleSection(index)}
          className="flex items-center justify-between w-full p-4 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 text-left transition-colors"
          aria-expanded={isOpen}
          aria-controls={`section-content-${content.id}`}
        >
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            Section {index + 1}: {content.type === "video" ? "Video" : "Text"}
          </span>
          <ChevronDown
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""
              }`}
            aria-hidden="true"
          />
        </button>

        {isOpen && (
          <div
            id={`section-content-${content.id}`}
            className="p-4 space-y-4 text-gray-900 dark:text-gray-300"
          >
            {content.type === "video" ? (
              <ReactPlayer
                ref={playerRef}
                url={content.content_url}
                controls
                width="100%"
                height="100%"
                onProgress={handleProgress}
                onDuration={handleDuration}
              />
            ) : (
              <div
                className="prose max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: content.html_content }}
              />
            )}

            <div className="flex flex-wrap gap-3 mt-4">
              <button
                onClick={() => openModal("quiz", content)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm rounded bg-blue-100 dark:bg-blue-900 dark:text-blue-200 text-blue-800 hover:bg-blue-200 dark:hover:bg-blue-800 transition"
              >
                <FileQuestion className="w-4 h-4" />
                Take Quiz
              </button>
              <button
                onClick={() => openModal("note", content)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm rounded bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200 text-yellow-800 hover:bg-yellow-200 dark:hover:bg-yellow-800 transition"
              >
                <StickyNote className="w-4 h-4" />
                Write Note
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-8 pt-24 relative dark:bg-gray-900">
      {/* Toast Notification */}
      {showToast && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 dark:bg-blue-500 text-white text-sm px-4 py-2 rounded shadow-lg z-50 select-none">
          Automatically loaded first module
        </div>
      )}

      {isValidLearningPath ? (
        <>
          {/* Sidebar */}
          <aside className="w-full lg:w-1/4 border bg-white dark:bg-gray-800 rounded-xl shadow p-4 overflow-auto max-h-96 lg:max-h-[calc(100vh-7rem)]">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Modules
            </h2>
            {modules.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No modules found.</p>
            ) : (
              <ul className="space-y-3">
                {modules.map((mod) => (
                  <li key={mod.id}>
                    <button
                      onClick={() => setSelectedModule(mod)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition
                        ${selectedModule?.id === mod.id
                          ? "bg-blue-100 dark:bg-blue-700 border-blue-300 text-blue-900 dark:text-blue-200 font-semibold"
                          : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                        }
                      `}
                      aria-current={selectedModule?.id === mod.id ? "true" : "false"}
                    >
                      <span>{mod.title}</span>
                      {mod.progress_percent >= 80 ? (
                        <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
                      ) : (
                        <PlayCircle className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-sm p-6 overflow-auto max-h-[calc(100vh-7rem)]">
            {moduleContent ? (
              <>
                {/* Progress Bar */}
                <div className="mb-4 space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300 select-none">
                    Progress:{" "}
                    <span className="font-semibold">{progress}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => updateProgress(parseInt(e.target.value))}
                    className="w-full h-2 rounded-lg bg-gray-200 dark:bg-gray-700 accent-blue-600"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                    aria-label="Module progress"
                  />
                  <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 select-none">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {moduleContent.title}
                </h1>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  {moduleContent.description}
                </p>

                {moduleContent.contents && moduleContent.contents.length > 0 ? (
                  moduleContent.contents.map(renderContentSection)
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    No content available for this module.
                  </div>
                )}
              </>
            ) : (
              <div className="text-gray-500 dark:text-gray-400 text-center py-16">
                <p className="text-lg">Select a module to view its content</p>
              </div>
            )}
          </main>
        </>
      ) : (
        <div className="w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-sm p-6 text-gray-900 dark:text-gray-100">
          <h1 className="text-2xl font-bold mb-2">
            {selectedMenu?.title || "Learning Path"}
          </h1>
          <p>
            Please select a sub-menu (leaf node of type "learning_path") to view
            the modules.
          </p>
        </div>
      )}

      {/* Quiz Modal */}
      <Modal
        isOpen={quizModalOpen}
        onClose={() => setQuizModalOpen(false)}
        title="Quiz Section"
      >
        <p>This is a quiz related to the content:</p>
        <pre className="whitespace-pre-wrap">{JSON.stringify(activeContent, null, 2)}</pre>
      </Modal>

      {/* Note Modal */}
      <Modal
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        title="Notes Section"
      >
        <p>You can write a reflection or note here.</p>
      </Modal>
    </div>
  );
};

export default MainContent;
