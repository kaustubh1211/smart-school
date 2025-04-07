import { useEffect, useState } from "react";
import {
  ChevronDown,
  Printer,
  Pencil,
  Trash2,
  ArrowLeft,
  PlusCircle,
  PenSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { useNavigate } from "react-router-dom";

// Available class options
const classOptions = [
  {
    group: "PRATHAMIK",
    items: [
      "STD I",
      "STD II",
      "STD III",
      "STD IV",
      "STD V",
      "STD VI",
      "STD VII",
    ],
  },
  { group: "MADHYAMIK", items: ["STD VIII", "STD IX", "STD X"] },
  { group: "JUNIOR COLLEGE", items: ["F.Y.J.C", "S.Y.J.C"] },
];

const ITEMS_PER_PAGE = 10;

export default function BonafideCertificateLayer() {
  const navigate = useNavigate();

  // State variables for filters
  const [fromDate, setFromDate] = useState(undefined);
  const [toDate, setToDate] = useState(undefined);
  const [selectedClass, setSelectedClass] = useState("-- Class --");
  const [searchQuery, setSearchQuery] = useState("");
  const [bonafideData, setBonafideData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load bonafide certificates from localStorage
  useEffect(() => {
    const loadBonafides = () => {
      const certificates = JSON.parse(
        localStorage.getItem("bonafideCertificates") || "[]"
      );
      setBonafideData(certificates);
      setFilteredData(certificates);
      setTotalPages(Math.ceil(certificates.length / ITEMS_PER_PAGE));
    };

    // Initial load
    loadBonafides();

    // Add event listener for storage changes
    const handleStorageChange = (e) => {
      if (e.key === "bonafideCertificates") {
        loadBonafides();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Function to format date to DD-MM-YYYY
  const formatDate = (date) => {
    if (!date) return "";
    return format(date, "dd-MM-yyyy");
  };

  // Function to parse DD-MM-YYYY string to Date object
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  // Apply filters when any filter changes
  useEffect(() => {
    let result = [...bonafideData];

    // Apply date range filter
    if (fromDate || toDate) {
      result = result.filter((item) => {
        const itemDate = parseDate(item.date);
        if (!itemDate) return true;

        if (fromDate && toDate) {
          return itemDate >= fromDate && itemDate <= toDate;
        } else if (fromDate) {
          return itemDate >= fromDate;
        } else if (toDate) {
          return itemDate <= toDate;
        }

        return true;
      });
    }

    // Apply class filter
    if (selectedClass !== "-- Class --") {
      result = result.filter(
        (item) => item.class.toLowerCase() === selectedClass.toLowerCase()
      );
    }

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.student.toLowerCase().includes(query) ||
          item.bno.toLowerCase().includes(query)
      );
    }

    setFilteredData(result);
    setTotalPages(Math.ceil(result.length / ITEMS_PER_PAGE));
    setCurrentPage(1); // Reset to first page when filters change
  }, [fromDate, toDate, selectedClass, searchQuery, bonafideData]);

  // Calculate paginated data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleUpdate = (id) => {
    console.log(id);
    navigate(`/update-bonafide/${id}`);
  };

  // Handle delete certificate
  const handleDelete = (id) => {
    const updatedBonafides = bonafideData.filter((cert) => cert.id !== id);
    localStorage.setItem(
      "bonafideCertificates",
      JSON.stringify(updatedBonafides)
    );
    setBonafideData(updatedBonafides);
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-2">
          <PenSquare className="text-orange-500" />
          <h1 className="text-xl font-semibold">Bonafide List</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-1"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
            onClick={() => navigate("/new-bonafide")}
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add New</span>
          </Button>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
        {/* Date Range Picker */}
        <div className="flex items-center gap-2">
          <label className="w-16">Date</label>
          <div className="flex items-center w-full">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !fromDate && "text-muted-foreground"
                  )}
                >
                  {fromDate ? formatDate(fromDate) : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={setFromDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <div className="p-2 text-center bg-gray-200">TO</div>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !toDate && "text-muted-foreground"
                  )}
                >
                  {toDate ? formatDate(toDate) : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={setToDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Class Selector */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
        <div className="flex items-center gap-2">
          <label className="w-16">Class</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between font-normal border-input"
              >
                {selectedClass}
                <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[300px] max-h-[400px] overflow-auto">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setSelectedClass("-- Class --")}
              >
                -- Class --
              </DropdownMenuItem>

              {classOptions.map((group) => (
                <div key={group.group}>
                  <DropdownMenuItem className="bg-slate-200 cursor-default font-semibold">
                    {group.group}
                  </DropdownMenuItem>
                  {group.items.map((item) => (
                    <DropdownMenuItem
                      key={item}
                      className="pl-6 cursor-pointer"
                      onClick={() => setSelectedClass(item)}
                    >
                      {item}
                    </DropdownMenuItem>
                  ))}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search Filter */}
        <div className="flex items-center gap-2">
          <label className="w-16">Search</label>
          <div className="flex w-full">
            <Input
              placeholder="Name/Enroll.No./GrNo"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-r-none"
            />
            <Button
              className="bg-red-600 hover:bg-red-700 text-white rounded-l-none"
              onClick={() => {
                setSearchQuery("");
                setSelectedClass("-- Class --");
                setFromDate(undefined);
                setToDate(undefined);
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-100 text-xs justify-center">
              <th className="border p-2 text-center">#</th>
              <th className="border p-2 text-center">DATE</th>
              <th className="border p-2 text-center">B.NO.</th>
              <th className="border p-2 text-left">STUDENT</th>
              <th className="border p-2 text-left">CLASS</th>
              <th className="border p-2 text-left">PURPOSE</th>
              <th className="border p-2 text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-red-500">
                  No records found.
                </td>
              </tr>
            ) : (
              paginatedData.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50 text-sm">
                  <td className="border p-2 text-center">{record.id}</td>
                  <td className="border p-2 text-center">{record.date}</td>
                  <td className="border p-2 text-center">{record.bno}</td>
                  <td className="border p-2">{record.student}</td>
                  <td className="border p-2">{record.class}</td>
                  <td className="border p-2">{record.purpose}</td>
                  <td className="border ">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-800"
                        onClick={() =>
                          window.open(
                            `/bonafide-certificate/${record.id}`,
                            "_blank"
                          )
                        }
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-800"
                        onClick={() => handleUpdate(record.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(record.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
          {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of{" "}
          {filteredData.length} entries
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
