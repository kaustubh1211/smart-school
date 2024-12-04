import React from "react";
import MasterLayout from "../../src/masterLayout/MasterLayout";
import Breadcrumb from "../../src/components/Breadcrumb";
// import StudentDetailsLayer from "../../src/components/StudentDetailsLayer";
import UserUpdateLayer from "@/components/UserUpdateLayer";

const UserUpdatePage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Users Grid" />

        {/* UserUpdateLayer */}
        <UserUpdateLayer />
      </MasterLayout>
    </>
  );
};

export default UserUpdatePage;
