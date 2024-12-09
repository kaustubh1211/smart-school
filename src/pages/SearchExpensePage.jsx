import React from "react";
import MasterLayout from "@/masterLayout/MasterLayout";

import SearchExpenseLayer from "@/components/SearchExpenseLayer";
function SearchExpensePage() {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb leftTitle="Input Form" /> */}

        {/* SearchExpenseLayer */}
        <SearchExpenseLayer />
      </MasterLayout>
    </>
  );
}

export default SearchExpensePage;
