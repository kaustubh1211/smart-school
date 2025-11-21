import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import StudentFeesCertificate from "@/components/FeesCertificateReportComponent";

const FeesCertificatePage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb leftTitle="Student Detail" rightTitle="Import Student" /> */}

        {/* FormLayoutLayer */}
        <StudentFeesCertificate/> 
        <Breadcrumb leftTitle="" rightTitle="Submit" />
      </MasterLayout>
    </>
  );
};

export default FeesCertificatePage;
