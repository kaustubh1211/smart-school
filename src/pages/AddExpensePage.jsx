import React from "react";
import MasterLayout from "@/masterLayout/MasterLayout";

import AddExpenseLayer from "@/components/AddExpenseLayer";
function AddExpensePage() {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb leftTitle="Input Form" /> */}

        {/* AddExpenseLayer */}
        <AddExpenseLayer />
      </MasterLayout>
    </>
  );
}

export default AddExpensePage;
