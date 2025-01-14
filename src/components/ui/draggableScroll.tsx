"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils";

interface DraggableScrollAreaProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  className?: string;
  children?: React.ReactNode;
}

const DraggableScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  DraggableScrollAreaProps
>(({ className, children, ...props }, ref) => {
  const viewportRef = React.useRef<HTMLDivElement>(null);

  // Draggable scroll variables
  let isDragging = false;
  let startY = 0;
  let startScrollTop = 0;

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging = true;
    startY = e.clientY;
    startScrollTop = viewportRef.current?.scrollTop || 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !viewportRef.current) return;
    const dy = e.clientY - startY;
    viewportRef.current.scrollTop = startScrollTop - dy;
  };

  const handleMouseUp = () => {
    isDragging = false;
  };

  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        ref={viewportRef}
        className="h-full w-full rounded-[inherit] cursor-grab"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)", // Fades the text
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)", // For WebKit browsers
        }}
        onTouchStart={(e) => {
          isDragging = true;
          startY = e.touches[0].clientY;
          startScrollTop = viewportRef.current?.scrollTop || 0;
        }}
        onTouchMove={(e) => {
          if (!isDragging || !viewportRef.current) return;
          const dy = e.touches[0].clientY - startY;
          viewportRef.current.scrollTop = startScrollTop - dy;
        }}
        onTouchEnd={handleMouseUp}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>

      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
});
DraggableScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

interface ScrollBarProps
  extends React.ComponentPropsWithoutRef<
    typeof ScrollAreaPrimitive.ScrollAreaScrollbar
  > {
  className?: string;
  orientation?: "horizontal" | "vertical";
}

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ScrollBarProps
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full border-l border-l-transparent ",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { DraggableScrollArea };
