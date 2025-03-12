import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, ChevronLeft, ListFilter } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { studentAffidavits } from "@/lib/student-affidavits"

export default function GenerateAffidavit() {
  const [date, setDate] = useState(new Date())
  const [enrollNo, setEnrollNo] = useState("")
  const [searchBy, setSearchBy] = useState("enrollNo")
  const [studentInfo, setStudentInfo] = useState(null)

  const handleEnrollNoChange = (value) => {
    setEnrollNo(value)
    const student = studentAffidavits.find((s) => s.enrollNo === value)
    if (student) {
      setStudentInfo({
        name: student.name,
        class: student.class,
        enrollNo: student.enrollNo,
      })
    } else {
      setStudentInfo(null)
    }
  }

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">📝</span>
          Student Affidavit
        </h1>
        <div className="flex gap-2">
          <Link href="/affidavits">
            <Button variant="outline" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <Link href="/affidavits">
            <Button variant="outline" className="flex items-center gap-2">
              <ListFilter className="h-4 w-4" />
              List
            </Button>
          </Link>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Date Picker */}
        <div className="grid grid-cols-4 items-center gap-4">
          <label className="text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Date <span className="text-red-500">*</span>
          </label>
          <div className="col-span-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd-MM-yyyy") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Search By Dropdown */}
        <div className="grid grid-cols-4 items-center gap-4">
          <label className="text-right text-sm font-medium leading-none">Search By</label>
          <div className="col-span-3">
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
          <label className="text-right text-sm font-medium leading-none">Enroll.No.</label>
          <div className="col-span-3">
            <Input
              value={enrollNo}
              onChange={(e) => handleEnrollNoChange(e.target.value)}
              placeholder="Enter enrollment number"
            />
          </div>
        </div>

        {/* Student Info Display */}
        <div className="mt-8 bg-yellow-50 p-6 rounded-lg">
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              <span className="font-medium">Name</span>
              <span className="col-span-3">: {studentInfo?.name || "_".repeat(25)}</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <span className="font-medium">Class</span>
              <span className="col-span-3">: {studentInfo?.class || "_".repeat(25)}</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <span className="font-medium">Enroll No</span>
              <span className="col-span-3">: {studentInfo?.enrollNo || "_".repeat(25)}</span>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center mt-8">
          <Link href={studentInfo ? `/affidavits/${studentInfo.enrollNo}` : "#"}>
            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white px-8" disabled={!studentInfo}>
              Generate Affidavit
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

