import Breadcrumb from "@/components/Breadcrumb";
import LeavingCertificateLayer from "@/components/LeavingCertificateLayer";
import MasterLayout from "@/masterLayout/MasterLayout";
import React from "react";

const LeavingCertificatePage = () => {
  return (
    <div>
      <MasterLayout>
        <Breadcrumb title="Users Grid" />
        <LeavingCertificateLayer />
      </MasterLayout>
    </div>
  );
};

export default LeavingCertificatePage;
