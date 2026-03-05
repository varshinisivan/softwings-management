import React from "react";
import { Link } from "react-router-dom";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* LEFT SIDE - Login Form */}
      <div className="flex items-center justify-center w-full lg:w-1/2 px-6 bg-gray-50 dark:bg-gray-900">
        {children}
      </div>

      {/* RIGHT SIDE - TailAdmin style Logo Section with grid background */}
      <div className="hidden lg:flex w-full lg:w-1/2 items-center justify-center bg-brand-700 text-white p-10 relative overflow-hidden">

        {/* Grid background using TailAdmin pattern */}
        <div className="absolute inset-0 z-0 grid grid-cols-4 grid-rows-4 gap-4 opacity-10">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="w-full h-full bg-white rounded opacity-20"
            />
          ))}
        </div>

        <div className="flex flex-col items-center max-w-xs text-center z-10">
          
          {/* Logo + Text side by side */}
          <Link to="/" className="flex items-center gap-3 mb-4">
            <img
              width={40}
              height={40}
              src="/images/logo/softwings-logo.png"
              alt="SoftWings"
            />
            <span className="text-2xl font-semibold text-white">
              SoftWings
            </span>
          </Link>

          <h2 className="mt-2 text-3xl font-semibold">
            Welcome to SoftWings
          </h2>
          <p className="mt-3 text-gray-200 text-sm lg:text-base">
            Client Management & Renewal Tracking System
          </p>

        </div>
      </div>

    </div>
  );
}