import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import ReactApexChart from "react-apexcharts";
import UseReactApexChart from "../../hooks/UseReactApexChart";

const SalesStatisticOne = () => {
  let { chartOptions, chartSeries } = UseReactApexChart();
  return (
    <div className="col-xxl-9 col-xl-12">
      <div className="card h-100">
        <div className="card-body">
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <h6 className="text-lg mb-0">Total Students Admitted</h6>
            {/* <select
              className="form-select bg-base form-select-sm w-auto"
              defaultValue="Yearly"
            >
              <option value="Yearly">Yearly</option>
              <option value="Monthly">Monthly</option>
              <option value="Weekly">Weekly</option>
              <option value="Today">Today</option>
            </select> */}
          </div>
          {/* <div className="d-flex flex-wrap align-items-center gap-2 mt-8">
            <h6 className="mb-0">$27,200</h6>
            <span className="text-sm fw-semibold rounded-pill bg-success-focus text-success-main border br-success px-8 py-4 line-height-1 d-flex align-items-center gap-1">
              10% <Icon icon="bxs:up-arrow" className="text-xs" />
            </span>
            <span className="text-xs fw-medium">+ $1500 Per Day</span>
          </div> */}
          <div className="mt-10">
            <ReactApexChart
              options={chartOptions}
              series={chartSeries}
              type="area"
              height={264}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesStatisticOne;
