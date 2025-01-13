import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../../src/components/BreadCrumb";
// import StudentDetailsLayer from "../../src/components/StudentDetailsLayer";
import UpdateIncomeHeadLayer from "@/components/UpdateIncomeHeadLayer";

const UpdateIncomePage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Users Grid" />

        {/* UpdateIncomeHeadLayer */}
        <UpdateIncomeHeadLayer />
      </MasterLayout>
    </>
  );
};

export default UpdateIncomePage;
