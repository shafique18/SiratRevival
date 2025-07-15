import React, { useState } from "react";
import Layout from '../../components/layout/Layout';
import SideNav from "../../components/layout/SideNav";
import MainContent from "../../components/layout/MainContent";

export default function HomeAdult() {
  const [selectedMenu, setSelectedMenu] = useState(null);

  return (
    <Layout>
      <div className="flex w-full h-full overflow-hidden">
        <SideNav onSelectMenu={setSelectedMenu} />
        <div className="flex-1 overflow-auto">
          <MainContent selectedMenu={selectedMenu} />
        </div>
      </div>
    </Layout>
  );
}
