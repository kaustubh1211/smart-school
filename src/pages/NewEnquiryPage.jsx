import Breadcrumb from "@/components/Breadcrumb";
import NewEnquiryLayer from "@/components/NewEnquiryLayer";
import MasterLayout from "@/masterLayout/MasterLayout";
import React from "react";

const NewEnquiryPage = () => {
  return (
    <div>
      <MasterLayout>
        <Breadcrumb />
        <NewEnquiryLayer />
      </MasterLayout>
    </div>
  );
};

export default NewEnquiryPage;
