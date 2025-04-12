import { useEffect, useState } from "react";
import axios from "axios";
import {
  Edit,
  Phone,
  Printer,
  Trash2,
  ArrowLeft,
  FileEdit,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../components/ui/Toast";

export default function EnquiryDeskLayer() {
  const accessToken = localStorage.getItem("accessToken");
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    course: "",
    status: "",
    page: 1,
    limit: 10, // Default page size
  });

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    totalPages: 1,
    currentPage: 1,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchEnquiries();
  }, [filters]); // Re-fetch when filters change

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const params = {
        ...(filters.startDate && { from_date: filters.startDate }),
        ...(filters.endDate && { to_date: filters.endDate }),
        ...(filters.course &&
          filters.course !== "all" && { section: filters.course }),
        ...(filters.status &&
          filters.status !== "all" && { status: filters.status }),
        page: filters.page,
        limit: filters.limit,
      };

      const response = await axios.get(
        `${import.meta.env.VITE_LOCAL_API_URL}enquiry/student-enquiry/list`,
        {
          params,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        const mappedEnquiries = response.data.data.details.map((enquiry) => ({
          id: enquiry.id,
          course: enquiry.section,
          candidate: `${enquiry.firstName} ${enquiry.lastName}`,
          gender: enquiry.gender,
          dob: formatDate(enquiry.dob),
          mobile: enquiry.mobile,
          createdBy: enquiry.admin.fullName,
          createdAt: formatDateTime(enquiry.createdAt),
          status: enquiry.status,
        }));

        setEnquiries(mappedEnquiries);
        setPagination({
          totalRecords: response.data.data.totalRecords,
          totalPages: response.data.data.totalPages,
          currentPage: response.data.data.currentPage,
        });
      }
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    } finally {
      setLoading(false);
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // DD/MM/YYYY format
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 })); // Reset to page 1 when filters change
  };

  const clearFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      course: "",
      status: "",
      page: 1,
      limit: 10,
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handlePrint = (enquiry) => {
    navigate(`/enquiry/form/${enquiry.id}`);
  };

  const handleDelete = async (enquiry) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_LOCAL_API_URL}enquiry/delete`,
        {
          enquiryId: enquiry.id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.success) {
        Toast.showSuccessToast("Enquiry deleted successfully");

        fetchEnquiries();
      }
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
    <div className="container mx-auto px-4">
      {/* Header */}
      <div className="flex justify-between items-center py-4 border-b">
        <div className="flex items-center gap-2">
          <FileEdit className="h-5 w-5 text-orange-500" />
          <h1 className="text-xl font-medium">Enquiry Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
            <FileEdit className="h-4 w-4" />
            New Enquiry
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-24">
        <div className="flex">
          <div className="flex items-center mr-auto">
            <span className="w-20 px-16">Date</span>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="h-10 w-[197px]"
            />
            <span className="w-20 text-center bg-gray-100 p-2 font-medium">
              TO
            </span>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="h-10 w-[197px]"
            />
          </div>
        </div>
        <div></div>
        <div className="flex items-center gap-2">
          <span className="w-20">Course</span>
          <Select
            value={filters.course}
            onValueChange={(value) => handleFilterChange("course", value)}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="-- --" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">-- --</SelectItem>
              <SelectItem value="COMMERCE">COMMERCE</SelectItem>
              <SelectItem value="COMMERCE-IT">COMMERCE-IT</SelectItem>
              <SelectItem value="HIGHSCHOOL">HIGHSCHOOL</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
              <SelectItem value="LEFT">LEFT</SelectItem>
              <SelectItem value="MADHYAMIK">MADHYAMIK</SelectItem>
              <SelectItem value="PRATHAMIK">PRATHAMIK</SelectItem>
              <SelectItem value="PRE-PRIMARY">PRE-PRIMARY</SelectItem>
              <SelectItem value="PRIMARY">PRIMARY</SelectItem>
              <SelectItem value="SCIENCE">SCIENCE</SelectItem>
              <SelectItem value="SCIENCE-CS">SCIENCE-CS</SelectItem>
              <SelectItem value="SCIENCE-IT">SCIENCE-IT</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="w-20 text-center">Status</span>
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger className="h-10 w-72">
                <SelectValue placeholder="-- ALL --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">-- ALL --</SelectItem>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="ONGOING">Ongoing</SelectItem>
                <SelectItem value="CONFIRMED">Confirm</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            className="ml-auto hover:bg-gray-100 text-black px-16 rounded"
            onClick={clearFilters}
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-xs">
              <th className="border px-2 py-2 text-center">SRNO</th>
              <th className="border px-2 py-2 text-left">COURSE</th>
              <th className="border px-2 py-2 text-left">CANDIDATE</th>
              <th className="border px-2 py-2 text-center">GENDER</th>
              <th className="border px-2 py-2 text-center">DOB</th>
              <th className="border px-2 py-2 text-center">MOBILE</th>
              <th className="border px-2 py-2 text-center">CREATED BY</th>
              <th className="border px-2 py-2 text-center">STATUS</th>
              <th className="border px-2 py-2 text-center"></th>
              <th className="border px-2 py-2 text-center" colSpan={4}>
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={12} className="border px-4 py-8 text-center">
                  Loading...
                </td>
              </tr>
            ) : enquiries.length > 0 ? (
              enquiries.map((enquiry, index) => (
                <tr key={enquiry.id} className="hover:bg-gray-50 text-sm">
                  <td className="border text-center px-2 py-1">
                    {(filters.page - 1) * filters.limit + index + 1}
                  </td>
                  <td className="border px-2 py-1">{enquiry.course}</td>
                  <td className="border px-2 py-1">{enquiry.candidate}</td>
                  <td className="border text-center px-2 py-1">
                    {enquiry.gender}
                  </td>
                  <td className="border px-2 py-1">{enquiry.dob}</td>
                  <td className="border px-2 py-1">{enquiry.mobile}</td>
                  <td className="border text-center px-2 py-1">
                    {enquiry.createdBy}
                    <div className="text-xs text-gray-500">
                      {enquiry.createdAt}
                    </div>
                  </td>
                  <td className="border px-2 py-2 text-center">
                    {enquiry.status === "NEW" && (
                      <Badge className="bg-blue-500 hover:bg-blue-600 mr-2">
                        NEW
                      </Badge>
                    )}
                    {enquiry.status === "ONGOING" && (
                      <Badge className="bg-yellow-500 hover:bg-yellow-600 mr-2">
                        ONGOING
                      </Badge>
                    )}
                    {enquiry.status === "CLOSED" && (
                      <Badge className="bg-black-500 hover:bg-black-600 mr-2">
                        CLOSED
                      </Badge>
                    )}
                    {enquiry.status === "WITHDRAWN" && (
                      <Badge className="bg-purple-500 hover:bg-purple-600 mr-2">
                        WITHDRAWN
                      </Badge>
                    )}
                    {enquiry.status === "REJECTED" && (
                      <Badge className="bg-red-500 hover:bg-red-600 mr-2">
                        REJECTED
                      </Badge>
                    )}
                  </td>
                  <td className="border px-2 py-1 text-center text-blue-500 underline">
                    <Link to="/student/create">Admission</Link>
                  </td>
                  <td className="border px-1 py-1 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-yellow-500 hover:text-yellow-600"
                      onClick={() => {
                        // window.location.href = "/enquiry/followUp";
                        navigate(`/enquiry/followUp/${enquiry.id}`);
                      }}
                    >
                      <Phone className="h-5 w-5" />
                    </Button>
                  </td>
                  <td className="border px-1 py-1 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-500 hover:text-blue-600"
                      onClick={() => handlePrint(enquiry)}
                    >
                      <Printer className="h-5 w-5" />
                    </Button>
                  </td>
                  {/* <td className="border px-1 py-1 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-green-500 hover:text-green-600"
                    >
                      <Edit className="h-5 w-5" />
                    </Button>
                  </td> */}
                  <td className="border px-1 py-1 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                      onClick={() => handleDelete(enquiry)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={12}
                  className="border px-4 py-8 text-center text-gray-500"
                >
                  No enquiries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && enquiries.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            Showing {(filters.page - 1) * filters.limit + 1} to{" "}
            {Math.min(filters.page * filters.limit, pagination.totalRecords)} of{" "}
            {pagination.totalRecords} entries
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={filters.page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2">
              Page {filters.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={filters.page >= pagination.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
