import React from "react";
import SalesStatisticOne from "../components/child/SalesStatisticOne";
import TotalSubscriberOne from "../components/child/TotalSubscriberOne";
import UsersOverviewOne from "../components/child/UsersOverviewOne";
import LatestRegisteredOne from "../components/child/LatestRegisteredOne";
import TopPerformerOne from "../components/child/TopPerformerOne";
import TopCountries from "../components/child/TopCountries";
import GeneratedContent from "../components/child/GeneratedContent";
import UnitCountOne from "../components/child/UnitCountOne";

const DashBoardLayerOne = () => {
  return (
    <>
      {/* UnitCountOne */}
      <UnitCountOne />

      <section className="row gy-4 mt-1">
        {/* SalesStatisticOne */}
        <SalesStatisticOne />

        {/* TotalSubscriberOne */}
        <TotalSubscriberOne />

        {/* UsersOverviewOne */}
        <UsersOverviewOne />

        {/* LatestRegisteredOne */}
        <LatestRegisteredOne />

        {/* TopPerformerOne */}
        <TopPerformerOne />

        {/* TopCountries */}
        <TopCountries />

        {/* GeneratedContent */}
        <GeneratedContent />
      </section>
    </>
  );
};

export default DashBoardLayerOne;
