import Breadcrumb from "@/components/Breadcrumb";
import BulkGenerateLC from "@/components/child/BulkGenerateLC";
import MasterLayout from "@/masterLayout/MasterLayout";
import React from "react";

const BulkGenerateLCPage = () => {
  return (
    <div>
      <MasterLayout>
        <Breadcrumb title="Users Grid" />
        <BulkGenerateLC />
      </MasterLayout>
    </div>
  );
};

export default BulkGenerateLCPage;
