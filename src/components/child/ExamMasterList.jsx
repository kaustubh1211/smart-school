import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PenSquare, ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import ExamMasterForm from "./ExamMasterForm";
import { useNavigate } from "react-router-dom";
import UpdateExamMaster from "./UpdateExamMaster";

export default function ExamMasterList() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [exams, setExams] = useState([
    {
      id: 1,
      section: "PRATHAMIK",
      standard: "STD V",
      examName: "2ND SEMESTER EAXM MARCH /APRIL - 2025",
      sequence: 1,
      published: false,
      createdOn: "2025-03-03T06:33:00",
    },
    {
      id: 2,
      section: "PRATHAMIK",
      standard: "STD V",
      examName: "ORAL & PRACTICAL EXAM - MARCH 2025",
      sequence: 1,
      published: false,
      createdOn: "2025-03-03T07:10:00",
    },
    // Add more sample data as needed
  ]);

  const addExam = (newExam) => {
    setExams([...exams, { id: exams.length + 1, ...newExam }]);
    setShowForm(false);
  };

  const handleNewExam = () => {
    setShowForm(true);
  };

  const handleCopy = (examId) => {
    const examToCopy = exams.find((exam) => exam.id === examId);
    if (examToCopy) {
      const newExam = {
        ...examToCopy,
        id: exams.length + 1,
        createdOn: new Date().toISOString(),
      };
      setExams([...exams, newExam]);
    }
  };

  const handleEdit = (examId) => {
    navigate(`/exam-masters/update/${examId}`);
  };

  const handleDelete = (examId) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      setExams(exams.filter((exam) => exam.id !== examId));
    }
  };
  return (
    <div className="p-6 bg-white min-h-screen">
      {showForm ? (
        <ExamMasterForm
          onSubmit={addExam}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <div className="container mx-auto p-4">
          <div className="mb-6 flex items-center justify-between bg-white p-2 shadow-sm">
            <div className="flex items-center gap-2">
              <PenSquare className="h-5 w-5" />
              <h1 className="text-xl font-semibold">Exam Master</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                onClick={handleNewExam}
              >
                <Plus className="h-4 w-4" />
                New Exam
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] ">SRNO</TableHead>
                  <TableHead>SECTION</TableHead>
                  <TableHead>STANDARD</TableHead>
                  <TableHead className="w-[250px] ">EXAM NAME</TableHead>
                  <TableHead className="w-[100px] ">SEQUENCE</TableHead>
                  <TableHead className="w-[100px] ">PUBLISHED</TableHead>
                  <TableHead className="w-[180px] ">CREATED ON</TableHead>
                  <TableHead className="w-[200px]  text-center">
                    ACTIONS
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exams.map((exam, index) => (
                  <TableRow key={exam.id}>
                    <TableCell className="pt-1 px-6">{index + 1}</TableCell>
                    <TableCell className="pt-1 px-6">{exam.section}</TableCell>
                    <TableCell className="pt-1 px-6">{exam.standard}</TableCell>
                    <TableCell className="text-blue-500">
                      {exam.examName}
                    </TableCell>
                    <TableCell className="pt-1 px-6">{exam.sequence}</TableCell>
                    <TableCell className="pt-1 px-6">{exam.published ? "Yes" : "No"}</TableCell>
                    <TableCell className="pt-1 px-6">
                      {format(new Date(exam.createdOn), "dd-MM-yyyy hh:mm a")}
                    </TableCell>
                    <TableCell className="pt-1 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="link"
                          className="text-blue-500 pt-1 px-6"
                          onClick={() => handleCopy(exam.id)}
                        >
                          Copy
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="pt-1 px-6"
                          onClick={() => handleEdit(exam.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 pt-1 px-6"
                          onClick={() => handleDelete(exam.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
