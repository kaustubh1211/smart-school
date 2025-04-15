import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PenSquare, ArrowLeft } from "lucide-react";
import ExamMasterForm from "./ExamMasterForm";
import Toast from "../ui/Toast";
import ExamPattern from "./ExamPattern";

const UpdateExamMaster = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [exam, setExam] = useState(null);

  useEffect(() => {
    // Here you would typically fetch the exam data from your API
    // For now, we'll simulate it with a timeout
    const fetchExam = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Mock exam data - replace this with actual API call
        const mockExam = {
          id: parseInt(id),
          section: "PRATHAMIK",
          standard: "STD V",
          examName: "Sample Exam",
          sequence: 1,
          published: false,
          createdOn: new Date().toISOString(),
          startDate: "2025-03-03",
          endDate: "2025-03-10",
          reportCardDate: "2025-03-15",
        };
        setExam(mockExam);
      } catch (error) {
        Toast.showErrorToast("Error fetching exam details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExam();
  }, [id]);

  const handleSubmit = async (updatedExam) => {
    setIsLoading(true);
    try {
      // Here you would typically make an API call to update the exam
      await new Promise((resolve) => setTimeout(resolve, 1000));
      Toast.showSuccessToast("Exam updated successfully");
      navigate("/exam-masters");
    } catch (error) {
      Toast.showErrorToast("Error updating exam");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/exam-masters");
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
        <div className="loader"></div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Exam not found
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ExamMasterForm
        initialData={exam}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        name="Update"
      />
      <ExamPattern />
    </div>
  );
};

export default UpdateExamMaster;
