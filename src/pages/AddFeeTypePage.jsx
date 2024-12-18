import React from "react";
import MasterLayout from "@/masterLayout/MasterLayout";

import AddFeeTypeLayer from "../components/AddFeeTypeLayer";
function AddFeeTypePage() {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb leftTitle="Input Form" /> */}

        {/* AddIncomeHeadLayer */}
        <AddFeeTypeLayer />
      </MasterLayout>
    </>
  );
}

export default AddFeeTypePage;
