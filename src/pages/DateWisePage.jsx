import Breadcrumb from "@/components/Breadcrumb";
import DateWiseSummaryComponent from "@/components/DateWiseSummaryComponent";
import MasterLayout from "@/masterLayout/MasterLayout";
import React from "react";

const DateWiseSummaryPage = () => {
  return (
    <div>
      <MasterLayout>
        <Breadcrumb title="Users Grid" />
       <DateWiseSummaryComponent/>
      </MasterLayout>
    </div>
  );
};

export default  DateWiseSummaryPage;
