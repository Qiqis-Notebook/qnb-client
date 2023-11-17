import Divider from "@Components/Divider";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

export default function FullCardSkeleton() {
  return (
    <div className="w-full h-full rounded-lg bg-base-200 p-2 flex flex-col gap-1 border border-transparent">
      <div className="w-full skeleton h-6" />
      <div className="flex flex-row items-center">
        <div className="rounded-full skeleton">
          <div className="h-6 w-6 " />
        </div>
        <div className="ml-1 w-24 h-full skeleton" />
        <CalendarDaysIcon className="ml-2 h-full w-4" title="Last updated" />
        <div className="ml-1 w-24 h-full skeleton" />
      </div>
      <Divider />
      {/* Content */}
      <div className="grow skeleton h-[100px]" />
      <Divider />
      {/* Footer */}
      <div className="flex items-center justify-between flex-row">
        <div className="grow h-10 skeleton" />
      </div>
    </div>
  );
}
