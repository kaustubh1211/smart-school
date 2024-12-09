import React from "react";
import MasterLayout from "@/masterLayout/MasterLayout";

import AddExpenseHeadLayer from "@/components/AddExpenseHeadLayer";
function AddExpenseHeadPage() {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb leftTitle="Input Form" /> */}

        {/* AddExpenseHeadLayer */}
        <AddExpenseHeadLayer />
      </MasterLayout>
    </>
  );
}

export default AddExpenseHeadPage;
