import React from "react";
import CollectFeePaymentLayer from "../components/CollectFeePaymentLayer";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../../src/components/BreadCrumb";

const CollectFeePaymentPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        {/* <Breadcrumb leftTitle="Student Detail" rightTitle="Import Student" /> */}

        {/* FormLayoutLayer */}
        <CollectFeePaymentLayer />
        <Breadcrumb leftTitle="" rightTitle="Submit" />
      </MasterLayout>
    </>
  );
};

export default CollectFeePaymentPage;
