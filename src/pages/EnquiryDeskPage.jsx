import Breadcrumb from "@/components/Breadcrumb";
import EnquiryDeskLayer from "@/components/EnquiryDeskLayer";
import MasterLayout from "@/masterLayout/MasterLayout";
import React from "react";

const EnquiryDeskPage = () => {
  return (
    <div>
      <MasterLayout>
        <Breadcrumb />
        <EnquiryDeskLayer />
      </MasterLayout>
    </div>
  );
};

export default EnquiryDeskPage;
