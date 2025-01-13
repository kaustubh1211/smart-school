import React from "react";
import SalesStatisticOne from "../components/child/SalesStatisticOne";
import TotalSubscriberOne from "../components/child/TotalSubscriberOne";
import UsersOverviewOne from "../components/child/UsersOverviewOne";
import LatestRegisteredOne from "../components/child/LatestRegisteredOne";
import TopPerformerOne from "../components/child/TopPerformerOne";
import TopCountries from "../components/child/TopCountries";
import GeneratedContent from "../components/child/GeneratedContent";
import UnitCountOne from "../components/child/UnitCountOne";

import { Calendar } from "@/components/ui/calendar";

const DashBoardLayerOne = () => {
  // const [date, setDate] = (React.useState < Date) | (undefined > new Date());
  const date = new Date();

  return (
    <>
      {/* UnitCountOne */}
      <UnitCountOne />

      <div className="flex flex-row mt-24 w-full gap-3">
        <SalesStatisticOne />
        <Calendar
          mode="single"
          selected={date}
          // onSelect={setDate}
          className="rounded-md border"
        />
      </div>

      <section className="row gy-4 mt-1">
        {/* SalesStatisticOne */}
        {/* <SalesStatisticOne /> */}

        {/* TotalSubscriberOne */}
        {/* <TotalSubscriberOne /> */}

        {/* UsersOverviewOne */}
        {/* <UsersOverviewOne /> */}

        {/* LatestRegisteredOne */}
        {/* <LatestRegisteredOne /> */}

        {/* TopPerformerOne */}
        {/* <TopPerformerOne /> */}

        {/* TopCountries */}
        {/* <TopCountries /> */}

        {/* GeneratedContent */}
        {/* <GeneratedContent /> */}
      </section>
    </>
  );
};

export default DashBoardLayerOne;
