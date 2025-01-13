import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../../src/components/BreadCrumb";
import StudentDetailsLayer from "../components/StudentDetailsLayer";

const StudentDetailsPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Users Grid" />

        {/* UsersListLayer */}
        <StudentDetailsLayer />
      </MasterLayout>
    </>
  );
};

export default StudentDetailsPage;
