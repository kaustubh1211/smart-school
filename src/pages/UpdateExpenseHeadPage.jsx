import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
// import StudentDetailsLayer from "../../src/components/StudentDetailsLayer";
import UpdateExpenseHeadLayer from "@/components/UpdateExpenseHeadLayer";

const UpdateExpenseHeadPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Users Grid" />

        {/* UpdateExpenseHeadLayer */}
        <UpdateExpenseHeadLayer />
      </MasterLayout>
    </>
  );
};

export default UpdateExpenseHeadPage;
