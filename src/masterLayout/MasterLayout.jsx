import React, { useEffect, useState, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Toast from "@/components/ui/Toast";
import { TbMoneybag } from "react-icons/tb";
import { House, FileChartColumn, UserCog, UserRoundCog } from "lucide-react";
import { Banknote } from "lucide-react";
import ThemeToggleButton from "../helper/ThemeToggleButton";
import { useDispatch, useSelector } from "react-redux";

// lucide icon import
import { UserPlus } from "lucide-react";
import { IndianRupee } from "lucide-react";
import { setAcademicYear, setTenant } from "@/features/branchSlice";
import { FileDown } from "lucide-react";
import { CreditCard } from "lucide-react";
import { HandCoins } from "lucide-react";
import { GraduationCap } from "lucide-react";
import { SquareChartGantt } from "lucide-react";
import { CircleHelp } from "lucide-react";
import { UserRound } from "lucide-react";
import { UsersRound } from "lucide-react";
import axios from "axios";
import BackButton from "@/helper/BackButton";
// import { ChevronsRight } from "lucide-react";

const MasterLayout = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");
  const fullName = localStorage.getItem("fullName");
  const role = localStorage.getItem("role");
  const dispatch = useDispatch();

  // Fetch values from Redux store
  const tenantValue = useSelector((state) => state.branch.tenant);
  const academicYearValue = useSelector((state) => state.branch.academicYear);

  // Local state for dropdown
  const [isOpen, setIsOpen] = useState(false);
  const [localTenant, setLocalTenant] = useState(tenantValue || "SCHOOL-ENG");
  const [localAcademicYear, setLocalAcademicYear] = useState(
     "2025-2026"
  );
  const [medium, setMedium] = useState([]);
  const [year, setYear] = useState([]);

  // Ref for dropdown menu
  const dropdownRef = useRef(null);

  // Sync Redux state with local storage and set initial values
  useEffect(() => {
    const savedTenant = localStorage.getItem("tenant") || "SCHOOL-ENG";
    const savedAcademicYear =
      localStorage.getItem("academicYear") || "2025-2026";

    setLocalTenant(savedTenant);
    setLocalAcademicYear(savedAcademicYear);

    dispatch(setTenant(savedTenant));
    dispatch(setAcademicYear(savedAcademicYear));
  }, [dispatch]);

  // Fetch medium and year lists
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_API_URL}common/medium-year`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.data) {
          setMedium(response.data.data.mediumList);
          setYear(response.data.data.yearList);
        }
      } catch (error) {
        console.error("Error fetching dropdown data:", error.message);
      }
    };

    fetchDropdownData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle dropdown visibility
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSwitch = () => {
    localStorage.setItem("tenant", localTenant);
    localStorage.setItem("academicYear", localAcademicYear);

    dispatch(setTenant(localTenant));
    dispatch(setAcademicYear(localAcademicYear));

    setIsOpen(false); // Close dropdown after switching
  };

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogOut = async (e) => {
    setIsLoading(true);
    try {
      // await axios.post("auth/admin-sign-out");

      // Remove access token from localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("fullName");
      localStorage.removeItem("role");
      localStorage.clear();
      Toast.showSuccessToast("Logged out Successfully");

      navigate("/sign-in");
      setIsLoading(false);
    } catch (error) {
      Toast.showErrorToast("Logout failed: ", error);

      setIsLoading(false);
    }
  };
  let [sidebarActive, setSidebarActive] = useState(false);
  let [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation(); // Hook to get the current route

  useEffect(() => {
    // Function to handle dropdown clicks
    const handleDropdownClick = (event) => {
      event.preventDefault();
      const clickedLink = event.currentTarget;
      const clickedDropdown = clickedLink.closest(".dropdown");

      if (!clickedDropdown) return;

      const isActive = clickedDropdown.classList.contains("open");

      // Close all dropdowns
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("open");
      });

      // Toggle the clicked dropdown
      if (!isActive) {
        clickedDropdown.classList.add("open");
      }
    };

    // Attach click event listeners to all dropdown triggers
    const dropdownTriggers = document.querySelectorAll(
      ".sidebar-menu .dropdown > a, .sidebar-menu .dropdown > Link"
    );

    dropdownTriggers.forEach((trigger) => {
      trigger.addEventListener("click", handleDropdownClick);
    });

    // Function to open submenu based on current route
    const openActiveDropdown = () => {
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        const submenuLinks = dropdown.querySelectorAll(".sidebar-submenu li a");
        submenuLinks.forEach((link) => {
          if (
            link.getAttribute("href") === location.pathname ||
            link.getAttribute("to") === location.pathname
          ) {
            dropdown.classList.add("open");
          }
        });
      });
    };

    // Open the submenu that contains the open route
    openActiveDropdown();

    // Cleanup event listeners on unmount
    return () => {
      dropdownTriggers.forEach((trigger) => {
        trigger.removeEventListener("click", handleDropdownClick);
      });
    };
  }, [location.pathname]);

  let sidebarControl = () => {
    setSidebarActive(!sidebarActive);
  };

  let mobileMenuControl = () => {
    setMobileMenu(!mobileMenu);
  };

  return (
    <section className={mobileMenu ? "overlay active" : "overlay"}>
      {/* sidebar */}
      <aside
        className={
          sidebarActive
            ? "sidebar active "
            : mobileMenu
            ? "sidebar sidebar-open"
            : "sidebar"
        }
      >
        <button
          onClick={mobileMenuControl}
          type="button"
          className="sidebar-close-btn"
        >
          <Icon icon="radix-icons:cross-2" />
        </button>
        <div className="bg-slate-800 border-0 border-transparent">
          <Link to="/dashboard" className="sidebar-logo">
            <img
              // src="/assets/images/logo.png"
              src="/assets/images/auth/smart-school-main2.png"
              alt="site logo"
              className="light-logo"
            />
            <img
              // src="/assets/images/logo-light.png"
              src="/assets/images/auth/smart-school-main.jpg"
              alt="site logo"
              className="dark-logo"
            />
            <img
              src="/assets/images/logo-icon.png"
              alt="site logo"
              className="logo-icon"
            />
          </Link>
        </div>
        <div className="sidebar-menu-area bg-neutral-800">
          <ul className="sidebar-menu" id="sidebar-menu">
            {/* <li>
              <NavLink
                to="/dashboard"
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <House size={20} className="mr-10" />
              
                <span>Dashboard</span>
              </NavLink>
            </li> */}
            <li className="">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-md transition-colors 
      ${isActive ? "text-white bg-blue-500" : "text-gray-800"} 
      hover:text-white `
                }
              >
                <House size={20} className="mr-10" />
                <span>Dashboard</span>
              </NavLink>
            </li>

            {/* Student Manager Dropdown */}
            <li className="dropdown">
              <Link to="#">
                <UserPlus size={20} className="mr-10" />
                {/* <i className="ri-robot-2-line mr-10" /> */}

                <span>Student Manager </span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/student/create"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-primary-600 w-auto" />{" "}
                    Student Admission
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/student/list"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-red-400 w-auto" />{" "}
                    Students Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/student/search"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-green-400 w-auto" />{" "}
                    Students Detail
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/affidavits"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-green-400 w-auto" />
                    Affidavit Certificate
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/bonafide-certificates"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-red-400 w-auto" />
                    Bonafied Certificate
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/leaving-certificate/download"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-yellow-400 w-auto" />
                    Leaving Certificate
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/student-bulk-add"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-blue-400 w-auto" />
                    Student Bulk Add
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/student-bulk-update"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-red-400 w-auto" />
                    Student Bulk Update
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* Income Dropdown */}
            {role === "SUPER_ADMIN" ? (
              <li className="dropdown">
                <Link to="#">
                  {/* <IndianRupee size={20} className="mr-10" /> */}
                  <TbMoneybag size={20} className="mr-10" />

                  <span>Income</span>
                </Link>
                <ul className="sidebar-submenu">
                  <li>
                    <NavLink
                      to="/add/income"
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      <i className="ri-circle-fill circle-icon text-primary-600 w-auto" />{" "}
                      Add Income
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/search/income"
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      <i className="ri-circle-fill circle-icon text-warning  w-auto" />
                      Search Income
                    </NavLink>
                  </li>
                  {/* <li>
                  <NavLink
                    to="/marketplace-details"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-success w-auto" />
                    Income list
                  </NavLink>
                </li> */}
                  <li>
                    <NavLink
                      to="/add/incomehead"
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      <i className="ri-circle-fill circle-icon text-danger w-auto" />
                      Income Head
                    </NavLink>
                  </li>
                </ul>
              </li>
            ) : (
              <div></div>
            )}
            {/* Expense Dropdown */}
            {role === "SUPER_ADMIN" ? (
              <li className="dropdown">
                <Link to="#">
                  <IndianRupee size={20} className="mr-10" />
                  <span>Expense</span>
                </Link>
                <ul className="sidebar-submenu">
                  <li>
                    <NavLink
                      to="/add/expense"
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      <i className="ri-circle-fill circle-icon text-primary-600 w-auto" />{" "}
                      Add Expense
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/search/expense"
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      <i className="ri-circle-fill circle-icon text-warning  w-auto" />
                      Search Expense
                    </NavLink>
                  </li>
                  {/* <li>
                   <NavLink
                     to="/marketplace-details"
                     className={(navData) =>
                       navData.isActive ? "active-page" : ""
                     }
                   >
                     <i className="ri-circle-fill circle-icon text-success w-auto" />
                     Income list
                   </NavLink>
                 </li> */}
                  <li>
                    <NavLink
                      to="/add/expensehead"
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      <i className="ri-circle-fill circle-icon text-danger w-auto" />
                      Expense Head
                    </NavLink>
                  </li>
                </ul>
              </li>
            ) : (
              <div></div>
            )}

            {/* Fees Dropdown */}
            <li className="dropdown">
              <Link to="#">
                <Banknote size={20} className="mr-10" />
                <span>Fees Module</span>
              </Link>
              <ul className="sidebar-submenu">
                {/* <li>
                  <NavLink
                    to="/fee/structure"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-red-400 w-auto" />
                    Fee Config
                  </NavLink>
                </li> */}
                <li>
                  <NavLink
                    to="/fee/structure" // Default path
                    className={(navData) =>
                      navData.isActive ||
                      location.pathname.startsWith("/edit/fee/structure") // Check if the URL starts with "/edit/fee/structure"
                        ? "active-page"
                        : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-red-400 w-auto" />
                    Fee Config
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/student/fees/record"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-green-400  w-auto" />
                    Accept Fee
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/search/fees/payment"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-yellow-400  w-auto" />
                    Fee Reciepts
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* Fees Report Dropdown */}
            <li className="dropdown">
              <Link to="#">
                <FileChartColumn size={20} className="mr-10" />
                <span>Fees Report</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/search/fees/transaction"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-red-400  w-auto" />
                    All Fee Transaction
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/search/monthly-fees/transaction"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-green-400  w-auto" />
                    Monthly Fee Transaction
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* // Accounts center */}
            <li className="dropdown">
              <Link to="#">
                {/* <FileDown size={20} className="mr-10" /> */}
                <CreditCard size={20} className="mr-10" />
                <span>Accounts</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/accounts"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-red-400 w-auto" />
                    Master
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* Enquiry and Front Desk */}

            <li className="dropdown">
              <Link to="#">
                <UserRoundCog size={22} className="mr-10" />
                <span>Enquiry & Front Desk</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/enquiry"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-blue-400 w-auto" />
                    New Enquiry
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/enquiry-dashboard"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-red-400 w-auto" />
                    Enquiry List
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* // Payroll center */}
            <li className="dropdown">
              <Link to="#">
                <HandCoins size={20} className="mr-10" />
                <span>Payroll</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/payroll"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-red-400 w-auto" />
                    Salary Configuration
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* // Academics center */}
            <li className="dropdown">
              <Link to="#">
                <GraduationCap size={20} className="mr-10" />
                <span>Academics</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/timetable"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-red-400 w-auto" />
                    Timetable
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/notes"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-yellow-400 w-auto" />
                    Notes & Videos
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/homework"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-green-400 w-auto" />
                    Homework
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/mark-attendance"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-blue-400 w-auto" />
                    Mark Attendance
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/report"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-orange-900 w-auto" />
                    Report
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* // Examination center */}
            <li className="dropdown">
              <Link to="#">
                {/* <GraduationCap size={20} className="mr-10" /> */}
                <SquareChartGantt size={20} className="mr-10" />
                <span>Examination</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/master"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-red-400 w-auto" />
                    Master
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/exam-masters"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-blue-400 w-auto" />
                    Exam Master
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/exam-marks-entry"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-yellow-400 w-auto" />
                    Exam Mark Entry
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/exam-result"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-green-400 w-auto" />
                    Exam Result
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* // Employee center */}
            <li className="dropdown">
              <Link to="#">
                <UserRound size={20} className="mr-10" />
                <span>Employee</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/employee-master"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-red-400 w-auto" />
                    Employee Master
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/mark-attendancey"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-blue-400 w-auto" />
                    Mark Attendance
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* // Online Exam */}
            <li className="dropdown">
              <Link to="#">
                <CircleHelp size={20} className="mr-10" />
                <span>Online Exam</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/exam-summary"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-red-400 w-auto" />
                    Exam Summary
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/exam-masterr"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-blue-400 w-auto" />
                    Exam Master
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/question-bank"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-green-400 w-auto" />
                    Question Bank
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/online-exam-result"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-yellow-400 w-auto" />
                    Online Exam Result
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/subject-teacher"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-pink-400 w-auto" />
                    Subject teacher
                  </NavLink>
                </li>
              </ul>
            </li>
      
          </ul>
        </div>
      </aside>

   <main
  className={sidebarActive ? "dashboard-main active" : "dashboard-main"}
