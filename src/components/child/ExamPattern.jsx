import React, { useState } from "react";
import Toast from "../ui/Toast";
import { CalendarIcon, Edit, Trash2 } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import AddAssessmentModal from "./AddAssessmentModal";

const ExamPattern = () => {
  const [isAddAssessmentModalOpen, setIsAddAssessmentModalOpen] = useState(false)
  const [assessments, setAssessments] = useState([
    {
      id: 1,
      name: "EXAM",
      linkedExam: "",
      isExternal: "Yes",
      max: 100,
      min: 35,
    },
    {
      id: 2,
      name: "EXAM",
      linkedExam: "",
      isExternal: "Yes",
      max: 100,
      min: 35,
    },
    {
      id: 3,
      name: "EXAM",
      linkedExam: "",
      isExternal: "Yes",
      max: 100,
      min: 35,
    },
  ]);
  const [subjects, setSubjects] = useState([
    {
      id: 1,
      name: "HINDI",
      assessment: "EXAM",
      examDate: "27-03-2025",
      fromTime: "10:30 AM",
      toTime: "12:30 PM",
    },
    {
      id: 2,
      name: "MARATHI",
      assessment: "EXAM",
      examDate: "28-03-2025",
      fromTime: "10:30 AM",
      toTime: "12:30 PM",
    },
    {
      id: 3,
      name: "ENGLISH",
      assessment: "EXAM",
      examDate: "01-04-2025",
      fromTime: "10:30 AM",
      toTime: "12:30 PM",
    },
    {
      id: 4,
      name: "MATHEMATICS",
      assessment: "EXAM",
      examDate: "04-04-2025",
      fromTime: "10:30 AM",
      toTime: "12:30 PM",
    },
    {
      id: 5,
      name: "GENERAL SCIENCE",
      assessment: "EXAM",
      examDate: "03-04-2025",
      fromTime: "10:30 AM",
      toTime: "12:30 PM",
    },
    {
      id: 6,
      name: "SOCIAL SCIENCE",
      assessment: "EXAM",
      examDate: "07-04-2025",
      fromTime: "10:30 AM",
      toTime: "12:30 PM",
    },
  ]);

  const [newSubject, setNewSubject] = useState({
    name: "",
    assessment: "EXAM",
    examDate: "",
    fromTime: "10:30 AM",
    toTime: "12:30 PM",
  });

  const handleAddAssessment = (newAssessment) =>{
    setAssessments([...assessments, {id: assessments.length + 1, ...newAssessment}])
    console.log(assessments)
    setIsAddAssessmentModalOpen(false)
  } 

  const handleDeleteAssessment = (id) => {
    setAssessments(assessments.filter((assessment) => id !== assessment.id));
  };

  const handleDeleteSubject = (id) => {
    setSubjects(subjects.filter((subject) => id !== subject.id));
  };

  const handleAddSubject = () => {
    if (newSubject.name) {
      setSubjects([...subjects, { id: subjects.length + 1, ...newSubject }]);
      setNewSubject({
        name: "",
        assessment: "EXAM",
        examDate: "",
        fromTime: "10:30 AM",
        toTime: "12:30 PM",
      });
    }
  };

  const handleSaveTimetable = () => {
    console.log("Saving TimeTable: ", { assessments, subjects });
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
        
        <button className="px-4 py-2 bg-white text-red-500 border border-red-500 rounded hover:bg-red-50 transition-colors">
          Add Assessemnt Pattern
        </button>
      </div>
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 ">
              <tr className="font-bold">
                <th className="px-6 py-1 text-left text-sm font-medium  tracking-wider">
                  Assessment
                </th>
                <th className="px-6 py-1 text-left text-sm font-medium  tracking-wider">
                  Linked Exam
                </th>
                <th className="px-6 py-1 text-left text-sm font-medium  tracking-wider">
                  Is External
                </th>
                <th className="px-6 py-1 text-left text-sm font-medium  tracking-wider">
                  Max
                </th>
                <th className="px-6 py-1 text-left text-sm font-medium  tracking-wider">
                  Min
                </th>
                <th className="px-6 py-1 text-left text-sm font-medium  tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assessments.map((assessment) => (
                <tr key={assessment.id}>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                    {assessment.name}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                    {assessment.linkedExam}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                    {assessment.isExternal}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                    {assessment.max}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                    {assessment.min}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-between space-x-2">
                      <button className="text-blue-500 hover:text-blue-700">
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteAssessment(assessment.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="my-4 flex justify-between ">
          <button className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors" onClick={()=>{setIsAddAssessmentModalOpen(true)}}>
            Add Assessment
          </button>
          <button
            className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-500 transition-colors"
            onClick={handleAddSubject}
          >
            Add Subject
          </button>
        </div>

        <AddAssessmentModal
          isOpen={isAddAssessmentModalOpen}
          onClose={() => setIsAddAssessmentModalOpen(false)}
          onSave={handleAddAssessment}
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
                            className="justify-start text-left font-normal"
                          >
                            <CalendarIcon className="" />
                            <span className="mr-2">{subject.examDate}</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </td>
                  <td className="px-6 pt-3  whitespace-nowrap text-sm text-gray-900">
                    {subject.fromTime}
                  </td>
                  <td className="px-6 pt-3  whitespace-nowrap text-sm text-gray-900">
                    {subject.toTime}
                  </td>
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
