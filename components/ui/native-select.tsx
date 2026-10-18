import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

function NativeSelect({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative w-full has-disabled:opacity-50">
      <select
        data-slot="native-select"
        className={cn(
          "h-10 w-full min-w-0 appearance-none rounded-md border border-input bg-transparent py-2 pr-9 pl-3 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed aria-invalid:border-destructive [&_option]:bg-background [&_option]:text-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 opacity-60" />
    </div>
  );
}

export { NativeSelect };
