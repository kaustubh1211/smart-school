import React from "react";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const UnitCountOne = () => {
  const accessToken = localStorage.getItem("accessToken");
  const tenant = useSelector((state) => state.branch.tenant);
  const academicYear = useSelector((state) => state.branch.academicYear);

  const [totalStudents, setTotalStudents] = useState({});
  const [todaysLoginCount, setTodaysLoginCount] = useState(0);

  // fetch total no of students
  useEffect(() => {
    async function fetchTotalStudents() {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_API_URL
          }students/students-total?mediumName=${tenant}&academicYearName=${academicYear}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setTotalStudents(response.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchTotalStudents();
  }, [tenant, academicYear]);

  // fetch today's login count
  useEffect(() => {
    async function fetchTodaysLoginCount() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_API_URL}common/login-count`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setTodaysLoginCount(response.data.data.count);
      } catch (error) {
        console.log(error);
      }
    }
    fetchTodaysLoginCount();
  }, []);

  return (
    <div className="row row-cols-xxxl-5 row-cols-lg-3 row-cols-sm-2 row-cols-1 gy-4">
      <div className="col">
        <div className="card shadow-none border bg-gradient-start-1 h-100">
          <div className="card-body p-20">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <p className="fw-medium text-primary-light mb-1">
                  Total Students
                </p>
                <h6 className="mb-0">{totalStudents.totalStudents}</h6>
              </div>
              <div className="w-50-px h-50-px bg-cyan rounded-circle d-flex justify-content-center align-items-center">
                <Icon
                  icon="gridicons:multiple-users"
                  className="text-white text-2xl mb-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col">
        <div className="card shadow-none border bg-gradient-start-2 h-100">
          <div className="card-body p-20">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <p className="fw-medium text-primary-light mb-1">Total Boys</p>
                <h6 className="mb-0">{totalStudents.totalBoys}</h6>
              </div>
              <div className="w-50-px h-50-px bg-purple rounded-circle d-flex justify-content-center align-items-center">
                <Icon
                  icon="fa-solid:award"
                  className="text-white text-2xl mb-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col">
        <div className="card shadow-none border bg-gradient-start-3 h-100">
          <div className="card-body p-20">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <p className="fw-medium text-primary-light mb-1">Total Girls</p>
                <h6 className="mb-0">{totalStudents.totalGirls}</h6>
              </div>
              <div className="w-50-px h-50-px bg-info rounded-circle d-flex justify-content-center align-items-center">
                <Icon
                  icon="fluent:people-20-filled"
                  className="text-white text-2xl mb-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Today's Login Count Card */}
      <div className="col">
        <div className="card shadow-none border bg-gradient-start-4 h-100">
          <div className="card-body p-20">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <p className="fw-medium text-primary-light mb-1">
                  Today's Logins
                </p>
                <h6 className="mb-0">{todaysLoginCount}</h6>
              </div>
              <div className="w-50-px h-50-px bg-success-main rounded-circle d-flex justify-content-center align-items-center">
                <Icon
                  icon="material-symbols:login"
                  className="text-white text-2xl mb-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitCountOne;