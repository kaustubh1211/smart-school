import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import BonafideCertificateLayer from "@/components/BonafideCertificateLayer";

const BonafideCertificatePage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Users Grid" />

        {/* UsersListLayer */}
        <BonafideCertificateLayer />
      </MasterLayout>
    </>
  );
};

export default BonafideCertificatePage;
