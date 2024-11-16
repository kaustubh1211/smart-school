import React from "react";
import FormLayoutLayer from "../components/FormLayoutLayer";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";

const FormLayoutPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb leftTitle="Student Detail" rightTitle="Import Student" />

        {/* FormLayoutLayer */}
        <FormLayoutLayer />
      </MasterLayout>
    </>
  );
};

export default FormLayoutPage;
