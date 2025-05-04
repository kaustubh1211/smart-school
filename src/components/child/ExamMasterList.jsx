import { useEffect, useState } from "react";
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
import axios from "axios";
import { useSelector } from "react-redux";
import Toast from "../ui/Toast";

export default function ExamMasterList() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchClass, setFetchClass] = useState([]);

  // Get access token from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Get tenant and academicYear from Redux state
  const tenant = useSelector((state) => state.branch.tenant);
  const academicYear = useSelector((state) => state.branch.academicYear);

  // Fetch exams on component mount
  useEffect(() => {
    fetchExams();
    fetchClassData();
  }, []);

  // Function to fetch exams from API
  const fetchExams = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_LOCAL_API_URL}exam/list`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        setExams(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
      Toast.showErrorToast("Error fetching exams");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch class data for mapping class IDs to names
  const fetchClassData = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_LOCAL_API_URL
        }class/list?medium=${tenant}&year=${academicYear}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setFetchClass(response.data.data || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  // Helper function to get class name from class ID
  const getClassName = (classId) => {
    const classObj = fetchClass.find((cls) => cls.id === classId);
    return classObj ? classObj.class : classId;
  };

  // Helper function to get section name from class ID
  const getSectionName = (classId) => {
    const classObj = fetchClass.find((cls) => cls.id === classId);
    return classObj ? classObj.category : "Unknown";
  };

  const addExam = (newExam) => {
    // After adding a new exam, refresh the exam list
    fetchExams();
    setShowForm(false);
  };

  const handleNewExam = () => {
    setShowForm(true);
  };

  const handleEdit = (examId) => {
    const examToEdit = exams.find((exam) => exam.id === examId);
    if (examToEdit) {
      navigate(`/exam-masters/update/${examId}`, {
        state: { exam: examToEdit },
      });
    }
  };

  const handleDelete = async (examId) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_LOCAL_API_URL}exam/delete?id=${examId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        Toast.showSuccessToast("Exam deleted successfully");
        fetchExams();
      } else {
        Toast.showErrorToast("Failed to delete exam");
      }
    } catch (error) {
      console.error("Error deleting exam:", error);
      Toast.showErrorToast("Error deleting exam");
    } finally {
      setIsLoading(false);
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

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px] ">SRNO</TableHead>
                    <TableHead>SECTION</TableHead>
                    <TableHead>STANDARD</TableHead>
                    <TableHead className="w-[250px] ">EXAM NAME</TableHead>
                    <TableHead className="w-[180px] ">CREATED ON</TableHead>
                    <TableHead className="w-[200px] text-center">
                      ACTIONS
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exams.length > 0 ? (
                    exams.map((exam, index) => (
                      <TableRow key={exam.id}>
                        <TableCell className="pt-1 px-6">{index + 1}</TableCell>
                        <TableCell className="pt-1 px-6">
                          {exam.class?.category}
                        </TableCell>
                        <TableCell className="pt-1 px-6">
                          {exam.class?.class}
                        </TableCell>
                        <TableCell className="text-blue-500">
                          {exam.examName}
                        </TableCell>
                        <TableCell className="pt-1 px-6">
                          {exam.createdAt
                            ? format(
                                new Date(exam.createdAt),
                                "dd-MM-yyyy hh:mm a"
                              )
                            : "N/A"}
                        </TableCell>
                        <TableCell className="pt-1 px-6">
                          <div className="flex items-center justify-center gap-2">
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
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No exams found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
