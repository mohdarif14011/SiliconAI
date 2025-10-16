
import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => (
  <div className={cn(className)}>
    <img width="45px" src="/favicon.svg" alt="SiliconAI Logo" />
  </div>
);
