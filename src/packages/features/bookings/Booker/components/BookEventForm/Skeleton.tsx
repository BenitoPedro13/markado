import { Text as SkeletonText } from "@/components/align-ui/ui/skeleton";

export const FormSkeleton = () => (
  <div className="flex flex-col space-y-6">
    {/* Nome */}
    <div>
      <SkeletonText className="h-5 w-16 mb-2" />
      <SkeletonText className="h-10 w-full rounded-[10px]" />
    </div>

    {/* Email */}
    <div>
      <SkeletonText className="h-5 w-20 mb-2" />
      <SkeletonText className="h-10 w-full rounded-[10px]" />
    </div>

    {/* Notas */}
    <div>
      <SkeletonText className="h-5 w-16 mb-2" />
      <SkeletonText className="h-20 w-full rounded-[10px]" />
    </div>

    {/* Botões */}
    <div className="flex gap-3 justify-end mt-8">
      <SkeletonText className="h-10 w-20 rounded-[10px]" />
      <SkeletonText className="h-10 w-24 rounded-[10px]" />
    </div>
  </div>
);
