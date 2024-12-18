import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import StudentDetailsLayer from "../components/StudentDetailsLayer";

const SearchFeesPaymentPage = () => {
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

export default SearchFeesPaymentPage;
