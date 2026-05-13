import PhoenixLogoImage from "@/assets/PhoenixLogo.png";
import { Link } from "@tanstack/react-router";

export function PhoenixLogo({ className = "" }: { className?: string }) {
  return (
    <Link to="/dashboard" className={`flex items-center ${className}`}>
      <img
        src={PhoenixLogoImage}
        alt="Phoenix Contact"
        className="h-8 w-auto object-contain"
      />
    </Link>
  );
}
