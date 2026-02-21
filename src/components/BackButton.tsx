import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import React from "react";

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div
      onClick={() => {
        if (location.pathname !== "/") {
          navigate("/");
          setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
      className="absolute top-4 left-4 z-40 px-4 py-2 text-sm text-white hover:text-white transition-colors cursor-pointer flex items-center gap-2"
      role="button"
      aria-label="Go back"
    >
      <ArrowLeft size={24} className="text-white" />
    </div>
  );
}
