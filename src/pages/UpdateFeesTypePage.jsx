import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../../src/components/BreadCrumb";
import UpdateFeesTypeLayer from "@/components/UpdateFeesTypeLayer";

const UpdateFeesTypePage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Users Grid" />

        {/* UpdateExpenseHeadLayer */}
        <UpdateFeesTypeLayer />
      </MasterLayout>
    </>
  );
};

export default UpdateFeesTypePage;
