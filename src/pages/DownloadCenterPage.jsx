import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DownloadCenterLayer from "@/components/DownloadCenterLayer";

const DownloadCenterPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Users Grid" />

        {/* UsersListLayer */}
        <DownloadCenterLayer />
      </MasterLayout>
    </>
  );
};

export default DownloadCenterPage;
