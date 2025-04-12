import Breadcrumb from "@/components/Breadcrumb";
import EnquiryFollowUpLayer from "@/components/EnquiryFollowUpLayer";
import MasterLayout from "@/masterLayout/MasterLayout";
import React from "react";

const EnquiryFollowUpPage = () => {
  return (
    <div>
      <MasterLayout>
        <Breadcrumb />
        <EnquiryFollowUpLayer />
      </MasterLayout>
    </div>
  );
};

export default EnquiryFollowUpPage;
