import React from "react";
import MasterLayout from "@/masterLayout/MasterLayout";
import TimetableLayer from "@/components/TimetableLayer";

function TimetablePage() {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb leftTitle="Input Form" /> */}

        {/* AddExpenseLayer */}
        <TimetableLayer />
      </MasterLayout>
    </>
  );
}

export default TimetablePage;
