import React from "react";
import MasterLayout from "@/masterLayout/MasterLayout";
import MonthlyFeesTranxLayer from "@/components/MonthlyFeesTranxLayer";

function MonthlyFeesTraxPage() {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb leftTitle="Input Form" /> */}

        {/* FeeReportlayer */}
        <MonthlyFeesTranxLayer />
      </MasterLayout>
    </>
  );
}

export default MonthlyFeesTraxPage;
