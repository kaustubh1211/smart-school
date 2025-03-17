import React from "react";

const StudentFeeDetailsTable = ({ studentData}) => {
  // Calculate totals for the footer row
  const totals = studentData.reduce(
    (acc, student) => {
      return {
        totalFee: acc.totalFee + student.totalFee,
        exemption: acc.exemption + student.exemption,
        paidAmount: acc.paidAmount + student.paidAmount,
        balance: acc.balance + student.balance,
      };
    },
    { totalFee: 0, exemption: 0, paidAmount: 0, balance: 0 }
  );

  return (
    <div className="overflow-x-auto px-4 mt-4 p-4 max-w-full mx-auto bg-white">
      <table className="min-w-full divide-y divide-gray-400 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-2 text-left text-xs font-lg text-black uppercase tracking-wider">
              SRNO
            </th>
            <th className="px-6 py-2 text-left text-xs font-lg text-black uppercase tracking-wider">
              SECTION
            </th>
            <th className="px-6 py-2 text-left text-xs font-lg text-black uppercase tracking-wider">
              STANDARD
            </th>
            <th className="px-6 py-2 text-left text-xs font-lg text-black uppercase tracking-wider">
              DIVISION
            </th>
            <th className="px-6 py-2 text-left text-xs font-lg text-black uppercase tracking-wider">
              STUDENTS
            </th>
            <th className="px-6 py-2 text-right text-xs font-lg text-black uppercase tracking-wider">
              TOTAL FEE
            </th>
            <th className="px-6 py-2 text-right text-xs font-lg text-black uppercase tracking-wider">
              EXEMPTION
            </th>
            <th className="px-6 py-2 text-right text-xs font-lg text-black uppercase tracking-wider">
              PAID AMOUNT
            </th>
            <th className="px-6 py-2 text-right text-xs font-lg text-black uppercase tracking-wider">
              BALANCE
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {studentData.map((student, index) => (
            <tr key={index}>
              <td className="px-6 py-2 whitespace-nowrap text-sm text-left text-gray-900">
                {index + 1}
              </td>
              <td className="px-6 py-2 whitespace-nowrap text-sm text-left text-gray-900">
                {student.section}
              </td>
              <td className="px-6 py-2 whitespace-nowrap text-sm text-left text-gray-900">
                {student.standard}
              </td>
              <td className="px-6 py-2 whitespace-nowrap text-sm text-left text-gray-900">
                {student.division}
              </td>
              <td className="px-6 py-2 whitespace-nowrap text-sm text-left text-gray-900">
                {student.name}
              </td>
              <td className="px-6 py-2 whitespace-nowrap text-sm text-right text-gray-900">
                {student.totalFee.toLocaleString()}
              </td>
              <td className="px-6 py-2 whitespace-nowrap text-sm text-right text-gray-900">
                {student.exemption.toLocaleString()}
              </td>
              <td className="px-6 py-2 whitespace-nowrap text-sm text-right text-green-600">
                {student.paidAmount.toLocaleString()}
              </td>
              <td className="px-6 py-2 whitespace-nowrap text-sm text-right text-red-600">
                {student.balance.toLocaleString()}
              </td>
            </tr>
          ))}
          {/* Total row */}
          <tr className="bg-gray-100 font-medium">
            <td className="px-6 py-2 whitespace-nowrap text-sm text-left text-gray-900" colSpan="5">
              Total
            </td>
            <td className="px-6 py-2 whitespace-nowrap text-sm text-right text-gray-900">
              {totals.totalFee.toLocaleString()}
            </td>
            <td className="px-6 py-2 whitespace-nowrap text-sm text-right text-gray-900">
              {totals.exemption.toLocaleString()}
            </td>
            <td className="px-6 py-2 whitespace-nowrap text-sm text-right text-green-600">
              {totals.paidAmount.toLocaleString()}
            </td>
            <td className="px-6 py-2 whitespace-nowrap text-sm text-right text-red-600">
              {totals.balance.toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default StudentFeeDetailsTable;
