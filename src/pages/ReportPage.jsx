import React from "react";
import MasterLayout from "@/masterLayout/MasterLayout";
import ReportLayer from "@/components/ReportLayer";

function ReportPage() {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb leftTitle="Input Form" /> */}

        {/* AddExpenseLayer */}
        <ReportLayer />
      </MasterLayout>
    </>
  );
}

export default ReportPage;
