import AddNewBonafideLayer from "@/components/AddNewBonafideLayer";
import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";
import React from "react";

const AddNewBonafidePage = () => {
  return (
    <div>
      <MasterLayout>
        <Breadcrumb />
        <AddNewBonafideLayer />
      </MasterLayout>
    </div>
  );
};

export default AddNewBonafidePage;
