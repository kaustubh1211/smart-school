import React from "react";
import MasterLayout from "@/masterLayout/MasterLayout";
import HomeworkLayer from "@/components/HomeworkLayer";

function HomeworkPage() {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb leftTitle="Input Form" /> */}

        {/* AddExpenseLayer */}
        <HomeworkLayer />
      </MasterLayout>
    </>
  );
}

export default HomeworkPage;
