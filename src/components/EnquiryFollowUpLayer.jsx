import { useState, useEffect, useRef } from "react";
import { ArrowLeft, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Toast from "../components/ui/Toast";

export default function EnquiryFollowUpLayer() {
  const accessToken = localStorage.getItem("accessToken");
  const { id } = useParams();
  const navigate = useNavigate();

  // Form states
  const [date] = useState("12-04-2025"); // Read-only date
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [callType, setCallType] = useState("Telephonic");
  const [strength, setStrength] = useState("Hot");
  const [nextStage, setNextStage] = useState("NEW");
  const [remark, setRemark] = useState("");
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");
  const [nextFollowUpTime, setNextFollowUpTime] = useState("");
  const [nextFollowUpRemark, setNextFollowUpRemark] = useState("");
  const [followUps, setFollowUps] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showNextFollowUp, setShowNextFollowUp] = useState(true);

  // References for date and time pickers
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);
  const nextDateInputRef = useRef(null);
  const nextTimeInputRef = useRef(null);

  const fetchFollowUps = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_LOCAL_API_URL
        }enquiry/followup/list?enquiryId=${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setFollowUps(response.data.data);
    } catch (error) {
      console.error("Error fetching follow-ups:", error);
    }
  };

  // Fetch follow-up history
  useEffect(() => {
    fetchFollowUps();
  }, [id]);

  // Validate form
  useEffect(() => {
    const isValid = date && callType && strength && nextStage;
    setIsFormValid(isValid);
  }, [date, callType, strength, nextStage]);

  // Format time function
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    if (isNaN(parseInt(hours)) || isNaN(parseInt(minutes))) return "";
    const h = parseInt(hours, 10);
    const period = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${String(h12).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )} ${period}`;
  };

  // Handle time picker clicks
  const handleTimeClick = (ref) => {
    if (ref.current) {
      ref.current.showPicker();
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const formData = {
      enquiryId: id,
      date,
      startTime,
      endTime,
      callType,
      strength,
      status: nextStage,
      remark,
      nextFollowUpDate: nextFollowUpDate || "",
      nextFollowUpTime: nextFollowUpTime || "",
      nextFollowUpRemark: nextFollowUpRemark || "",
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_LOCAL_API_URL}enquiry/followup/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      Toast.showSuccessToast("Follow-up submitted successfully!");
      fetchFollowUps();
    } catch (error) {
      if (error.response) {
        Toast.showWarningToast(`${error.response.data.message}`);
        console.log(error.response.data.message);
      } else if (error.request) {
        Toast.showErrorToast("Sorry, our server is down");
      } else {
        Toast.showErrorToast("Sorry, please try again later");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center py-3 border-b mb-3">
        <div className="flex items-center gap-2">
          <FileEdit className="h-5 w-5 text-orange-500" />
          <h1 className="text-xl font-medium">Enquiry FollowUp</h1>
        </div>
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => navigate("/enquiry")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-center">
            <Label htmlFor="date" className="w-24 text-right pr-4">
              Date <span className="text-red-500">*</span>
            </Label>
            <div className="flex-1 relative">
              <Input
                id="date"
                type="text"
                value={date}
                readOnly
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-500"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <Label htmlFor="timing" className="w-24 text-right pr-4">
              Timing
            </Label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  id="startTime"
                  type="text"
                  value={startTime}
                  readOnly
                  className="pr-10"
                  onClick={() => handleTimeClick(startTimeRef)}
                />
                <input
                  ref={startTimeRef}
                  type="time"
                  className="absolute inset-0 opacity-0 w-full h-full"
                  onChange={(e) => {
                    setStartTime(formatTime(e.target.value));
                  }}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => handleTimeClick(startTimeRef)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-500"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 relative">
                <Input
                  id="endTime"
                  type="text"
                  value={endTime}
                  readOnly
                  className="pr-10"
                  onClick={() => handleTimeClick(endTimeRef)}
                />
                <input
                  ref={endTimeRef}
                  type="time"
                  className="absolute inset-0 opacity-0 w-full h-full"
                  onChange={(e) => {
                    setEndTime(formatTime(e.target.value));
                  }}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => handleTimeClick(endTimeRef)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-500"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-center">
            <Label htmlFor="callType" className="w-24 text-right pr-4">
              Call Type <span className="text-red-500">*</span>
            </Label>
            <Select value={callType} onValueChange={setCallType}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select call type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Telephonic">Telephonic</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="SMS/WhatsApp">SMS/WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center">
            <Label htmlFor="strength" className="w-24 text-right pr-4">
              Strength <span className="text-red-500">*</span>
            </Label>
            <Select value={strength} onValueChange={setStrength}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select strength" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hot">Hot</SelectItem>
                <SelectItem value="Warm">Warm</SelectItem>
                <SelectItem value="Cold">Cold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Follow Up Detail Section */}
        <div className="mb-8 mt-32">
          <div className="flex items-center gap-2 mb-4 border-b pb-2">
            <FileEdit className="h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-medium">Follow Up Detail</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-6">
            <div className="flex items-center w-1/2">
              <Label htmlFor="nextStage" className="w-24 text-right pr-1">
                Next Stage <span className="text-red-500">*</span>
              </Label>
              <Select
                value={nextStage}
                onValueChange={(value) => {
                  setNextStage(value);
                  setShowNextFollowUp(value === "NEW");
                }}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select next stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEW">New Enquiry</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-start">
              <Label htmlFor="remark" className="w-24 text-right pr-4 pt-2">
                Remark
              </Label>
              <Textarea
                id="remark"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="flex-1 min-h-[50px]"
              />
            </div>
          </div>
        </div>

        {/* Next Follow Up Reminder Section */}
        {showNextFollowUp && (
          <div className="mb-8 mt-32">
            <div className="flex items-center gap-2 mb-4 border-b pb-2">
              <FileEdit className="h-5 w-5 text-orange-500" />
              <h2 className="text-lg font-medium">Next Follow Up Reminder</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center">
                <Label
                  htmlFor="nextFollowUpDate"
                  className="w-48 text-right pr-4"
                >
                  Next Follow Up Date
                </Label>
                <div className="flex-1 relative">
                  <Input
                    id="nextFollowUpDate"
                    type="text"
                    value={nextFollowUpDate}
                    readOnly
                    className="pr-10"
                    onClick={() => {
                      if (nextDateInputRef.current) {
                        nextDateInputRef.current.showPicker?.();
                        nextDateInputRef.current.click?.();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => {
                      if (nextDateInputRef.current) {
                        nextDateInputRef.current.showPicker?.();
                        nextDateInputRef.current.click?.();
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-500"
                    >
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                    <input
                      ref={nextDateInputRef}
                      type="date"
                      className="sr-only"
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        const formattedDate = `${String(
                          date.getDate()
                        ).padStart(2, "0")}-${String(
                          date.getMonth() + 1
                        ).padStart(2, "0")}-${date.getFullYear()}`;
                        setNextFollowUpDate(formattedDate);
                      }}
                    />
                  </button>
                </div>
                <div className="flex-1 relative ml-2">
                  <Input
                    id="nextFollowUpTime"
                    type="text"
                    value={nextFollowUpTime}
                    readOnly
                    className="pr-10"
                    onClick={() => handleTimeClick(nextTimeInputRef)}
                  />
                  <input
                    ref={nextTimeInputRef}
                    type="time"
                    className="absolute inset-0 opacity-0 w-full h-full"
                    onChange={(e) => {
                      setNextFollowUpTime(formatTime(e.target.value));
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => handleTimeClick(nextTimeInputRef)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-500"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex items-start">
                <Label
                  htmlFor="nextFollowUpRemark"
                  className="w-36 text-right pr-4 pt-2"
                >
                  Remark
                </Label>
                <Textarea
                  id="nextFollowUpRemark"
                  value={nextFollowUpRemark}
                  onChange={(e) => setNextFollowUpRemark(e.target.value)}
                  className="flex-1 min-h-[50px]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center my-28">
          <Button
            type="submit"
            className={`px-8 py-2 rounded-md ${
              isFormValid
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!isFormValid}
          >
            Submit FollowUp
          </Button>
        </div>
      </form>

      {/* Follow Up History Section */}
      <div className="mt-12">
        <div className="flex items-center gap-2 mb-4 border-b pb-2">
          <FileEdit className="h-5 w-5 text-orange-500" />
          <h2 className="text-lg font-medium">Follow Up History</h2>
        </div>

        {followUps.length === 0 ? (
          <p className="text-gray-500 text-center">No follow-up history yet.</p>
        ) : (
          <div className="space-y-6">
            {followUps.map((entry, index) => {
              return (
                <div
                  key={index}
                  className="border rounded-md p-4 shadow-sm bg-white"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                    <div className="flex items-center border-r gap-2">
                      <span>By</span>
                      <span className="font-semibold">
                        {entry.adminFullName}
                      </span>
                      <span>On</span>
                      <span className="font-bold text-gray-500">
                        {entry.date}
                      </span>
                    </div>
                    <div className="flex items-center border-r gap-2">
                      <span className="font-semibold">Time Taken:</span>
                      <span>{`${entry.startTime} - ${entry.endTime}`}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2 border-t pt-2 mt-2">
                    <div className="border-r">
                      <span className="font-semibold">Call Type:</span>{" "}
                      {entry.callType}
                    </div>
                    <div className="border-r">
                      <span className="font-semibold">Enquiry Strength:</span>{" "}
                      {entry.strength}
                    </div>
                    <div className="border-r">
                      <span className="font-semibold">Stage:</span>{" "}
                      {entry.status}
                    </div>
                  </div>

                  <div className="flex flex-row gap-x-2 border-t pt-2 mt-2">
                    <p className="font-semibold">Remark:</p>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {entry.remark || "-"}
                    </p>
                  </div>

                  {(entry.nextFollowUpDate || entry.nextFollowUpRemark) && (
                    <div className="flex flex-col border-t pt-2 mt-2 bg-yellow-100 p-2 rounded text-sm">
                      <div className="flex flex-row font-semibold text-sm">
                        <div>Next Follow Up On:</div>
                        <div> {entry.nextFollowUpDate || "-"}</div>
                      </div>
                      <div className="flex flex-row">
                        <div>Remark: </div>
                        <div> {entry.nextFollowUpRemark || "-"}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
