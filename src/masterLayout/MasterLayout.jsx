import React, { useEffect, useState, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Toast from "@/components/ui/Toast";
import { TbMoneybag } from "react-icons/tb";
import {
  House,
  FileChartColumn,
  UserCog,
  UserRoundCog,
  Banknote,
  UserPlus,
  IndianRupee,
  CreditCard,
  HandCoins,
  GraduationCap,
  SquareChartGantt,
  CircleHelp,
  UserRound,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAcademicYear, setTenant } from "@/features/branchSlice";
import axios from "axios";
import BackButton from "@/helper/BackButton";

// ============================================
// MENU CONFIGURATION
// ============================================
const MENU_CONFIG = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: House,
    path: "/dashboard",
    type: "link",
  },
  {
    id: "student-manager",
    label: "Student Manager",
    icon: UserPlus,
    type: "dropdown",
    submenu: [
      {
        label: "Student Admission",
        path: "/student/create",
        color: "primary-600",
      },
      {
        label: "Students Dashboard",
        path: "/student/list",
        color: "red-400",
      },
      {
        label: "Students Detail",
        path: "/student/search",
        color: "green-400",
      },
      {
        label: "Affidavit Certificate",
        path: "/affidavits",
        color: "green-400",
      },
      {
        label: "Bonafied Certificate",
        path: "/bonafide-certificates",
        color: "red-400",
      },
      {
        label: "Leaving Certificate",
        path: "/leaving-certificate/download",
        color: "yellow-400",
      },
      {
        label: "Student Bulk Add",
        path: "/student-bulk-add",
        color: "blue-400",
      },
      {
        label: "Student Bulk Update",
        path: "/student-bulk-update",
        color: "red-400",
      },
    ],
  },
  {
    id: "income",
    label: "Income",
    icon: TbMoneybag,
    type: "dropdown",
    roles: ["SUPER_ADMIN"],
    submenu: [
      {
        label: "Add Income",
        path: "/add/income",
        color: "primary-600",
      },
      {
        label: "Search Income",
        path: "/search/income",
        color: "warning",
      },
      {
        label: "Income Head",
        path: "/add/incomehead",
        color: "danger",
      },
    ],
  },
  {
    id: "expense",
    label: "Expense",
    icon: IndianRupee,
    type: "dropdown",
    roles: ["SUPER_ADMIN"],
    submenu: [
      {
        label: "Add Expense",
        path: "/add/expense",
        color: "primary-600",
      },
      {
        label: "Search Expense",
        path: "/search/expense",
        color: "warning",
      },
      {
        label: "Expense Head",
        path: "/add/expensehead",
        color: "danger",
      },
    ],
  },
  {
    id: "fees-module",
    label: "Fees Module",
    icon: Banknote,
    type: "dropdown",
    submenu: [
          {
        label: "Fees Dashboard",
        path: "/student/fees/dashboard",
        color: "orange-400",
      },
      {
        label: "Fee Config",
        path: "/fee/structure",
        color: "red-400",
        matchPaths: ["/fee/structure", "/edit/fee/structure"],
      },
      {
        label: "Accept Fee",
        path: "/student/fees/record",
        color: "green-400",
      },
      {
        label: "Fee Receipts",
        path: "/search/fees/payment",
        color: "yellow-400",
      },
        {
        label: "Student Discount",
        path: "/view/student-discount",
        color: "blue-400",
      },
    ],
  },
  {
    id: "fees-report",
    label: "Fees Report",
    icon: FileChartColumn,
    type: "dropdown",
    submenu: [
      {
        label: "All Fee Transaction",
        path: "/search/fees/transaction",
        color: "red-400",
      },
      {
        label: "Monthly Fee Transaction",
        path: "/search/monthly-fees/transaction",
        color: "green-400",
      },
      {
        label: "Outstanding Report",
        path: "/search/outstanding/report",
        color: "blue-400",
      },
      {
    label: "Date Wise Report",
    path: "/search/datewise/report",
    color: "blue-400",
  },
      {
    label: "Certificate ",
    path: "/search/fee-certificate",
    color: "blue-400",
  },
    ],
  },
  {
    id: "accounts",
    label: "Accounts", 
    icon: CreditCard,
    type: "dropdown",
    submenu: [
      {
        label: "Master",
        path: "/accounts",
        color: "red-400",
      },
    ],
  },
  {
    id: "enquiry-front-desk",
    label: "Enquiry & Front Desk",
    icon: UserRoundCog,
    type: "dropdown",
    submenu: [
      {
        label: "New Enquiry",
        path: "/enquiry",
        color: "blue-400",
      },
      {
        label: "Enquiry List",
        path: "/enquiry-dashboard",
        color: "red-400",
      },
    ],
  },
  {
    id: "payroll",
    label: "Payroll",
    icon: HandCoins,
    type: "dropdown",
    submenu: [
      {
        label: "Salary Configuration",
        path: "/payroll",
        color: "red-400",
      },
    ],
  },
  {
    id: "academics",
    label: "Academics",
    icon: GraduationCap,
    type: "dropdown",
    submenu: [
      {
        label: "Timetable",
        path: "/timetable",
        color: "red-400",
      },
      {
        label: "Notes & Videos",
        path: "/notes",
        color: "yellow-400",
      },
      {
        label: "Homework",
        path: "/homework",
        color: "green-400",
      },
      {
        label: "Mark Attendance",
        path: "/mark-attendance",
        color: "blue-400",
      },
      {
        label: "Report",
        path: "/report",
        color: "orange-900",
      },
    ],
  },
  {
    id: "examination",
    label: "Examination",
    icon: SquareChartGantt,
    type: "dropdown",
    submenu: [
      {
        label: "Master",
        path: "/master",
        color: "red-400",
      },
      {
        label: "Exam Master",
        path: "/exam-masters",
        color: "blue-400",
      },
      {
        label: "Exam Mark Entry",
        path: "/exam-marks-entry",
        color: "yellow-400",
      },
      {
        label: "Exam Result",
        path: "/exam-result",
        color: "green-400",
      },
    ],
  },
  {
    id: "employee",
    label: "Employee",
    icon: UserRound,
    type: "dropdown",
    submenu: [
      {
        label: "Employee Master",
        path: "/employee-master",
        color: "red-400",
      },
      {
        label: "Mark Attendance",
        path: "/mark-attendancey",
        color: "blue-400",
      },
    ],
  },
  {
    id: "online-exam",
    label: "Online Exam",
    icon: CircleHelp,
    type: "dropdown",
    submenu: [
      {
        label: "Exam Summary",
        path: "/exam-summary",
        color: "red-400",
      },
      {
        label: "Exam Master",
        path: "/exam-masterr",
        color: "blue-400",
      },
      {
        label: "Question Bank",
        path: "/question-bank",
        color: "green-400",
      },
      {
        label: "Online Exam Result",
        path: "/online-exam-result",
        color: "yellow-400",
      },
      {
        label: "Subject teacher",
        path: "/subject-teacher",
        color: "pink-400",
      },
    ],
  },
];

