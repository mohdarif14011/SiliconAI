
import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => (
  <div className={cn(className)}>
    <img style={{borderRadius:"50%", marginLeft:"5px"}} width="45px" src="/favicon.svg" alt="SiliconAI Logo" />
  </div>
);
