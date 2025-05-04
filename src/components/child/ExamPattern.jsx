import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Toast from "../ui/Toast";
import { CalendarIcon, Edit, Trash2 } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import AddAssessmentModal from "./AddAssessmentModal";
import AddSubjectModal from "./AddSubjectModal";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import { format } from "date-fns";

const ExamPattern = () => {
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [subjects, setSubjects] = useState([]);

  const [newSubject, setNewSubject] = useState({
    name: "",
    assessment: "EXAM",
    examDate: "",
    fromTime: "10:30 AM",
    toTime: "12:30 PM",
  });

  const handleDeleteSubject = (id) => {
    setSubjects(subjects.filter((subject) => id !== subject.id));
  };

  const handleAddSubjects = (newSubjects) => {
    const updatedSubjects = newSubjects.map((subject) => ({
      id: subjects.length + 1,
      ...subject,
    }));
    setSubjects([...subjects, ...updatedSubjects]);
    setIsAddSubjectModalOpen(false);
  };

  const handleDateChange = (id, newDate) => {
    setSubjects(
      subjects.map((subject) =>
        subject.id === id ? { ...subject, examDate: newDate } : subject
      )
    );
  };

  const handleTimeChange = (id, field, newTime) => {
    setSubjects(
      subjects.map((subject) =>
        subject.id === id ? { ...subject, [field]: newTime } : subject
      )
    );
  };

  const handleSaveTimetable = () => {
    console.log("Saving TimeTable: ", { subjects });
    Toast.showSuccessToast("TimeTable saved successfully");
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between bg-white rounded p-3 items-center mb-2">
        <div className="flex items-center ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-orange-500 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h1 className="text-xl font-semibold">Exam Pattern</h1>
        </div>
      </div>
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="my-4 flex justify-between ">
          <button
            className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-500 transition-colors"
            onClick={() => setIsAddSubjectModalOpen(true)}
          >
            Add Subject
          </button>
        </div>
        <AddSubjectModal
          isOpen={isAddSubjectModalOpen}
          onClose={() => setIsAddSubjectModalOpen(false)}
          onSave={handleAddSubjects}
          existingSubjects={subjects}
        />

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr className="font-bold">
                <th className="px-6 py-1 text-left text-sm font-medium tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-1 text-left text-sm font-medium tracking-wider">
                  Assessment
                </th>
                <th className="px-6 py-1 text-left text-sm font-medium tracking-wider">
                  Exam Date
                </th>
                <th className="px-6 py-1 text-left text-sm font-medium tracking-wider">
                  From Time
                </th>
                <th className="px-6 py-1 text-left text-sm font-medium tracking-wider">
                  To Time
                </th>
                <th className="px-6 py-1 text-left text-sm font-medium tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subjects.map((subject) => (
                <tr key={subject.id}>
                  <td className="px-6 pt-3  whitespace-nowrap text-sm text-gray-900">
                    {subject.name}
                  </td>
                  <td className="px-6 pt-3  whitespace-nowrap text-sm text-gray-900">
                    {subject.assessment}
                  </td>
                  <td className="px-6 py-1  whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-10">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-3/4 justify-start text-left font-normal",
                              !subject.examDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {subject.examDate
                              ? format(subject.examDate, "PPP")
                              : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={subject.examDate}
                            onSelect={() => {
                              setSubjects(subject.examDate);
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </td>
                  <td className="whitespace-nowrap text-sm text-gray-900">
                    <TimePicker
                      value={subject.fromTime}
                      onChange={(newTime) =>
                        handleTimeChange(subject.id, "fromTime", newTime)
                      }
                    />
                  </td>
                  <td className=" whitespace-nowrap text-sm text-gray-900">
                    <TimePicker
                      value={subject.toTime}
                      onChange={(newTime) =>
                        handleTimeChange(subject.id, "toTime", newTime)
                      }
                      className={cn(`flex flex-row`)}
                    />
                  </td>
                  {/* <td className="px-6 pt-3  whitespace-nowrap text-sm text-gray-900">
                    {subject.fromTime}
                  </td>
                  <td className="px-6 pt-3  whitespace-nowrap text-sm text-gray-900">
                    {subject.toTime}
                  </td> */}
                  <td className="px-6 pt-3  whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteSubject(subject.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            className="px-12 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            onClick={handleSaveTimetable}
          >
            Save Timetable
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamPattern;
