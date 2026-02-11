import React from "react";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">SOFTWINGS TECHNOLOGIES</h2>
        <p className="welcome">Welcome, User</p>

        <ul>
          <li className="active">Dashboard</li>
          <li>User Register</li>
          <li>Client Onboarding</li>
          <li>Renewal Reminders</li>
          <li>Profit Reports</li>
        </ul>

        <p className="logout">Logout</p>
      </div>

      {/* Main Content */}
      <div className="main-content">

        <h1>Dashboard</h1>
        <p className="sub-title">Overview Of Your Client Services</p>

        {/* Total Services */}
        <h2>Total Services</h2>
        <div className="card-grid">
          <div className="card">
            <h3>Domain</h3>
            <h1>5</h1>
            <p>Active Services</p>
          </div>

          <div className="card">
            <h3>Hosting</h3>
            <h1>3</h1>
            <p>Active Services</p>
          </div>

          <div className="card">
            <h3>AMC</h3>
            <h1>2</h1>
            <p>Active Services</p>
          </div>

          <div className="card">
            <h3>SSL</h3>
            <h1>4</h1>
            <p>Active Services</p>
          </div>
        </div>

        {/* Financial Overview */}
        <h2>Financial Overview</h2>
        <div className="card-grid">
          <div className="card">
            <h3>Total Hosting Revenue</h3>
            <h2>₹ 1,08,000</h2>
          </div>

          <div className="card">
            <h3>Total AMC Revenue</h3>
            <h2>₹ 1,05,000</h2>
          </div>
        </div>

        {/* Client Stats */}
        <h2>Client Statistics</h2>
        <div className="stats">
          <p>Total Clients: <b>5</b></p>
          <p>Active Services: <b>17</b></p>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
