import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../../src/components/BreadCrumb";
// import StudentDetailsLayer from "../../src/components/StudentDetailsLayer";
import UpdateExpenseLayer from "@/components/UpdateExpenseLayer";

const UpdateExpensePage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Users Grid" />

        {/* UpdateExpenseLayer */}
        <UpdateExpenseLayer />
      </MasterLayout>
    </>
  );
};

export default UpdateExpensePage;
