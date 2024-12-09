import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
// import StudentDetailsLayer from "../../src/components/StudentDetailsLayer";
import UpdateIncomeLayer from "@/components/UpdateIncomeLayer";

const UpdateIncomePage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Users Grid" />

        {/* UpdateIncomeLayer */}
        <UpdateIncomeLayer />
      </MasterLayout>
    </>
  );
};

export default UpdateIncomePage;
