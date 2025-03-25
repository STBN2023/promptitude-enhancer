
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedTransitionProps {
  children: React.ReactNode;
  show: boolean;
  className?: string;
  duration?: number;
}

const AnimatedTransition = ({
  children,
  show,
  className,
  duration = 300,
}: AnimatedTransitionProps) => {
  const [render, setRender] = useState(show);
  
  useEffect(() => {
    if (show) setRender(true);
    else {
      const timer = setTimeout(() => {
        setRender(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration]);
  
  if (!render) return null;
  
  return (
    <div
      className={cn(
        "transition-all duration-300 ease-in-out",
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export default AnimatedTransition;
