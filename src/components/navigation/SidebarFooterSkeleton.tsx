export default function SidebarFooterSkeleton() {
  return (
    <div className="w-full p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
