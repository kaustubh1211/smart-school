import {
  Printer,
  PenSquare,
  Trash2,
  ArrowLeft,
  Plus,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { DatePickerWithRange } from "./ui/date-range-picker"
import { studentAffidavits } from "@/lib/studentAffidavits";
import { Link } from "react-router-dom";
import { DatePickerWithRange } from "./ui/date-range-picker";
import { Separator } from "./ui/separator";

export default function AffidavitPage() {
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
          <Button className="flex items-center gap-2" onClick={() => }>
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>
      <Separator className="m-2" />
      <div className="flex flex-col md:flex-row justify-between gap-4 m-6">
        <div className="flex items-center gap-6 ">
          <span className="whitespace-nowrap">Date</span>
          <DatePickerWithRange />
        </div>
        <div className="flex items-center gap-6">
          <span className="whitespace-nowrap">Search</span>
          <div className="flex w-full max-w-sm items-center space-x-4">
            <Input
              type="text"
              placeholder="Name / Enroll.No. / GrNo"
              className="min-w-[300px] text-black"
            />
            <Button>Search</Button>
          </div>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
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
              {studentAffidavits.map((student, index) => (
                <tr key={index} className="border-t">
                  <td className="py-1 px-4 mb-1 text-gray-600">{index + 1}</td>
                  <td className="py-1 px-4 mb-1 text-gray-600 text-center">{student.enrollNo}</td>
                  <td className="py-1 px-4 mb-1 text-gray-600">{student.name}</td>
                  <td className="py-1 px-4 mb-1 text-gray-600">{student.class}</td>
                  <td className="py-1 px-4 mb-1 text-gray-600">{student.date}</td>
                  <td className="">
                    <div className="flex justify-center gap-2">
                      <Link href={`/affidavit/download/${student.enrollNo}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Printer className="h-5 w-5" />
                        </Button>
                      </Link>
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
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
