import React, { useEffect } from "react";
import SalesStatisticOne from "../components/child/SalesStatisticOne";
import TotalSubscriberOne from "../components/child/TotalSubscriberOne";
import UsersOverviewOne from "../components/child/UsersOverviewOne";
import LatestRegisteredOne from "../components/child/LatestRegisteredOne";
import TopPerformerOne from "../components/child/TopPerformerOne";
import TopCountries from "../components/child/TopCountries";
import GeneratedContent from "../components/child/GeneratedContent";
import UnitCountOne from "../components/child/UnitCountOne";

import { Calendar } from "@/components/ui/calendar";
import BirthdaySlider from "./child/BirthdaySlider";
import { useState } from "react";
import axios from "axios";

const DashBoardLayerOne = () => {
  // const [date, setDate] = (React.useState < Date) | (undefined > new Date());
  const accessToken = localStorage.getItem("accessToken");
  const date = new Date();
  const todaysDate = new Date().toISOString().split("T")[0];
  console.log(todaysDate);
  const [studentBday, setStudentBday] = useState([]);

  useEffect(() => {
    const fetchBirthday = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_LOCAL_API_URL
          }students/students-birthday?date=${todaysDate}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setStudentBday(response.data.data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
    fetchBirthday();
  }, []);

  return (
    <>
      {/* UnitCountOne */}
      <UnitCountOne />

      {/* <div className="flex flex-row mt-24 w-full gap-3"> */}
      <div className="flex sm:flex-row flex-col mt-20 gap-3">
        <SalesStatisticOne />
        <Calendar
          mode="single"
          selected={date}
          // onSelect={setDate}
          className="rounded-md border overflow-hidden"
        />
      </div>

      {/* </div> */}

      <div className="flex flex-row justify-between mt-20">
        <BirthdaySlider students={studentBday} />
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