>
  <div className="navbar-header">
    <div className="row align-items-center justify-content-between">
      <div className="col-auto">
        <div className="d-flex flex-wrap align-items-center gap-4">
          <button
            type="button"
            className="sidebar-toggle"
            onClick={sidebarControl}
          >
            {sidebarActive ? (
              <Icon
                icon="iconoir:arrow-right"
                className="icon text-2xl non-active"
              />
            ) : (
              <Icon
                icon="heroicons:bars-3-solid"
                className="icon text-2xl non-active "
              />
            )}
          </button>
          <button
            onClick={mobileMenuControl}
            type="button"
            className="sidebar-mobile-toggle"
          >
            <Icon icon="heroicons:bars-3-solid" className="icon" />
          </button>
          
          <div className="font-bold text-lg sm:text-xl md:text-3xl text-slate-700">
            School Name
          </div>
          
          {/* Back Button - properly aligned */}
          <div className="d-flex align-items-center">
         {!location.pathname.startsWith("/dashboard") && (
  <BackButton variant="outline" className="!py-1.5 !px-3" />
)}
          </div>
        </div>
      </div>


            <div className="col-auto">
              <div className="d-flex flex-wrap align-items-center gap-3">
             
                <div className="flex flex-row justify-between items-center align-middle gap-3 mt-10">
                  {/* medium and year switch btn*/}
                  <div
                    className="relative w-64 mx-auto text-sm border-blue-500 border-1 rounded-md"
                    ref={dropdownRef}
                  >
                    {/* Dropdown Button */}
                    <button
                      className="text-blue-500 px-4 py-2.5 rounded-md w-full flex justify-between items-center hover:bg-blue-500 hover:text-slate-100 hover:border-transparent"
                      type="button"
                      onClick={toggleDropdown}
                      aria-expanded={isOpen}
                      aria-controls="dropdown-menu"
                    >
                      {`${localTenant} : ${localAcademicYear}`}
                      <span>{isOpen ? "▲" : "▼"}</span>
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                      <div
                        id="dropdown-menu"
                        className="absolute top-full left-0 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg z-10"
                      >
                        {/* Tenant Dropdown */}
                        <div className="px-3 py-2">
                          <label
                            htmlFor="tenant"
                            className="block text-sm font-medium"
                          >
                            Tenant
                          </label>
                          <select
                            id="tenant"
                            value={localTenant}
                            onChange={(e) => setLocalTenant(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            {medium.map((item, index) => (
                              <option key={index} value={item.medium}>
                                {item.medium}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Academic Year Dropdown */}
                        <div className="px-3 py-2">
                          <label
                            htmlFor="academicYear"
                            className="block text-sm font-medium"
                          >
                            Academic Year
                          </label>
                          <select
                            id="academicYear"
                            value={localAcademicYear}
                            onChange={(e) =>
                              setLocalAcademicYear(e.target.value)
                            }
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            {year.map((item, index) => (
                              <option key={index} value={item.year}>
                                {item.year}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Switch Button */}
                        <div className="px-3 py-2">
                          <button
                            onClick={handleSwitch}
                            className="w-20 bg-blue-500 hover:bg-blue-700 text-center text-white px-2 py-2 rounded-md text-sm"
                          >
                            Switch
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* medium and year switch btn end here */}

                  {/* Profile  */}
                  <div className="dropdown">
                    <div
                      className="d-flex justify-content-center align-items-center rounded-circle"
                      data-bs-toggle="dropdown"
                    >
                      <img
                        src="/assets/images/user.png"
                        alt="image_user"
                        className="w-40-px h-40-px object-fit-cover rounded-circle border-2"
                      />
                    </div>
                    <div className="dropdown-menu to-top dropdown-menu-sm px-20 py-20">
                      <div className="py-12 px-20 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2">
                        <div>
                          <h6 className="text-lg text-primary-light fw-semibold mb-2">
                            {fullName}
                          </h6>
                          <span className="text-secondary-light fw-medium text-sm">
                            {role}
                          </span>
                        </div>
                        <button type="button" className="hover-text-danger">
                          <Icon
                            icon="radix-icons:cross-1"
                            className="icon text-xl"
                          />
                        </button>
                      </div>
                      <ul className="to-top-list">
                      
                        <li>
                          <button
                            className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-danger d-flex align-items-center gap-3"
                            onClick={handleLogOut}
                          >
                            <Icon
                              icon="lucide:power"
                              className="icon text-xl"
                            />{" "}
                            Log Out
                          </button>
                          {isLoading && (
                            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
                              <div className="loader"></div>
                            </div>
                          )}
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* Profile dropdown end */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* dashboard-main-body */}
        <div className="dashboard-main-body">{children}</div>

        {/* Footer section */}
        <footer className="d-footer">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <p className="mb-0">© 2024 DexEducation All Rights Reserved.</p>
            </div>
            <div className="col-auto">
              <p className="mb-0">
                Made by{" "}
                <span className="text-primary-600">
                  <a href="https://techluminix.com/">TechLuminix</a>
                </span>
              </p>
            </div>
          </div>
        </footer>
      </main>
    </section>
  );
};

export default MasterLayout;
