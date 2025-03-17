
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MovieCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full">
      <div className="aspect-[2/3] relative overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="p-3">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </Card>
  );
}
