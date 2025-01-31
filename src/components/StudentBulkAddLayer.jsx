import React, { useState } from "react";
import axios from "axios";
import { Upload } from "lucide-react";
import Papa from "papaparse";

const StudentBulkAddLayer = () => {
  const accessToken = localStorage.getItem("accessToken");

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const expectedHeaders = [
    "grNo",
    "rollNo",
    "class",
    "division",
    "firstName",
    "lastName",
    "gender",
    "dob",
    "category",
    "religion",
    "caste",
    "admissionDate",
    "bloodGroup",
    "house",
    "height",
    "weight",
    "fatherName",
    "fatherPhone",
    "fatherOccupation",
    "fatherEmail",
    "motherName",
    "motherPhone",
    "motherOccupation",
    "motherEmail",
    "address",
    "city",
    "state",
    "postCode",
    "guardianName",
    "guardianEmail",
    "guardianOccupation",
    "guardianPhone",
    "guardianRelation",
    "mediumName",
    "academicYearName",
  ];

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) {
      setError("No file selected.");
      setFile(null);
      return;
    }

    if (uploadedFile.type !== "text/csv") {
      setError("Invalid file type. Please upload a CSV file.");
      setFile(null);
      return;
    }

    setError("");
    setFile(uploadedFile);
  };

  const handleFileUpload = () => {
    if (!file) {
      setError("Please select a file before uploading.");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        const { data, errors, meta } = result;

        if (errors.length) {
          setError("Error parsing the file. Ensure it's a valid CSV.");
          return;
        }

        // Validate headers
        const headers = meta.fields;
        const isValid = expectedHeaders.every((header) =>
          headers?.includes(header)
        );

        if (!isValid) {
          setError(
            `Invalid headers. Expected headers: ${expectedHeaders.join(", ")}`
          );
          return;
        }

        setError("");
        await sendDataToBackend(data);
      },
    });
  };

  const sendDataToBackend = async (data) => {
    setLoading(true);
    setError("");
    setSuccess("");
    console.log(data);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_LOCAL_API_URL}admin/add-student-bulk`,
        { data },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccess("File uploaded and data saved successfully.");
        setFile(null);
      } else {
        setError("Failed to save data.");
      }
    } catch (err) {
      setError("An error occurred while uploading data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-lg font-bold mb-3">Add Student in Bulk</div>
      <div className="card text-sm h-100 radius-12">
        <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
          <div className="flex sm:flex-row flex-col justify-between align-middle card-body sm:gap-5 gap-4">
            <input
              type="file"
              className="form-control w-60 sm:w-full form-control-lg"
              id="data-upload"
              accept=".csv"
              onChange={handleFileChange}
            />

            <button
              type="button"
              className={`text-md ${
                loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              } text-neutral-100 radius-8 px-24 sm:py-0 py-3 text-nowrap`}
              onClick={handleFileUpload}
              disabled={loading}
            >
              <div className="flex flex-row justify-center items-center align-middle">
                <Upload size={20} className="mr-10" />
                <span className="flex flex-row items-center">
                  {loading ? "Uploading..." : "Upload Excel"}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
      {loading && <p className="text-blue-500">Uploading and processing...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
    </div>
  );
};

export default StudentBulkAddLayer;