// ============================================
// COMPONENTS
// MenuItem Component
const MenuItem = ({ item, isActive, onNavClick }) => {
  const IconComponent = item.icon;

  if (item.type === "link") {
    return (
      <li>
        <NavLink
          to={item.path}
          className={({ isActive }) =>
            `flex items-center p-2 rounded-md transition-colors ${
              isActive ? "text-white bg-blue-500" : "text-gray-800"
            } hover:text-white`
          }
        >
          <IconComponent size={20} className="mr-10" />
          <span>{item.label}</span>
        </NavLink>
      </li>
    );
  }

  return null;
};

// DropdownMenuItem Component
const DropdownMenuItem = ({ item }) => {
  const location = useLocation();

  const isSubmenuActive = (submenuItem) => {
    if (submenuItem.matchPaths) {
      return submenuItem.matchPaths.some((path) =>
        location.pathname.startsWith(path)
      );
    }
    return location.pathname === submenuItem.path;
  };

  const IconComponent = item.icon;

  return (
    <li className="dropdown">
      <Link to="#">
        <IconComponent size={20} className="mr-10" />
        <span>{item.label}</span>
      </Link>
      <ul className="sidebar-submenu">
        {item.submenu.map((subItem, index) => (
          <li key={index}>
            <NavLink
              to={subItem.path}
              className={isSubmenuActive(subItem) ? "active-page" : ""}
            >
              <i
                className={`ri-circle-fill circle-icon text-${subItem.color} w-auto`}
              />
              {subItem.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </li>
  );
};

// Sidebar Component
const Sidebar = ({ mobileMenu, onMobileMenuClose, userRole }) => {
  const filteredMenuItems = MENU_CONFIG.filter((item) => {
    if (item.roles && !item.roles.includes(userRole)) {
      return false;
    }
    return true;
  });

  return (
    <aside
      className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}
    >
      <button
        onClick={onMobileMenuClose}
        type="button"
        className="sidebar-close-btn"
      >
        <Icon icon="radix-icons:cross-2" />
      </button>

      <div className="bg-slate-800 border-0 border-transparent">
        <Link to="/dashboard" className="sidebar-logo">
          <img
            src="/assets/images/auth/smart-school-main2.png"
            alt="site logo"
            className="light-logo"
          />
          <img
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
          {filteredMenuItems.map((item) =>
            item.type === "dropdown" ? (
              <DropdownMenuItem key={item.id} item={item} />
            ) : (
              <MenuItem key={item.id} item={item} />
            )
          )}
        </ul>
      </div>
    </aside>
  );
};

// TenantYearSwitch Component
const TenantYearSwitch = ({
  localTenant,
  localAcademicYear,
  medium,
  year,
  onTenantChange,
  onYearChange,
  onSwitch,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwitch = () => {
    onSwitch();
    setIsOpen(false);
  };

  return (
    <div
      className="relative w-64 mx-auto text-sm border-blue-500 border-1 rounded-md"
      ref={dropdownRef}
    >
      <button
        className="text-blue-500 px-4 py-2.5 rounded-md w-full flex justify-between items-center hover:bg-blue-500 hover:text-slate-100 hover:border-transparent"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {`${localTenant} : ${localAcademicYear}`}
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg z-10">
          <div className="px-3 py-2">
            <label htmlFor="tenant" className="block text-sm font-medium">
              Tenant
            </label>
            <select
              id="tenant"
              value={localTenant}
              onChange={(e) => onTenantChange(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {medium.map((item, index) => (
                <option key={index} value={item.medium}>
                  {item.medium}
                </option>
              ))}
            </select>
          </div>

          <div className="px-3 py-2">
            <label htmlFor="academicYear" className="block text-sm font-medium">
              Academic Year
            </label>
            <select
              id="academicYear"
              value={localAcademicYear}
              onChange={(e) => onYearChange(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {year.map((item, index) => (
                <option key={index} value={item.year}>
                  {item.year}
                </option>
              ))}
            </select>
          </div>

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
  );
};

// ProfileDropdown Component
const ProfileDropdown = ({ fullName, role, onLogout, isLoading }) => {
  return (
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
            <Icon icon="radix-icons:cross-1" className="icon text-xl" />
          </button>
        </div>
        <ul className="to-top-list">
          <li>
            <button
              className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-danger d-flex align-items-center gap-3"
              onClick={onLogout}
            >
              <Icon icon="lucide:power" className="icon text-xl" /> Log Out
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
  );
};

// ============================================
// MAIN LAYOUT COMPONENT
// ============================================
const MasterLayout = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");
  const fullName = localStorage.getItem("fullName");
  const role = localStorage.getItem("role");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Redux state
  const tenantValue = useSelector((state) => state.branch.tenant);
  const academicYearValue = useSelector((state) => state.branch.academicYear);

  // Local state
  const [sidebarActive, setSidebarActive] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localTenant, setLocalTenant] = useState(tenantValue || "SCHOOL-ENG");
  const [localAcademicYear, setLocalAcademicYear] = useState("2025-2026");
  const [medium, setMedium] = useState([]);
  const [year, setYear] = useState([]);

  // Initialize tenant and academic year
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
  }, [accessToken]);

  // Handle dropdown functionality
  useEffect(() => {
    const handleDropdownClick = (event) => {
      event.preventDefault();
      const clickedDropdown = event.currentTarget.closest(".dropdown");
      if (!clickedDropdown) return;

      const isActive = clickedDropdown.classList.contains("open");
      document.querySelectorAll(".sidebar-menu .dropdown").forEach((dropdown) => {
        dropdown.classList.remove("open");
      });

      if (!isActive) {
        clickedDropdown.classList.add("open");
      }
    };

    const openActiveDropdown = () => {
      document.querySelectorAll(".sidebar-menu .dropdown").forEach((dropdown) => {
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

    const dropdownTriggers = document.querySelectorAll(
      ".sidebar-menu .dropdown > a, .sidebar-menu .dropdown > Link"
    );

    dropdownTriggers.forEach((trigger) => {
      trigger.addEventListener("click", handleDropdownClick);
    });

    openActiveDropdown();

    return () => {
      dropdownTriggers.forEach((trigger) => {
        trigger.removeEventListener("click", handleDropdownClick);
      });
    };
  }, [location.pathname]);

  // Handlers
  const handleSwitch = () => {
    localStorage.setItem("tenant", localTenant);
    localStorage.setItem("academicYear", localAcademicYear);
    dispatch(setTenant(localTenant));
    dispatch(setAcademicYear(localAcademicYear));
  };

  const handleLogOut = async () => {
    setIsLoading(true);
    try {
      localStorage.clear();
      Toast.showSuccessToast("Logged out Successfully");
      navigate("/sign-in");
    } catch (error) {
      Toast.showErrorToast("Logout failed: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  const isLaptop = window.matchMedia("(min-width: 1024px)").matches;


  return (
    <section className={mobileMenu ? "overlay active" : "overlay"}>
      <Sidebar
        mobileMenu={mobileMenu}
        onMobileMenuClose={() => setMobileMenu(false)}
        userRole={role}
      />

      <main
        className={sidebarActive ? "dashboard-main active" : "dashboard-main"}
      >
        <div className="navbar-header">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <div className="d-flex flex-wrap align-items-center gap-4">
            {!isLaptop && (
  <button
    type="button"
    className="sidebar-toggle"
    onClick={() => !isLaptop && setSidebarActive(!sidebarActive)}
  >
    {sidebarActive ? (
      <Icon icon="iconoir:arrow-right" className="icon text-2xl non-active" />
    ) : (
      <Icon icon="heroicons:bars-3-solid" className="icon text-2xl non-active" />
    )}
  </button>
)}

                <button
                  onClick={() => setMobileMenu(!mobileMenu)}
                  type="button"
                  className="sidebar-mobile-toggle"
                >
                  <Icon icon="heroicons:bars-3-solid" className="icon" />
                </button>

                <div className="font-bold text-lg sm:text-xl md:text-3xl text-slate-700">
                  School Name
                </div>

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
                  <TenantYearSwitch
                    localTenant={localTenant}
                    localAcademicYear={localAcademicYear}
                    medium={medium}
                    year={year}
                    onTenantChange={setLocalTenant}
                    onYearChange={setLocalAcademicYear}
                    onSwitch={handleSwitch}
                  />

                  <ProfileDropdown
                    fullName={fullName}
                    role={role}
                    onLogout={handleLogOut}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-main-body">{children}</div>

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