import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import LeavingCertificateLayer from "@/components/LeavingCertificateLayer";

const LeavingCertificatePage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Users Grid" />

        {/* UsersListLayer */}
        <LeavingCertificateLayer />
      </MasterLayout>
    </>
  );
};

export default LeavingCertificatePage;
