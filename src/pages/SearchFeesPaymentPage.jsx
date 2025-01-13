import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../../src/components/BreadCrumb";
import SearchFeesPaymentLayer from "../components/SearchFeesPaymentLayer";

const SearchFeesPaymentPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Users Grid" />

        {/* UsersListLayer */}
        <SearchFeesPaymentLayer />
      </MasterLayout>
    </>
  );
};

export default SearchFeesPaymentPage;
