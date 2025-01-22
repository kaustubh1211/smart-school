import React from "react";
import MasterLayout from "@/masterLayout/MasterLayout";
import AttendanceMarkLayer from "@/components/AttendanceMarkLayer";

function AttendanceMarkPage() {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb leftTitle="Input Form" /> */}

        {/* AddExpenseLayer */}
        <AttendanceMarkLayer />
      </MasterLayout>
    </>
  );
}

export default AttendanceMarkPage;
