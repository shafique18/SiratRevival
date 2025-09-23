import React from "react";
import Link from "next/link"; // or react-router Link depending on your setup

const ScholarCard = ({ scholar }) => {
  return (
    <div className="card p-4 rounded-lg shadow-sm bg-white dark:bg-gray-800">
      <div className="flex items-center space-x-4">
        <img src={scholar.photo_url || "/default-avatar.png"} alt={scholar.name} className="w-16 h-16 rounded-full object-cover" />
        <div>
          <h3 className="text-lg font-semibold">{scholar.name}</h3>
          <p className="text-sm text-gray-500">{scholar.country}</p>
          <p className="mt-1 text-sm line-clamp-2">{scholar.bio}</p>
        </div>
      </div>
      <div className="mt-3">
        <Link href={`/scholar/${scholar.id}`}>
          <a className="text-indigo-600 hover:underline">View profile →</a>
        </Link>
      </div>
    </div>
  );
};

export default ScholarCard;
