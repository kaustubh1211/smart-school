import React, { useState } from "react";

const AddSubjectModal = ({ isOpen, onClose, onSave }) => {
  const subjects = [
    "SCIENCE",
    "HINDI",
    "MARATHI",
    "ENGLISH",
    "MATHEMATICS",
    "E.V.S. 1",
    "E.V.S. 2",
    "ART",
    "WORK EXPERIENCE",
    "P. T.",
  ];

  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const toggleSubject = (subject) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const handleSelectAll = () => {
    if (selectedSubjects.length === subjects.length) {
      setSelectedSubjects([]);
    } else {
      setSelectedSubjects(subjects);
    }
  };

  if (!isOpen) return;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Subject List</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSubjectModal;
