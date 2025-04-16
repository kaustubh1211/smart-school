import React, { useState } from "react";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import TimePicker from "react-time-picker";

const AddSubjectModal = ({ isOpen, onClose, onSave }) => {
  const [newSubject, setNewSubject] = useState({
    name: "",
    assessment: "EXAM",
    examDate: new Date(),
    fromTime: "10:30",
    toTime: "12:30",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setNewSubject((prev) => ({
      ...prev,
      examDate: date,
    }));
  };

  const handleTimeChange = (field, time) => {
    setNewSubject((prev) => ({
      ...prev,
      [field]: time,
    }));
  };

  const handleSave = () => {
    if (!newSubject.name.trim()) {
      alert("Please enter a subject name");
      return;
    }
    onSave([newSubject]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Add New Subject</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject Name
            </label>
            <input
              type="text"
              name="name"
              value={newSubject.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter subject name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assessment Type
            </label>
            <select
              name="assessment"
              value={newSubject.assessment}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="EXAM">Exam</option>
              <option value="TEST">Test</option>
              <option value="QUIZ">Quiz</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exam Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newSubject.examDate
                    ? format(newSubject.examDate, "PPP")
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={newSubject.examDate}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <TimePicker
                value={newSubject.fromTime}
                onChange={(time) => handleTimeChange("fromTime", time)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <TimePicker
                value={newSubject.toTime}
                onChange={(time) => handleTimeChange("toTime", time)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="border-t p-4 flex justify-end space-x-4">
          <button
            className="px-6 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSubjectModal;
