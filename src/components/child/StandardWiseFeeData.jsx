import React from "react";

const StandardWiseFeeData = ({ standardWiseFeeData, selectedClass }) => {
  const colummnHeads = [
    "Standard",
    "division",
    "students",
    "total fee",
    "exemption",
    "paid amount",
    "balance",
    "bal(%)",
  ];

  const filteredData = standardWiseFeeData.filter((row) => {
    if (selectedClass === "Prathamik") {
      return [
        "STD I",
        "STD II",
        "STD III",
        "STD IV",
        "STD V",
        "STD VI",
        "STD VII",
      ].includes(row.standard);
    } else if (selectedClass === "Madhyamik") {
      return ["STD VIII", "STD IX", "STD X"].includes(row.standard);
    } else if (selectedClass === "All") {
      return [
        "STD I",
        "STD II",
        "STD III",
        "STD IV",
        "STD V",
        "STD VI",
        "STD VII",
        "STD VIII",
        "STD IX",
        "STD X",
      ].includes(row.standard);
    }
    return row.standard === selectedClass;
  });
  return (
    <>
      <div className="overflow-x-auto px-4 mt-4">
        <table className="min-w-full divide-y divide-gray-400 mb-4">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-2 text-left text-xs font-lg text-black uppercase tracking-wider">
                Standard
              </th>
              {colummnHeads.slice(1).map((colummnHead) => (
                <th className="px-6 py-2 text-right text-xs font-lg text-black uppercase tracking-wider">
                  {colummnHead}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.length > 0
              ? filteredData.map((row, index) => (
                  <tr key={index}>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-left text-gray-900">
                      {row.standard}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-right text-gray-900">
                      {row.division}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-right text-gray-900">
                      {row.students.toLocaleString()}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-right text-gray-900">
                      {row.totalFee.toLocaleString()}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-right text-gray-900">
                      {row.exemption.toLocaleString()}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-right text-green-600">
                      {row.paidAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-right text-red-600">
                      {row.balance.toLocaleString()}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-right text-red-600">
                      {row.balancePercent.toFixed(2)}
                    </td>
                  </tr>
                ))
              : filteredData.map((row, index) => (
                  <tr key={index}>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-left text-gray-900">
                      {row.standard}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-right text-gray-900">
                      {row.division}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-right text-gray-900">
                      {row.students.toLocaleString()}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-right text-gray-900">
                      {row.totalFee.toLocaleString()}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-right text-gray-900">
                      {row.exemption.toLocaleString()}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-right text-green-600">
                      {row.paidAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-right text-red-600">
                      {row.balance.toLocaleString()}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-right text-red-600">
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

export default StandardWiseFeeData;
