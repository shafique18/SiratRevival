import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const BismillahSection = ({ navbarHeight, onHide }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onHide(); // Notify Layout when hidden
    }, 2000);

    return () => clearTimeout(timer);
  }, [onHide]);

  if (!visible) return null;

  return (
    <div
      className="w-full bg-white dark:bg-gray-800 py-2 border-b border-gray-200 dark:border-gray-700 text-center fixed left-0 right-0 z-50 transition-all duration-500"
      style={{ top: navbarHeight }}
    >
      <div className="flex flex-wrap justify-center items-center gap-4 px-4">
        <span className="text-gray-700 dark:text-gray-300 text-base md:text-lg italic">
          {t("bismillah")}
        </span>
        <span className="text-green-700 dark:text-green-400 text-xl md:text-2xl font-arabic leading-relaxed tracking-widest">
          بِسْمِ ٱللّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </span>
      </div>
    </div>
  );
};

export default BismillahSection;
