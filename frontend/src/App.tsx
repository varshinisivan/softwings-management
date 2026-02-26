import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";

import UserRegister from "./pages/UserRegister";
import AllUsers from "./pages/AllUsers";

// 🔥 Client Management
import AddClient from "./pages/ClientManagement/AddClients";
import AllClients from "./pages/ClientManagement/AllClients";
import ClientView from "./pages/ClientManagement/ClientView";
import ClientEdit from "./pages/ClientManagement/ClientEdit";

// 🔔 Renewal Reminder
import RenewalReminder from "./pages/RenewalReminder";

// 🔐 Private Route
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        {/* ================= PROTECTED ROUTES ================= */}
        <Route
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          {/* Dashboard */}
          <Route path="/" element={<Home />} />

          {/* General */}
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/profile" element={<UserProfiles />} />
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

          {/* 👤 User Management */}
          <Route path="/user-register" element={<UserRegister />} />
          <Route path="/all-users" element={<AllUsers />} />

          {/* 🏢 Client Management */}
          <Route path="/clients/add" element={<AddClient />} />
          <Route path="/clients" element={<AllClients />} />
          <Route path="/clients/view/:id" element={<ClientView />} />
          <Route path="/clients/edit/:id" element={<ClientEdit />} />

          {/* 🔔 Renewal Reminder */}
          <Route path="/renewals" element={<RenewalReminder />} />
        </Route>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/signin" element={<SignIn />} />

        {/* ================= 404 ================= */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;