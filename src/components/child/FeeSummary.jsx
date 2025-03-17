import React from "react";

const FeeSummary = ({ summaryData }) => {
  return (
    <>
      <div className="overflow-x-auto px-4">
        <table className="min-w-full divide-y divide-gray-400 mb-4">
          <thead>
            <tr className="bgtext-m font-semibold bg-gray-100">
              <th className="px-6 py-2 text-left text-xs font-lg text-black  uppercase tracking-wider">
                Level
              </th>
              <th className="px-6 py-2 text-right text-xs font-lg text-black uppercase tracking-wider">
                Total Fee
              </th>
              <th className="px-6 py-2 text-right text-xs font-lg text-black uppercase tracking-wider">
                Exemption
              </th>
              <th className="px-6 py-2 text-right text-xs font-lg text-black uppercase tracking-wider">
                Paid Amount
              </th>
              <th className="px-6 py-2 text-right text-xs font-lg text-black uppercase tracking-wider">
                Balance
              </th>
              <th className="px-6 py-2 text-right text-xs font-lg text-black uppercase tracking-wider">
                Bal(%)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {summaryData.map((row, index) => (
              <tr key={index}>
                <td className="px-6 py-2 whitespace-nowrap text-m font-semibold  text-gray-900">
                  {row.level}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-m font-semibold text-right text-gray-900">
                  {row.totalFee.toLocaleString()}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-m font-semibold text-right text-gray-900">
                  {row.exemption}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-m font-semibold text-right text-green-600">
                  {row.paidAmount.toLocaleString()}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-m font-semibold text-right text-red">
                  {row.balance.toLocaleString()}
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-m font-semibold text-right text-red">
                  {row.balancePercent.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default FeeSummary;
