import React from "react";
import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();
  const handleSAdminNavigate = () => {
    navigate("/sign-in");
  };
  const handleAdminNavigate = () => {
    navigate("/sign-in");
  };
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100">
      {/* Blue Section */}
      <div className="lg:w-2/3 bg-blue-600 text-white flex flex-col justify-center items-center px-10 ">
        <div className="text-4xl lg:text-6xl font-bold mb-3 mt-60 text-center tracking-tighter">
          Welcome back!
          <br />
          Please log in to your{" "}
          <span className="bg-white text-blue-600 px-2 mt-2 rounded-sm">
            Smart School
          </span>{" "}
          account.
        </div>
        <div className="max-w-4xl mt-2 text-md font-light text-blue-300 px-10">
          Smart School enables you to efficiently track fees, manage student
          records, add and update student data, monitor academic progress, and
          access a wide range of tools to streamline school operations.
        </div>
        <div className="flex justify-center items-center w-full my-44">
          <img
            className="w-3/5 lg:w-1/2"
            src="../../src/assets/Icons/Medium_Traffic (1).svg"
          />
        </div>
        {/* Fee Collection and Attendance */}
        {/* <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-gray-500">Fee Collection</h2>
            <p className="text-3xl font-bold text-gray-900">₹2,57,990.00</p>
            <div className="mt-4">
              <div className="h-20 w-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg relative">
                <div className="absolute bottom-0 left-2 h-12 w-4 bg-white"></div>
                <div className="absolute bottom-0 left-8 h-16 w-4 bg-white"></div>
                <div className="absolute bottom-0 left-14 h-20 w-4 bg-white"></div>
                <div className="absolute bottom-0 left-20 h-14 w-4 bg-white"></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-gray-500">Attendance</h2>
            <div className="relative w-24 h-24 mx-auto">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  className="text-gray-300 stroke-current"
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeWidth="2"
                />
                <path
                  className="text-purple-500 stroke-current"
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831"
                  fill="none"
                  strokeWidth="2"
                  strokeDasharray="75, 100"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-purple-500">75%</span>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      {/* Login Section */}
      <div className="lg:w-1/3 flex flex-col justify-center items-center p-28">
        <div className="bg-white shadow-lg rounded-lg px-28 py-32 w-full max-w-sm text-center">
          <button
            onClick={handleSAdminNavigate}
            className="w-full bg-blue-600 text-white py-3 rounded-lg mb-4 shadow-md hover:bg-blue-700"
          >
            Super Admin Login
          </button>
          <button
            onClick={handleAdminNavigate}
            className="w-full border border-2  border-blue-600 text-blue-500 py-3 rounded-lg hover:bg-blue-100"
          >
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
