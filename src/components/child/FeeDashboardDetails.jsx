import React from "react";

const FeeDashboardDetails = ({feeDetails}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
              Fee <br />
              Head
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
              Lab Fees
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
              Extra Class
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
              Workbook
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
              LAB CHARGE +ANNUAL LOCKER CHARGE
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
              Project Book
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
              Dress (2 Pair)
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
              Bus Fee
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
              Pending Fees
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
              MISC Fees
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
              Pending Fees 2018- 2019
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
              Pending Fees 2017- 2018
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
              Pending Fees 2016- 2017
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
              Pending Fees 2015- 2016
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
              DRESS
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
              Admission Fee
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
              Term 1
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
              Monthly Fee
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
              Term 2
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
              Journal
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
              Exam Fee
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
              id card/ college app/library card/ gymkhana
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
              id card/ calendar/ app
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
              computer fee 1
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
              exam fee 1
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
              exam fee 2
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
              project/ journal book
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
              bonafide fee
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
              IT FEES
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
              sports fees
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
              computer science
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
              total
            </th>
            {/* Add more columns as needed */}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {feeDetails.map((row, index) => (
            <tr key={index} className={row.textColor}>
              <td className="px-4 py-2 whitespace-nowrap text-sm">
                {row.name}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {row.labFees}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {row.extraClass}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {row.workbook}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {row.labCharge}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {row.projectBook}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {row.dress2Pair}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {row.bus}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {row.pendingFees}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {row.miscFee}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {row.pendingFees1819}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {row.pendingFees1718}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {row.pendingFees1617}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {row.pendingFees1516}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {row.dress}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {row.admissionFees}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {row.term1}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {row.monthlyFee}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {row.Term2}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {row.journal}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {row.examFee}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {row.idCardGym}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {row.idCard}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {row.computerFee}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {row.examFee1}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {row.examFee2}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {row.projectJournalBook}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {row.bonafideFee}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {row.itFees}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {row.sportsFee}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {row.computerScience}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {row.total}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeeDashboardDetails;
