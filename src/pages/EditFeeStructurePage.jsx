import React from "react";
import MasterLayout from "@/masterLayout/MasterLayout";

import AddFeeTypeLayer from "../components/AddFeeTypeLayer";
import AddFeeGroupLayer from "@/components/AddFeeGroupLayer";
function AddFeeGroupPage() {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb leftTitle="Input Form" /> */}

        {/* AddIncomeHeadLayer */}
        <AddFeeGroupLayer />
      </MasterLayout>
    </>
  );
}

export default AddFeeGroupPage;
