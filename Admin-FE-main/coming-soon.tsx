"use client";

import { useEffect, useState } from "react";

export default function ComingSoonPage() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seoulTime = new Date(
    time.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );

  const date = seoulTime.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const hour = seoulTime.getHours().toString().padStart(2, "0");
  const minute = seoulTime.getMinutes().toString().padStart(2, "0");
  const second = seoulTime.getSeconds().toString().padStart(2, "0");

  const items = [
    { label: "Date", value: date },
    { label: "Hour", value: hour },
    { label: "Minute", value: minute },
    { label: "Second", value: second },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center space-y-14">
      <div className="space-y-4">
        <h1 className="text-5xl font-extrabold tracking-tight">
          CyberSecure Supply Chain AI Agent
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          An automated system for collecting and intuitively presenting EPSS and actionable threat intelligence.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-8 text-center mt-1">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex flex-col justify-center items-center border rounded-2xl shadow-md w-36 h-32 py-4"
          >
            <div className="flex flex-col items-center leading-tight space-y-0.5">
              <p className="text-3xl font-bold tracking-tight">{item.value}</p>
              <p className="text-sm text-gray-500">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => (window.location.href = "/login")}
        className="mt-12 px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition text-lg font-medium"
      >
        Login
      </button>
    </div>
  );
}
