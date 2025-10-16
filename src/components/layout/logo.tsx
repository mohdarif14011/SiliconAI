
import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={cn("fill-current", className)}
  >
    <circle cx="12" cy="12" r="12" fill="black" />
    <text
      x="12"
      y="16"
      fontFamily="Arial, sans-serif"
      fontSize="12"
      fontWeight="bold"
      fill="white"
      textAnchor="middle"
    >
      Si
    </text>
  </svg>
);
