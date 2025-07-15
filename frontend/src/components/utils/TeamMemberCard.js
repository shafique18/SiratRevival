import React from 'react';
import {
  FaLinkedin,
  FaGithub,
  FaTwitter,
} from 'react-icons/fa';

const platformIcons = {
  linkedin: FaLinkedin,
  github: FaGithub,
  twitter: FaTwitter,
};

export default function TeamMemberCard({ name, role, image, description, socialLinks }) {
  return (
    <div className="group perspective">
      <div className="relative w-full h-80 transform-style preserve-3d transition-transform duration-700 group-hover:rotate-y-180">
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden bg-gray-100 dark:bg-gray-700 rounded-2xl p-6 shadow-md text-center flex flex-col items-center justify-center">
          <img
            src={image}
            alt={name}
            className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-white dark:border-gray-800 shadow"
          />
          <h4 className="text-lg font-semibold">{name}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">{role}</p>
        </div>

        {/* Back */}
        <div className="absolute w-full h-full rotate-y-180 backface-hidden bg-indigo-500 dark:bg-indigo-700 rounded-2xl p-6 shadow-md text-center text-white flex flex-col items-center justify-center space-y-2">
          <p className="text-sm">{description}</p>
          <div className="flex gap-4 mt-2">
            {(socialLinks || []).map((social, i) => {
              const Icon = platformIcons[social.platform];
              return Icon ? (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-300 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ) : null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
