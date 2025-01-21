import React from "react";
import MasterLayout from "@/masterLayout/MasterLayout";
import PayrollLayer from "@/components/PayrollLayer";

function PayrollPage() {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb leftTitle="Input Form" /> */}

        {/* AddExpenseLayer */}
        <PayrollLayer />
      </MasterLayout>
    </>
  );
}

export default PayrollPage;
