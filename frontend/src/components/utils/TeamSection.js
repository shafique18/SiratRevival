import React, { useEffect, useState } from 'react';
import TeamMemberCard from './TeamMemberCard';
import { useTranslation } from "react-i18next";

export default function TeamSection() {
  const [teamMembers, setTeamMembers] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    fetch('http://localhost:8000/users/team')
      .then((res) => res.json())
      .then((data) => setTeamMembers(data))
      .catch((err) => console.error('Failed to load team members:', err));
  }, []);

  return (
    <section className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 sm:p-12 space-y-8">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white">
        👥 {t("team_Section_title")}
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {teamMembers.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </section> 
  );
}
