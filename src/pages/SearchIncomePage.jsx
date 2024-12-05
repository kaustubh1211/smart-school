import React from "react";
import MasterLayout from "@/masterLayout/MasterLayout";
import Breadcrumb from "@/components/Breadcrumb";
import SearchIncomeLayer from "@/components/SearchIncomeLayer";
function SearchIncomePage() {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb leftTitle="Input Form" /> */}

        {/* SearchIncomeLayer */}
        <SearchIncomeLayer />
      </MasterLayout>
    </>
  );
}

export default SearchIncomePage;
