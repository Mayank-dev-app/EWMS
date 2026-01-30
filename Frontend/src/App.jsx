import { Navigate, Route, Routes } from "react-router-dom";

import LoginPage from "./Component/Auth/Login";

// Admin
import AdminDashboard from "./Component/Admin/AdminDashboard";
import AdminLayout from "./Component/Admin/AdminLayout";
import AdminProfile from "./Component/Admin/Admin";

import DepartmentsList from "./Component/Admin/DepartmentsManagement/DepartmentsList";
import EditDepartment from "./Component/Admin/DepartmentsManagement/EditDepartment";
import AddDepartment from "./Component/Admin/DepartmentsManagement/AddDepartment";
import DepartmentDetails from "./Component/Admin/DepartmentsManagement/ViewDepartment";

import ManagersList from "./Component/Admin/Managers/ManagersList";
import AddManager from "./Component/Admin/Managers/AddManager";
import AssignManager from "./Component/Admin/Managers/AssignManager";
import EditManager from "./Component/Admin/Managers/EditManager";

import AddEmployee from "./Component/Admin/Employee/AddEmployee";
import EditEmployee from "./Component/Admin/Employee/EditEmployee";
import EmployeesList from "./Component/Admin/Employee/EmployeesList";
import EmployeeDetails from "./Component/Admin/Employee/EmployeeDetails";

import ReportsPage from "./Component/Admin/Reports/ReportsPage";
import UserSetting from "./Component/Admin/Settings/UserSetting";
import ResetPassword from "./Component/Admin/Settings/ResetPassword";

import AllTasks from "./Component/Admin/Task/AllTasks";
import TaskDetails from "./Component/Admin/Task/TaskDetails";
import EditTask from "./Component/Admin/Task/EditTask";
import AddTask from "./Component/Admin/Task/AddTask";

import AccessControl from "./Component/Admin/Settings/UserSetting";


// Manager
import ManagerPanel from "./Component/Manager/ManagerPanel";
import ManagerDashboard from "./Component/Manager/Dashboard/ManagerDashboard";

import CurrentTasks from "./Component/Manager/Pages/TodayTask";
import TaskDetailsPage from "./Component/Manager/Pages/TaskDetailedPage";
import UpdateTaskModal from "./Component/Manager/Pages/TaskModal";
import TaskReports from "./Component/Manager/Reports/TaskReports";
import AssignTask from "./Component/Manager/AssignTask/AssignTask";

import DepartmentTaskSummary from "./Component/Manager/Pages/DeptTaskSummary";
import DepartmentFilteredTasks from "./Component/Manager/Pages/filterTaskbyDept";

import UniversalApprovalPanel from "./Component/Manager/ApproveWork/Aprovework";

import TrackPerformnace from "./Component/Manager/Performance/TrackPerformnacedetail";
import DailyProgress from "./Component/Manager/Performance/TrackPerformance";

// Employee
import EmployeeDashboard from "./Component/Employee/EmployeeDashboard";


import { ThemeProvider } from "./Component/Hooks/DarkLight"; //Hook
import ProtectedRoute from "./Component/Auth/ProtectRoute";
import { AuthProvider } from "./Component/Hooks/AuthContext";
import ForgotPassword from "./Component/Auth/ForgetPassword";
import VerifyAndChangePassword from "./Component/Auth/VerifyCode";

const App = () => {
  return (
    <>
      <ThemeProvider >
        <AuthProvider >
          <Routes>
            {/* LOGIN */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element = { <LoginPage />} />
            <Route path="/forget-password" element={<ForgotPassword />} />
            <Route path="/change-password" element={<VerifyAndChangePassword />} />

            {/* -------------------------MANAGER PARENT ROUTE-------------------------- */}
            <Route
              element={<ProtectedRoute allowedRoles={["Manager"]} />}
            >
              <Route path="/manager" element={<ManagerPanel />}>

                {/* Manager Dashboard */}
                <Route path="dashboard" element={<ManagerDashboard />} />

                {/* Department-wise tasks */}
                <Route path="dashboard/deptby-task" element={<DepartmentTaskSummary />} />
                <Route path="dashboard/task-summary/:dept" element={<DepartmentFilteredTasks />} />
                <Route path="dashboard/current-task" element={<CurrentTasks />} />
                <Route path="dashboard/current-task/updateModal" element={<UpdateTaskModal />} />
                <Route path="dashboard/current-task/task-detail/:id" element={<TaskDetailsPage />} />


                {/* Manager Other Pages */}
                <Route path="assign-task" element={<AssignTask />} />
                <Route path="track-performance" element={<DailyProgress />} />
                <Route path="track-performance/detail" element={<TrackPerformnace />} />

                <Route path="approve-work" element={<UniversalApprovalPanel />} />
                <Route path="task-reports" element={<TaskReports />} />

              </Route>
            </Route>

            {/* ----------------- EMPLOYEE ------------------ */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "Sales Executive",
                    "Inventory Manager",
                    "Web Developer",
                    "Software Developer",
                    "HR",
                    "Accountant",
                    "Designer",
                    "Technician"
                  ]}
                />
              }
            >
              <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            </Route>

            {/* -------------------------ADMIN PARENT ROUTE-------------------------- */}
            <Route
              element={<ProtectedRoute allowedRoles={["Admin"]} />}
            >
              <Route path="/admin" element={<AdminLayout />}  >

                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="profile" element={<AdminProfile />} />

                {/* DEPARTMENTS */}
                <Route path="departments" element={<DepartmentsList />} />
                <Route path="departments/add" element={<AddDepartment />} />
                <Route path="departments/edit/:id" element={<EditDepartment />} />
                <Route path="department/:id" element={<DepartmentDetails />} />

                {/* MANAGERS */}
                <Route path="managers" element={<ManagersList />} />
                <Route path="managers/add" element={<AddManager />} />
                <Route path="managers/assign" element={<AssignManager />} />
                <Route path="managers/edit/:id" element={<EditManager />} />

                {/* EMPLOYEES */}
                <Route path="employees" element={<EmployeesList />} />
                <Route path="employees/add" element={<AddEmployee />} />
                <Route path="employees/view/:id" element={<EmployeeDetails />} />
                <Route path="employees/edit/:id" element={<EditEmployee />} />

                {/* REPORTS */}
                <Route path="reports" element={<ReportsPage />} />

                {/* SETTINGS */}
                <Route path="access-control" element={<AccessControl />} />
                <Route path="settings/reset-password" element={<ResetPassword />} />

                {/* TASKS */}
                <Route path="tasks" element={<AllTasks />} />
                <Route path="tasks/create" element={<AddTask />} />
                <Route path="tasks/:id" element={<TaskDetails />} />
                <Route path="tasks/edit/:id" element={<EditTask />} />
              </Route>
            </Route>
            {/* ------------------------------------------------------------------- */}
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
