import React from "react";
import MasterLayout from "@/masterLayout/MasterLayout";

import FeeReportlayer from "@/components/FeeReportlayer";
function FeeReportPage() {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb leftTitle="Input Form" /> */}

        {/* FeeReportlayer */}
        <FeeReportlayer />
      </MasterLayout>
    </>
  );
}

export default FeeReportPage;
