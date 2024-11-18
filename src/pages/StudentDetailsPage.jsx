import React from "react";
import MasterLayout from "../../src/masterLayout/MasterLayout";
import Breadcrumb from "../../src/components/Breadcrumb";
import StudentDetailsLayer from "../../src/components/StudentDetailsLayer";

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
