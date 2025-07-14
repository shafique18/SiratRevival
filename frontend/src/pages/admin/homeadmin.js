import React, { useState } from "react";
import Layout from '../../components/Layout';
import SideNav from "../../components/SideNav";
import MainContent from "../../components/MainContent";

export default function HomeAdmin() {
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
