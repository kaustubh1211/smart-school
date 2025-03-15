import {
  Printer,
  PenSquare,
  Trash2,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { DatePickerWithRange } from "./ui/date-range-picker"
import { studentAffidavits} from "@/lib/studentAffidavits";
import { useNavigate } from "react-router-dom";
import { DatePickerWithRange } from "./ui/date-range-picker";
import { Separator } from "./ui/separator";
import { useState } from "react";

export default function AffidavitPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  const handlePrint = (enrollNo) => {
    navigate(`download/${enrollNo}`);
  };
  // to check if a date is within the selected range
  const isWithinDateRange = (date) => {
    if (!dateRange || !dateRange.from || !dateRange.to) return true; //no filter applied

    // Convert "DD-MM-YYYY" to "YYYY-MM-DD" before parsing
    const [day, month, year] = date.split("-");
    const formattedDate = new Date(`${year}-${month}-${day}`);

    const fromDate = new Date(dateRange.from);
    const toDate = new Date(dateRange.to);
    // Ensure the date is valid before comparison
    if (isNaN(formattedDate.getTime())) return false;
    return formattedDate >= fromDate && formattedDate <= toDate;
  };

  const filteredStudent = studentAffidavits.filter(
    (student) =>
      [student.enrollNo, student.name, student.grNo].some((field) =>
        field.toLowerCase().includes(searchQuery.toLowerCase())
      ) && isWithinDateRange(student.date)
  );

  const handleDelete = (enrollNo) => {
    const updatedStudents = studentAffidavits.filter(student => student.enrollNo !== enrollNo);
    setStudentAffidavits(updatedStudents)
  }
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between m-6">
        <div className="flex items-center gap-2">
          <div className="bg-orange-100 p-2 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-orange-500"
            >
              <path d="M14 3v4a1 1 0 0 0 1 1h4" />
              <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
              <line x1="9" y1="9" x2="10" y2="9" />
              <line x1="9" y1="13" x2="15" y2="13" />
              <line x1="9" y1="17" x2="15" y2="17" />
            </svg>
          </div>
          <h1 className="text-xl font-bold">Student Affidavit</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={() => navigate(`/affidavit`)}
          >
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>
      <Separator className="m-2" />
      <div className="flex flex-col md:flex-row justify-between gap-4 m-6">
        <div className="flex items-center gap-6 ">
          <label className="font-semibold whitespace-nowrap">Date</label>
          <DatePickerWithRange
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
        </div>
        <div className="flex items-center gap-6">
          <span className="whitespace-nowrap font-semibold">Search</span>
          <div className="flex w-full max-w-sm items-center space-x-4">
            <Input
              type="text"
              placeholder="Name / Enroll.No. / GrNo"
              className="min-w-[300px] text-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              className={`bg-red-500 text-base hover:bg-red-600`}
              onClick={() => {
                setSearchQuery("");
                setDateRange("");
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-sm">
                <th className="py-2 px-4 text-left font-semibold text-gray-900  ">
                  #
                </th>
                <th className="py-2 px-4 text-center font-semibold text-gray-900  ">
                  ENROLLNO
                </th>
                <th className="py-2 px-4 text-left font-semibold text-gray-900  ">
                  STUDENT
                </th>
                <th className="py-2 px-4 text-left font-semibold text-gray-900  ">
                  CLASS
                </th>
                <th className="py-2 px-4 text-left font-semibold text-gray-900  ">
                  DATE
                </th>
                <th className="py-2 px-4 text-center font-semibold text-gray-900  ">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudent.length > 0 ? (
                filteredStudent.map((student, index) => (
                  <tr key={index} className="border-t hover:bg-yellow-100">
                    <td className="py-1 px-4 mb-1 text-gray-600">
                      {index + 1}
                    </td>
                    <td className="py-1 px-4 mb-1 text-gray-600 text-center">
                      {student.enrollNo}
                    </td>
                    <td className="py-1 px-4 mb-1 text-gray-600">
                      {student.name}
                    </td>
                    <td className="py-1 px-4 mb-1 text-gray-600">
                      {student.class}
                    </td>
                    <td className="py-1 px-4 mb-1 text-gray-600">
                      {student.date}
                    </td>
                    <td className="">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() => handlePrint(student.enrollNo)}
                        >
                          <Printer className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <PenSquare className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(student.enrollNo)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-red-500">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
