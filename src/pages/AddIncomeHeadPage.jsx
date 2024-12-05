import React from "react";
import MasterLayout from "@/masterLayout/MasterLayout";

import AddIncomeHeadLayer from "@/components/AddIncomeHeadLayer";
function AddIncomeHeadPage() {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb leftTitle="Input Form" /> */}

        {/* AddIncomeHeadLayer */}
        <AddIncomeHeadLayer />
      </MasterLayout>
    </>
  );
}

export default AddIncomeHeadPage;
