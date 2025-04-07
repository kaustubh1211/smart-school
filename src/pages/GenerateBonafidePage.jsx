import Breadcrumb from "@/components/Breadcrumb";
import GenerateBonafideForm from "@/components/GenerateBonafideForm";
import MasterLayout from "@/masterLayout/MasterLayout";
import React from "react";

const GenerateBonafidePage = () => {
  return (
    <div>
      <MasterLayout>
        <Breadcrumb />
        <GenerateBonafideForm />
      </MasterLayout>
    </div>
  );
};

export default GenerateBonafidePage;
