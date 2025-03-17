import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ExamMasterLayer from "@/components/ExamMasterLayer";

const ExamMasterPage = () => {
  return (
    <div>
      <MasterLayout>
        <ExamMasterLayer />
        <Breadcrumb leftTitle="" rightTitle="Submit" />
      </MasterLayout>
    </div>
  );
};

export default ExamMasterPage;
