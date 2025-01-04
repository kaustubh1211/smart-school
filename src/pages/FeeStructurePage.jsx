import React from "react";
import FeeStructureLayer from "../components/FeeStructureLayer";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";

const FeeStructurePage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb leftTitle="Student Detail" rightTitle="Import Student" /> */}

        {/* FormLayoutLayer */}
        <FeeStructureLayer />
        <Breadcrumb leftTitle="" rightTitle="Submit" />
      </MasterLayout>
    </>
  );
};

export default FeeStructurePage;
