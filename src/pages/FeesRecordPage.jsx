import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../../src/components/BreadCrumb";
import FeesRecordLayer from "@/components/FeesRecordLayer";

const FeesRecordPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Users Grid" />

        {/* UsersListLayer */}
        <FeesRecordLayer />
      </MasterLayout>
    </>
  );
};

export default FeesRecordPage;
