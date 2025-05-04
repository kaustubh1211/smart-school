import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PenSquare, ArrowLeft, CalendarIcon } from "lucide-react";
import dayjs from "dayjs";
import axios from "axios";
import Toast from "../ui/Toast";

const UpdateExamMaster = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [exam, setExam] = useState(null);
  const [timeTable, setTimeTable] = useState([]);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchExamData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_LOCAL_API_URL}exam/details?examId=${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.data.success) {
          setExam(response.data.data.exam);
          setTimeTable(response.data.data.timeTable || []);
        } else {
          Toast.showErrorToast("Error fetching exam details");
        }
      } catch (error) {
        console.error("Error fetching exam details:", error);
        Toast.showErrorToast("Error fetching exam details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchExamData();
    }
  }, [id, accessToken]);

  const handleCancel = () => {
    navigate("/exam-masters");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-medium">Exam not found</div>
      </div>
    );
  }

  // Format dates for display
  const startDate = new Date(exam.startDate);
  const endDate = new Date(exam.endDate);
  const reportCardDate = exam.reportCardDate
    ? new Date(exam.reportCardDate)
    : null;

  return (
    <div className="col-md-6 w-full px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex bg-white p-2 shadow-sm">
        <div className="flex items-center gap-4 w-full">
          <PenSquare className="h-4 w-4" />
          <h1 className="text-xl font-semibold">Exam Details</h1>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" className="gap-2" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Card className="p-5">
          <CardContent className="space-y-4">
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <label className="form-label text-right">Class</label>
              <div className="form-control-wrapper">
                <input
                  type="text"
                  value={`${exam.class.class}`}
                  className="form-control radius-12 "
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <label className="form-label text-right">Exam</label>
              <div>
                <input
                  value={exam.examName}
                  className="form-control radius-12"
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <label className="form-label text-right">From</label>
              <div className="flex items-center">
                <div className="flex-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-slate-300"
                        )}
                        disabled
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dayjs(startDate).format("MMM DD, YYYY")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        disabled
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="mx-4">To</div>
                <div className="flex-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-slate-300"
                        )}
                        disabled
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dayjs(endDate).format("MMM DD, YYYY")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        disabled
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <label className="form-label text-right">Report Card</label>
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-slate-300"
                      )}
                      disabled
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {reportCardDate
                        ? dayjs(reportCardDate).format("MMM DD, YYYY")
                        : "Not specified"}
                    </Button>
                  </PopoverTrigger>
                  {reportCardDate && (
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={reportCardDate}
                        disabled
                        initialFocus
                      />
                    </PopoverContent>
                  )}
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subjects/Timetable Section */}
        <div className="bg-white border border-gray-200 rounded-lg h-auto">
          <div className="mt-4 p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Exam Timetable</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assessment
                    </th>
                    <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exam Date
                    </th>
                    <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      From Time
                    </th>
                    <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      To Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {timeTable.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No timetable found
                      </td>
                    </tr>
                  ) : (
                    timeTable.map((subject) => (
                      <tr key={subject.id}>
                        <td className="px-6 py-2 whitespace-nowrap">
                          {subject.subject}
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap">
                          {subject.assessment}
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap">
                          {dayjs(subject.examDate).format("DD-MM-YYYY")}
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap">
                          {dayjs(subject.startTime).format("hh:mm A")}
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap">
                          {dayjs(subject.endTime).format("hh:mm A")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateExamMaster;
