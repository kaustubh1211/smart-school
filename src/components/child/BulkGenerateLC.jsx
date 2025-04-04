import { format } from "date-fns";
import { ArrowLeft, CalendarIcon, FileText, ListFilter } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Checkbox } from "../ui/checkbox";

export default function BulkGenerateLC() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    leftDate: "",
    class: "",
    classStudying: "",
    leftReason: "PASSED STD. PRATHAMIK => STD VII (XXXXX) IN APRIL 2020",
    remark: "NO DUES.",
    progress: "SATISFACTORY",
    conduct: "GOOD",
    lastSchoolAttend: "Shri Raghubir Prathamik Vidyalaya",
    lastSchoolStandard: "IV ( FOURTH )",
  });

  const [showStudentList, setShowStudentList] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (formData.class === "STD VII") {
      setFormData({
        ...formData,
        classStudying: "STD 7TH (SEVENTH) SINCE JUNE 2023",
        leftReason: "PASSED STD 6TH (SIXTH) IN APRIL 2023",
      });
    } else if (formData.class === "STD X") {
      setFormData({
        ...formData,
        classStudying: "STD 10TH (TENTH) SINCE JUNE 2023",
        leftReason: "PASSED STD 9TH (NINTH) IN APRIL 2023",
      });
    }
  }, [formData]);

  useEffect(() => {
    if (formData.class) {
      const filtered = allStudents.filter(
        (student) => student.class === formData.class
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents([]);
    }
  }, [formData.class]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      leftDate: date ? format(date, "dd-MM-yyyy") : "",
    }));
  };

  const handleStudentSelect = (studentId) => {
    setSelectedStudents((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter((id) => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleSelectAllStudents = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedStudents(filteredStudents.map((student) => student.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleChooseSelected = () => {
    setShowStudentList(false);
    console.log("Selected students: ", selectedStudents);
  };

  const handleGenerateLC = () => {
    if (!formData.leftDate || !formData.class) {
      alert("Please fill in all required fields");
      return;
    }

    if (selectedStudents.length === 0) {
      alert("Please select atleast one student");
      return;
    }

    const studentToGenerate = filteredStudents.filter((student) =>
      selectedStudents.includes(student.id)
    );

    alert(`Generated LC for ${selectedStudents.length} students`);
    navigate("/leaving-certificates");
  };

  return (
    <div className="container mx-auto p-4 max-w-8xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center text-xl font-semibold">
          <span className="bg-orange-400 p-1 text-white mr-2">
            <FileText size={24} />
          </span>
          Bulk LC Generation
        </div>
        <div className="ml-auto flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-1"
            onClick={() => navigate("/leaving-certificates")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-6">
        <div className="grid grid-cols-3 items-center gap-4">
          <Label
            htmlFor="leftDate"
            className="text-right flex items-center justify-end"
          >
            Left Date <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="col-span-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.leftDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.leftDate ? (
                    formData.leftDate
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={
                    formData.leftDate
                      ? new Date(
                          formData.leftDate.split("-").reverse().join("-")
                        )
                      : undefined
                  }
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-3 items-center gap-4">
          <Label
            htmlFor="class"
            className="text-right flex items-center justify-end"
          >
            Class <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="col-span-2">
            <Select
              value={formData.class}
              onValueChange={(value) => handleSelectChange("class", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="--" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20">{`PRATHAMIK => STD VII`}</SelectItem>
                <SelectItem value="23">{`PRATHAMIK => STD X`}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 items-start gap-4">
          <div className="text-right"></div>
          <div className="col-span-2">
            <Button
              variant="link"
              className="p-0 text-blue-600 h-auto"
              onClick={() => setShowStudentList(true)}
              disabled={!formData.class}
            >
              Student List
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="classStudying" className="text-right">
            Class Studying
          </Label>
          <div className="col-span-2 text-slate-900">
            <Input
              id="classStudying"
              name="classStudying"
              value={formData.classStudying}
              onChange={handleChange}
              readOnly
            />
          </div>
        </div>

        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="leftReason" className="text-right">
            Left Reason
          </Label>
          <div className="col-span-2">
            <Input
              id="leftReason"
              name="leftReason"
              value={formData.leftReason}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="remark" className="text-right">
            Remark
          </Label>
          <div className="col-span-2">
            <Input
              id="remark"
              name="remark"
              value={formData.remark}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="progress" className="text-right">
            Progress
          </Label>
          <div className="col-span-2">
            <Input
              id="progress"
              name="progress"
              value={formData.progress}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="conduct" className="text-right">
            Conduct
          </Label>
          <div className="col-span-2">
            <Input
              id="conduct"
              name="conduct"
              value={formData.conduct}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 items-center gap-4">
          <Label
            htmlFor="lastSchoolAttend"
            className="text-right flex items-center justify-end"
          >
            Last School Attend <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="col-span-2">
            <Input
              id="lastSchoolAttend"
              name="lastSchoolAttend"
              value={formData.lastSchoolAttend}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 items-center gap-4">
          <Label
            htmlFor="lastSchoolStandard"
            className="text-right flex items-center justify-end"
          >
            Last School Standard <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="col-span-2">
            <Input
              id="lastSchoolStandard"
              name="lastSchoolStandard"
              value={formData.lastSchoolStandard}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Button
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-2"
            onClick={handleGenerateLC}
            disabled={
              !formData.leftDate ||
              !formData.class ||
              selectedStudents.length === 0
            }
          >
            Generate LC ({selectedStudents.length} Student
            {selectedStudents.length !== 1 ? "s" : ""})
          </Button>
        </div>
      </div>

      {/* Student List Dialog */}
      <Dialog open={showStudentList} onOpenChange={setShowStudentList}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student List</DialogTitle>
          </DialogHeader>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2 text-left">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAllStudents}
                      id="select-all"
                    />
                  </th>
                  <th className="border p-2 text-left">SRNO</th>
                  <th className="border p-2 text-left">ENROLLNO</th>
                  <th className="border p-2 text-left">GRNO</th>
                  <th className="border p-2 text-left">STUDENT</th>
                  <th className="border p-2 text-left">DIVISION</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="border p-2">
                      <Checkbox
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={() => handleStudentSelect(student.id)}
                        id={`student-${student.id}`}
                      />
                    </td>
                    <td className="border p-2">{student.srno}</td>
                    <td className="border p-2">{student.enrollNo}</td>
                    <td className="border p-2">{student.grno}</td>
                    <td className="border p-2">{student.name}</td>
                    <td className="border p-2">{student.division}</td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="border p-4 text-center text-gray-500"
                    >
                      No students found for the selected class.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStudentList(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleChooseSelected}
              disabled={selectedStudents.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Choose Selected ({selectedStudents.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
