import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import axiosInstance from "../components/axiosInstance";

const MainContent = ({ selectedMenu }) => {
  const { authTokens } = useContext(AuthContext);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [moduleContent, setModuleContent] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!selectedMenu || selectedMenu.type !== "learning_path") {
      setModules([]);
      setSelectedModule(null);
      setModuleContent(null);
      return;
    }

    console.log(selectedMenu);

    const fetchModules = async () => {
      try {
        const res = await axiosInstance(authTokens.access_token).get(
          `/learning/learning_paths/${selectedMenu.id}/modules`
        );
        setModules(res.data);
        setSelectedModule(null);
        setModuleContent(null);
      } catch (err) {
        console.error("Error fetching modules:", err);
      }
    };

    fetchModules();
  }, [selectedMenu, authTokens]);

  useEffect(() => {
    if (!selectedModule) return;

    const fetchModuleDetails = async () => {
      try {
        const res = await axiosInstance(authTokens.access_token).get(
          `/users/module/${selectedModule.id}`
        );
        console.log("Module");
        console.log(res.data)
        console.log(selectedMenu);
        setModuleContent(res.data);
        setProgress(res.data.progress_percent || 0);
      } catch (err) {
        console.error("Error fetching module details:", err);
      }
    };

    fetchModuleDetails();
  }, [selectedModule, authTokens]);

  const updateProgress = async (newProgress) => {
    if (!selectedModule) return;
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

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-8 pt-24">
      {selectedMenu?.type === "learning_path" ? (
        <>
          {/* Sidebar Module List */}
          <aside className="w-full lg:w-1/4 bg-white border rounded-xl shadow-sm p-4 overflow-auto max-h-96 lg:max-h-[calc(100vh-7rem)]">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Modules</h2>
            {modules.length === 0 ? (
              <p className="text-gray-500">No modules found.</p>
            ) : (
              <ul className="space-y-3">
                {modules.map((mod) => (
                  <li key={mod.id}>
                    <button
                      onClick={() => setSelectedModule(mod)}
                      className={`w-full text-left p-3 rounded-lg transition duration-200 border hover:shadow-sm ${
                        selectedModule?.id === mod.id
                          ? "bg-blue-100 border-blue-300 text-blue-900 font-semibold"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      {mod.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-white border rounded-xl shadow-sm p-6 overflow-auto">
            {moduleContent ? (
              <>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  {moduleContent.title}
                </h1>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {moduleContent.description}
                </p>

                {/* Progress Tracker */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600">
                    Progress: <span className="font-semibold">{progress}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => updateProgress(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-gray-500 text-center">
                <p className="text-lg">Select a module to view its content</p>
              </div>
            )}
          </main>
        </>
      ) : (
        <div className="w-full bg-white border rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {selectedMenu?.title}
          </h1>
          <p className="text-gray-600">Content for menu: {selectedMenu?.title}</p>
        </div>
      )}
    </div>
  );
};

export default MainContent;
