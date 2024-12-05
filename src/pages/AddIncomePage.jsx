import React from "react";
import MasterLayout from "@/masterLayout/MasterLayout";
import Breadcrumb from "@/components/Breadcrumb";
import AddIncomeLayer from "@/components/AddIncomeLayer";
function AddIncomePage() {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb leftTitle="Input Form" /> */}

        {/* AddIncomeLayer */}
        <AddIncomeLayer />
      </MasterLayout>
    </>
  );
}

export default AddIncomePage;
