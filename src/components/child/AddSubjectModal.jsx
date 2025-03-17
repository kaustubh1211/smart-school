import React, { useEffect, useState } from "react";

const AddSubjectModal = ({ isOpen, onClose, onSave, existingSubjects }) => {
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

  useEffect(() => {
    if (isOpen) {
      setSelectedSubjects(existingSubjects.map((subject) => subject.name));
    }
  }, [isOpen, existingSubjects]);

  const toggleSubject = (subject) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const handleSelectAll = () => {
    setSelectedSubjects(
      selectedSubjects.length === subjects.length ? [] : subjects
    );
  };

  const handleSave = () => {
    onSave(selectedSubjects);
    onClose();
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
        <div className="p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">
                  <input
                    id="default-checkbox"
                    type="checkbox"
                    value=""
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    checked={selectedSubjects.length === subjects.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-4 py-2 text-left font-semibold">Subject</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">
                    <input
                      id="default-checkbox"
                      type="checkbox"
                      value=""
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      checked={selectedSubjects.includes(subject)}
                      onChange={() => toggleSubject(subject)}
                    />
                  </td>
                  <td
                    for="default-checkbox"
                    className=" px-4 py-2 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    {subject}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
