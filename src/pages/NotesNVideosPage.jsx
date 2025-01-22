import React from "react";
import MasterLayout from "@/masterLayout/MasterLayout";
import NotesNVideosLayer from "@/components/NotesNVideosLayer";

function NotesNVideosPage() {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb leftTitle="Input Form" /> */}

        {/* AddExpenseLayer */}
        <NotesNVideosLayer />
      </MasterLayout>
    </>
  );
}

export default NotesNVideosPage;
