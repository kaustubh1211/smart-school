import React from "react";
import MasterLayout from "@/masterLayout/MasterLayout";

import AccountsLayer from "@/components/AccountsLayer";
function AccountsPage() {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb leftTitle="Input Form" /> */}

        {/* AddExpenseLayer */}
        <AccountsLayer />
      </MasterLayout>
    </>
  );
}

export default AccountsPage;
