import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import StudentDiscountView from "@/components/StudentDiscountComponent";

const StudentDiscountPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Users Grid" />

        {/* UsersListLayer */}
        <StudentDiscountView/>
      </MasterLayout>
    </>
  );
};

export default StudentDiscountPage;
