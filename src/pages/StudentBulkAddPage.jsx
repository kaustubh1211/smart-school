import React from "react";
import MasterLayout from "@/masterLayout/MasterLayout";
import StudentBulkAddLayer from "@/components/StudentBulkAddLayer";

function StudentBulkAddPage() {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb leftTitle="Input Form" /> */}

        {/* AddExpenseLayer */}
        <StudentBulkAddLayer />
      </MasterLayout>
    </>
  );
}

export default StudentBulkAddPage;
