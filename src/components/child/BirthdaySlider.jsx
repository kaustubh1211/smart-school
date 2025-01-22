// import React, { useState, useEffect } from "react";

// const BirthdayDisplay = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Sample data from your API response
//   const students = [
//     {
//       firstName: "Sahil",
//       lastName: "SHarma",
//       studentPhoto:
//         "uploads/studentPhotos/b3d27d40-a701-435c-90e5-c381b726997b_1737472050222.jpg",
//       dob: "2025-01-22T00:00:00.000Z",
//     },
//     {
//       firstName: "Piyush",
//       lastName: "SHarma",
//       studentPhoto:
//         "uploads/studentPhotos/49df3a98-833d-4aaf-99ba-d5ac4cb404bf_1737472151568.jpg",
//       dob: "2025-01-22T00:00:00.000Z",
//     },
//   ];

//   // Auto-slide effect
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentIndex((prevIndex) =>
//         prevIndex === students.length - 1 ? 0 : prevIndex + 1
//       );
//     }, 3000);

//     return () => clearInterval(timer);
//   }, [students.length]);

//   // Format date to show only day and month
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       day: "numeric",
//       month: "long",
//     });
//   };

//   return (
//     <div className="w-96 h-48 mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
//       {/* Header */}
//       <div className="bg-orange-100 p-4">
//         <div className="flex items-center gap-2">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="w-6 h-6 text-orange-500"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           >
//             <path d="M20 12v10H4V12" />
//             <path d="M2 7h20v5H2z" />
//             <path d="M12 22V7" />
//             <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
//             <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
//           </svg>
//           <h2 className="text-lg font-semibold text-gray-800">Birthday's</h2>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="relative h-28">
//         {students.map((student, index) => (
//           <div
//             key={index}
//             className={`absolute w-full transition-all duration-500 ease-in-out ${
//               index === currentIndex
//                 ? "opacity-100 translate-x-0"
//                 : "opacity-0 translate-x-full"
//             }`}
//           >
//             <div className="p-4 flex items-center gap-4">
//               <img
//                 src={`${import.meta.env.VITE_SERVER_BASE_URL}${
//                   student.studentPhoto
//                 }`}
//                 alt={`${student.firstName}'s photo`}
//                 className="w-20 h-20 rounded-lg object-cover"
//               />
//               <div>
//                 <h3 className="font-semibold text-gray-800 text-lg">
//                   {student.firstName} {student.lastName}
//                 </h3>
//                 <p className="text-sm text-gray-600">Student</p>
//                 <p className="text-sm text-gray-600">
//                   {formatDate(student.dob)}
//                 </p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Indicator Dots */}
//       <div className="px-4 py-2 flex justify-center gap-1 border-t">
//         {students.map((_, index) => (
//           <div
//             key={index}
//             className={`h-1 rounded-full transition-all duration-300 ${
//               index === currentIndex ? "w-8 bg-orange-500" : "w-4 bg-gray-200"
//             }`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default BirthdayDisplay;

import React, { useState, useEffect } from "react";
import axios from "axios";

const BirthdayDisplay = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const accessToken = localStorage.getItem("accessToken");
  const date = new Date();
  const todaysDate = new Date().toISOString().split("T")[0];
  console.log(todaysDate);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchBirthday = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_API_URL
          }students/students-birthday?date=${todaysDate}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setStudents(response.data.data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
    fetchBirthday();
  }, []);
  // Auto-slide effect
  useEffect(() => {
    if (students.length > 0) {
      // Ensure there are students before starting the interval
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === students.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000); // Auto-slide after 4 seconds

      return () => clearInterval(timer); // Clean up interval
    }
  }, [students.length]);

  // Format date to show only day and month
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
    });
  };

  // Handle dot click to navigate directly to a profile
  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="w-96 h-52 mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-orange-100 p-4">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-orange-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 12v10H4V12" />
            <path d="M2 7h20v5H2z" />
            <path d="M12 22V7" />
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
          </svg>
          <h2 className="text-lg font-semibold text-gray-800">Birthday's</h2>
        </div>
      </div>

      {/* Content */}
      {students.length > 0 ? (
        <div className="relative h-28 overflow-hidden">
          {students.map((student, index) => (
            <div
              key={index}
              className={`absolute w-full transition-transform duration-500 ease-in-out ${
                index === currentIndex
                  ? "translate-x-0 opacity-100"
                  : index < currentIndex
                  ? "-translate-x-full opacity-0"
                  : "translate-x-full opacity-0"
              }`}
            >
              <div className="p-4 flex items-center gap-4">
                <img
                  src={`${import.meta.env.VITE_SERVER_BASE_URL}${
                    student.studentPhoto
                  }`}
                  alt={`${student.firstName}'s photo`}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-800 text-xl">
                    {student.firstName} {student.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">Student</p>
                  <p className="text-sm text-blue-600 font-bold">
                    {formatDate(student.dob)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500">
          No birthdays to display.
        </div>
      )}

      {/* Indicator Dots */}
      {students.length > 0 && (
        <div className="px-4 py-2 flex justify-center gap-1">
          {students.map((_, index) => (
            <div
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                index === currentIndex ? "w-8 bg-orange-500" : "w-4 bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BirthdayDisplay;
