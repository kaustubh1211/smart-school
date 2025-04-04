import { format } from "date-fns";
import { ArrowLeft, CalendarIcon, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
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
import axios from "axios";
import Toast from "../../components/ui/Toast";
import dayjs from "dayjs";

export default function BulkGenerateLC() {
  const accessToken = localStorage.getItem("accessToken");
  const tenant = useSelector((state) => state.branch.tenant);
  const academicYear = useSelector((state) => state.branch.academicYear);

  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [students, setStudents] = useState([]);

  const [formData, setFormData] = useState({
    leftDate: "",
    classId: "",
    className: "",
    classStudying: "",
    leftReason: "",
    remark: "NO DUES.",
    progress: "SATISFACTORY",
    conduct: "GOOD",
    lastSchoolAttend: "Shri Raghubir Prathamik Vidyalaya",
    lastSchoolStandard: "IV ( FOURTH )",
  });

  const [showStudentList, setShowStudentList] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Fetch classes on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoadingClasses(true);
        const response = await axios.get(
          `${import.meta.env.VITE_LOCAL_API_URL}certificate/class-lc/bulk`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              mediumName: tenant,
              academicYearName: academicYear,
            },
          }
        );
        setClasses(response.data.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
        alert("Failed to fetch classes");
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, []);

  // Fetch students when class is selected
  useEffect(() => {
    const fetchStudents = async () => {
      if (!formData.classId) return;

      try {
        setLoadingStudents(true);
        const response = await axios.get(
          `${
            import.meta.env.VITE_LOCAL_API_URL
          }certificate/students-list/class`,
          {
            params: {
              classId: formData.classId,
            },
          }
        );
        setStudents(response.data.data);
      } catch (error) {
        console.error("Error fetching students:", error);
        alert("Failed to fetch students");
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [formData.classId]);

  // Update classStudying and leftReason based on selected class
  useEffect(() => {
    if (formData.className.includes("STD VII")) {
      setFormData((prev) => ({
        ...prev,
        classStudying: "STD 7TH (SEVENTH) SINCE JUNE 2023",
        leftReason: "PASSED STD 7TH (SEVENTH) IN APRIL 2024",
      }));
    } else if (formData.className.includes("STD X")) {
      setFormData((prev) => ({
        ...prev,
        classStudying: "STD 10TH (TENTH) SINCE JUNE 2023",
        leftReason: "PASSED STD 10TH (TENTH) IN APRIL 2024",
      }));
    }
  }, [formData.className]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    const selectedClass = classes.find((cls) => cls.id === value);
    setFormData((prev) => ({
      ...prev,
      classId: value,
      className: selectedClass?.className || "",
    }));
    setSelectedStudents([]); // Reset selected students when class changes
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
      setSelectedStudents(students.map((student) => student.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleChooseSelected = () => {
    setShowStudentList(false);
  };

  const handleGenerateLC = async () => {
    if (!formData.leftDate || !formData.classId) {
      alert("Please fill in all required fields");
      return;
    }

    if (selectedStudents.length === 0) {
      alert("Please select at least one student");
      return;
    }

    try {
      const lcData = selectedStudents.map((studentId) => {
        const student = students.find((s) => s.id === studentId);
        return {
          studentId,
          leftDate: dayjs(formData.leftDate).format("DD-MM-YYYY"),
          issueDate: dayjs().format("DD-MM-YYYY"),
          leftReason: formData.leftReason,
          remark: formData.remark,
          progress: formData.progress,
          conduct: formData.conduct,
          lastSchoolAttend: formData.lastSchoolAttend,
          lastSchoolStandard: formData.lastSchoolStandard,
        };
      });

      const response = await axios.post(
        `${
          import.meta.env.VITE_LOCAL_API_URL
        }certificate/student-lc/bulk/generate`,
        lcData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // alert(`Generated LC for ${selectedStudents.length} students`);
      Toast.showSuccessToast(
        `Generated LC for ${selectedStudents.length} students`
      );

      navigate("/leaving-certificate/download");
    } catch (error) {
      console.error("Error generating LCs:", error);
      Toast.showErrorToast(`${error.response.data.message}`);

      // alert("Failed to generate LCs");
    }
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
              value={formData.classId}
              onValueChange={handleSelectChange}
              disabled={loadingClasses}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={loadingClasses ? "Loading..." : "Select a class"}
                >
                  {formData.className || "Select a class"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.className}
                  </SelectItem>
                ))}
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
              disabled={!formData.classId || loadingStudents}
            >
              {loadingStudents ? "Loading students..." : "Student List"}
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
              !formData.classId ||
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
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="border p-2">
                      <Checkbox
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={() => handleStudentSelect(student.id)}
                        id={`student-${student.id}`}
                      />
                    </td>
                    <td className="border p-2">{student.enrollNo}</td>
                    <td className="border p-2">{student.enrollNo}</td>
                    <td className="border p-2">{student.grNo}</td>
                    <td className="border p-2">{`${student.firstName} ${student.lastName}`}</td>
                    <td className="border p-2">{student.division}</td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="border p-4 text-center text-gray-500"
                    >
                      {loadingStudents
                        ? "Loading students..."
                        : "No students found for the selected class."}
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
