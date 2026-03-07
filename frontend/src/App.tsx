// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Auth & Other Pages
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";

// Dashboard & Layout
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./components/Dashboard/Dashboard";

// UI Elements
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";

// Charts
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";

// Tables & Forms
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";

// User Management
import UserRegister from "./components/UserRegister";
import AllUsers from "./components/AllUsers";

// Client Management
import AddClient from "./components/ClientManagement/AddClients";
import AllClients from "./components/ClientManagement/AllClients";
import ClientView from "./components/ClientManagement/ViewClient";
import ClientEdit from "./components/ClientManagement/ClientEdit";

// Renewal & Reports
import RenewalReminder from "./components/RenewalReminder";
import ProfitReport from "./components/profit/ProfitReport";

// User Profile Pages
import EditProfile from "./components/UserProfile/EditProfile";
import AccountSettings from "./components/UserProfile/AccountSettings";
import Support from "./components/UserProfile/Support";

// Private Route
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        {/* Protected Routes */}
        <Route
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          {/* Dashboard */}
          <Route path="/" element={<Home />} />

          {/* User Profile Pages */}
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/account-settings" element={<AccountSettings />} />
          <Route path="/support" element={<Support />} />

          {/* UI Elements */}
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/form-elements" element={<FormElements />} />
          <Route path="/basic-tables" element={<BasicTables />} />
          <Route path="/blank" element={<Blank />} />
          <Route path="/line-chart" element={<LineChart />} />
          <Route path="/bar-chart" element={<BarChart />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/avatars" element={<Avatars />} />
          <Route path="/badge" element={<Badges />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/images" element={<Images />} />
          <Route path="/videos" element={<Videos />} />

          {/* User Management */}
          <Route path="/user-register" element={<UserRegister />} />
          <Route path="/all-users" element={<AllUsers />} />

          {/* Client Management */}
          <Route path="/clients" element={<AllClients />} />
          <Route path="/clients/add" element={<AddClient />} />
          <Route path="/clients/view/:id" element={<ClientView />} />
          <Route path="/clients/edit/:id" element={<ClientEdit />} />

          {/* Renewal Reminder */}
          <Route path="/renewals" element={<RenewalReminder />} />

          {/* Profit Report */}
          <Route path="/profit-report" element={<ProfitReport />} />
        </Route>

        {/* Public Route */}
        <Route path="/signin" element={<SignIn />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;