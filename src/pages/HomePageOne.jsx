import React from "react";
import MasterLayout from "../../src/masterLayout/MasterLayout";
import Breadcrumb from "../../src/components/BreadCrumb";
import DashBoardLayerOne from "../../src/components/DashBoardLayerOne";

const HomePageOne = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="AI" />

        {/* DashBoardLayerOne */}
        <DashBoardLayerOne />
      </MasterLayout>
    </>
  );
};

export default HomePageOne;
