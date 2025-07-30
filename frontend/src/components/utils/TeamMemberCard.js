import React from 'react';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import avatar from "../../static/images/avatar.png";

const platformIcons = {
  linkedin: FaLinkedin,
  github: FaGithub,
  twitter: FaTwitter,
};

export default function TeamMemberCard({ member }) {
  const { name, role, image, description, social_links = [] } = member;

  return (
    <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-6 shadow-md text-center flex flex-col items-center space-y-4 max-w-xs w-full mx-auto transition hover:shadow-xl">
      <img
        src={image != 'NA' || avatar }
        alt={`Photo of ${name}`}
        className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
        loading="lazy"
      />
      <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{name}</h4>
      <p className="text-md text-gray-700 dark:text-gray-300">{role}</p>
      <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
      <div className="flex gap-4 mt-2 justify-center">
        {social_links.map((social, i) => {
          const Icon = platformIcons[social.platform];
          return Icon ? (
            <a
              key={i}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${name}'s ${social.platform}`}
              className="text-gray-600 dark:text-gray-300 hover:text-yellow-400 transition-colors"
            >
              <Icon className="w-5 h-5" />
            </a>
          ) : null;
        })}
      </div>
    </div>
  );
}
