import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeft, ListFilter } from "lucide-react";
import { useState } from "react";
import { studentAffidavits } from "@/lib/studentAffidavits";
import { Link, useNavigate } from "react-router-dom";

export default function GenerateAffidavit() {
  const [date, setDate] = useState(new Date());
  const [enrollNo, setEnrollNo] = useState("");
  const [searchBy, setSearchBy] = useState("enrollNo");
  const [studentInfo, setStudentInfo] = useState(null);
  const navigate = useNavigate();

  const handleEnrollNoChange = (value) => {
    setEnrollNo(value);
    const student = studentAffidavits.find((s) => s.enrollNo === value);
    if (student) {
      setStudentInfo({
        name: student.name,
        class: student.class,
        enrollNo: student.enrollNo,
      });
    } else {
      setStudentInfo(null);
    }
  };

  return (
    <div className="container py-6 ">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            📝
          </span>
          Student Affidavit
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => navigate(`/affidavits`)}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Date Picker */}
        <div className="grid grid-cols-4 items-center gap-4">
          <label className="text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Date <span className="text-red-500">*</span>
          </label>
          <div className="col-span-3 w-1/2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd-MM-yyyy") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Search By Dropdown */}
        <div className="grid grid-cols-4 items-center gap-4 ">
          <label className="text-right text-sm font-medium leading-none">
            Search By
          </label>
          <div className="col-span-3 w-3/4">
            <Select value={searchBy} onValueChange={setSearchBy}>
              <SelectTrigger>
                <SelectValue placeholder="Select search criteria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enrollNo">Enroll.No.</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="class">Class</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Enroll No Input */}
        <div className="grid grid-cols-4 items-center gap-4">
          <label className="text-right text-sm font-medium leading-none">
            Enroll.No.
          </label>
          <div className="col-span-3 w-3/4">
            <Input
              value={enrollNo}
              onChange={(e) => handleEnrollNoChange(e.target.value)}
              placeholder="Enter enrollment number"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <div></div>
          {/* Student Info Display */}
          <div className="col-span-3  mt-8 bg-yellow-100 p-6 rounded-lg w-3/4">
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-2">
                <span className="font-medium">Name</span>
                <span className="col-span-3">
                  : {studentInfo?.name || "__".repeat(25)}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <span className="font-medium">Class</span>
                <span className="col-span-3">
                  : {studentInfo?.class || "__".repeat(25)}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <span className="font-medium">Enroll No</span>
                <span className="col-span-3">
                  : {studentInfo?.enrollNo || "__".repeat(25)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center mt-8">
          <Button
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white px-8"
            disabled={!studentInfo}
            onClick={() => {
              studentInfo
                ? navigate(`/affidavits/${studentInfo.enrollNo}`)
                : navigate("#");
            }}
          >
            Generate Affidavit
          </Button>
        </div>
      </div>
    </div>
  );
}
