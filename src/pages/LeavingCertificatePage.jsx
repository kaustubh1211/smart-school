import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import BonafiedCertificateLayer from "@/components/BonafiedCertificateLayer";

const BonafiedCertificatePage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Users Grid" />

        {/* UsersListLayer */}
        <BonafiedCertificateLayer />
      </MasterLayout>
    </>
  );
};

export default BonafiedCertificatePage;
