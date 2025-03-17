import React from "react";

const FeeDashboardDetails = ({ feeDetails }) => {
  const details = [
    "Fee Head",
    "Lab Fees",
    "Extra Class",
    "Workbook",
    "LAB CHARGE +ANNUAL LOCKER CHARGE",
    "Project Book",
    "Dress (2 Pair)",
    "Bus Fee",
    "Pending Fees",
    "MISC Fees",
    "Pending Fees 2018- 2019",
    "Pending Fees 2017- 2018",
    "Pending Fees 2016- 2017",
    "Pending Fees 2015- 2016",
    "DRESS",
    "Admission Fee",
    "Term 1",
    "Monthly fees",
    "Term 2",
    "Journal",
    "Exam Fee",
    "id card/ college app/library card/ gymkhana",
    "id card/ calendar/ app",
    "computer fee 1",
    "exam fee 1",
    "exam fee 2",
    "project/ journal book",
    "bonafide fee",
    "IT FEES",
    " sports fees",
    "computer science",
    "total",
  ];

  return (
    <div className="overflow-x-auto mx-4 pb-4">
      <table className="min-w-full divide-y divide-gray-400">
        <thead>
          <tr className="bg-gray-100">
            {details.map((detail, index) => (
              <th key={index} className="px-4 py-2 text-right text-xs text-black uppercase">
                {detail}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {feeDetails.map((row, index) => (
            <tr key={index} className={row.textColor}>
              {Object.entries(row)
                .slice(1)
                .map(([key, value], index) => (
                  <td
                    key={index}
                    className="px-4 py-2 whitespace-nowrap text-m font-semibold text-right"
                  >
                    {value}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeeDashboardDetails;
