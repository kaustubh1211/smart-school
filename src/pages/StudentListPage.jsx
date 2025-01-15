import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import StudentListLayer from "../components/StudentListLayer";

const StudentDetailsPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Users Grid" />

        {/* UsersListLayer */}
        <StudentListLayer />
      </MasterLayout>
    </>
  );
};

export default StudentDetailsPage;
