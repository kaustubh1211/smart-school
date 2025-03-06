import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import Toast from "../ui/Toast";

const AddAssessmentModal = ({ isOpen, onClose, onSave }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showLinkedAssessment, setShowLinkedAssessment] = useState(false);
  const [newAssessment, setNewAssessment] = useState({
    name: "",
    linkedExam: "",
    isExternal: "Internal",
    max: "",
    min: "",
  });

  const toggleLinkAssessment = () => {
    setShowLinkedAssessment(!showLinkedAssessment);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (newAssessment.name && newAssessment.max && newAssessment.min) {
        onSave({
          ...newAssessment,
          isExternal: newAssessment.isExternal === "External" ? "Yes" : "No",
          max: Number.parseInt(newAssessment.max),
          min: Number.parseInt(newAssessment.min),
        });
        setNewAssessment({
          name: "",
          linkedExam: "",
          isExternal: "Internal",
          max: "",
          min: "",
        });
        setShowLinkedAssessment(false);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      Toast.showSuccessToast("Assessment added successfully");
    } catch (error) {
      Toast.showErrorToast("Error adding assessment!");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Add Exam Pattern</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-[150px_1fr] items-center gap-4">
            <label className="text-right form-label text-sm pb-24 ">
              Assessment <span className="text-red-500">*</span>
            </label>
            <div>
              <select
                className="w-full border rounded p-2"
                value={newAssessment.name}
                onChange={(e) =>
                  setNewAssessment({ ...newAssessment, name: e.target.value })
                }
              >
                <option value="">-- Assessment --</option>
                <option value="EXAM">EXAM</option>
                <option value="TEST">TEST</option>
                <option value="QUIZ">QUIZ</option>
              </select>
              <button
                className="text-blue-500 hover:text-blue-700 text-sm mt-1 ml-2"
                onClick={toggleLinkAssessment}
              >
                Link Assessment to Exam
              </button>
            </div>
          </div>
          {showLinkedAssessment && (
            <div className="grid grid-cols-[150px_1fr] items-center gap-4">
              <label className="text-right form-label">
                Exam <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border rounded p-2 mt-2"
                value={newAssessment.linkedExam}
                onChange={(e) =>
                  setNewAssessment({
                    ...newAssessment,
                    linkedExam: e.target.value,
                  })
                }
              >
                --Select Linked Exam --
                <option value="">-- Select Linked Exam --</option>
                <option value="FINAL">FINAL</option>
                <option value="MIDTERM">MIDTERM</option>
              </select>
            </div>
          )}

          <div className="grid grid-cols-[150px_1fr] items-center gap-4">
            <label className="text-right form-label">
              Max Mark <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className="w-full border rounded p-2"
              value={newAssessment.max}
              onChange={(e) =>
                setNewAssessment({ ...newAssessment, max: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-[150px_1fr] items-center gap-4">
            <label className="text-right form-label">
              Min Mark <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className="w-full border rounded p-2"
              value={newAssessment.min}
              onChange={(e) =>
                setNewAssessment({ ...newAssessment, min: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-[150px_1fr] items-center gap-4">
            <label className="text-right form-label">
              Assessment Type <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-6">
              <RadioGroup
                className="flex gap-4"
                value={newAssessment.isExternal}
                onValueChange={(value) =>
                  setNewAssessment({ ...newAssessment, isExternal: value })
                }
              >
                <div className="flex space-x-2">
                  <RadioGroupItem value="Internal" id="Internal" />
                  <Label htmlFor="internal">Internal</Label>
                </div>
                <div className="flex space-x-2">
                  <RadioGroupItem value="External" id="External" />
                  <Label htmlFor="external">External</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        <div className="border-t p-4 flex justify-end space-x-10">
          <button
            className="px-20 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="px-20 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            onClick={handleSave}
          >
            Save
          </button>
          {isLoading && (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
              <div className="loader"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddAssessmentModal;
