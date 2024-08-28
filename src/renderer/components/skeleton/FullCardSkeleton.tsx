// Icons
import {
  CalendarDaysIcon,
  EyeIcon,
  GamepadIcon,
  HeartIcon,
} from "lucide-react";

// Components
import Divider from "@Components/Divider";

export default function FullCardSkeleton() {
  return (
    <div className="flex h-[260px] w-full flex-col gap-1 rounded-lg border border-transparent bg-base-200 p-2">
      {/* Info */}
      <div className="flex shrink-0 flex-row justify-between overflow-x-auto rounded-md bg-base-300 p-1 text-xs">
        <div className="inline-flex gap-1">
          <div className="inline-flex gap-0.5">
            <CalendarDaysIcon className="h-4 w-4" />
            <div className="skeleton h-full w-16" />
          </div>
          <div className="inline-flex gap-0.5">
            <GamepadIcon className="h-4 w-4" />
            <div className="skeleton h-full w-16" />
          </div>
        </div>
        <div className="inline-flex gap-1">
          <div className="inline-flex gap-0.5">
            <EyeIcon className="h-4 w-4" />
            <div className="skeleton h-full w-8" />
          </div>
          <div className="inline-flex gap-0.5">
            <HeartIcon className="h-4 w-4" />
            <div className="skeleton h-full w-8" />
          </div>
        </div>
      </div>
      <div className="skeleton h-6 w-full" />
      <div className="btn btn-disabled btn-ghost no-animation btn-xs justify-start gap-1 px-0">
        <div className="skeleton h-full rounded-full">
          <div className="aspect-square h-6 w-6" />
        </div>
        <div className="skeleton h-full w-24" />
      </div>
      <Divider />
      {/* Content */}
      <div className="skeleton h-[100px] grow" />
      <Divider />
      {/* Footer */}
      <div className="flex flex-row items-center gap-2">
        <div className="skeleton h-10 grow" />
        <div className="skeleton h-10 w-10" />
      </div>
    </div>
  );
}
