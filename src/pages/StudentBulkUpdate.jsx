import React from "react";
import MasterLayout from "@/masterLayout/MasterLayout";
import StudentBulkUpdateLayer from "@/components/StudentBulkUpdateLayer";

function StudentBulkUpdate() {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb leftTitle="Input Form" /> */}

        {/* AddExpenseLayer */}
        <StudentBulkUpdateLayer />
      </MasterLayout>
    </>
  );
}

export default StudentBulkUpdate;
