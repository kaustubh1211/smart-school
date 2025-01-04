import React from "react";
import MasterLayout from "@/masterLayout/MasterLayout";
import EditFeeStructureLayer from "@/components/EditFeeStructureLayer";
function EditFeeStructurePage() {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb leftTitle="Input Form" /> */}

        {/* AddIncomeHeadLayer */}
        <EditFeeStructureLayer />
      </MasterLayout>
    </>
  );
}

export default EditFeeStructurePage;
