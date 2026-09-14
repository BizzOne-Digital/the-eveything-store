export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-8 sm:py-10 animate-pulse">
      <div className="h-4 w-40 bg-tes-border rounded" />
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="aspect-square rounded-2xl bg-tes-border" />
        <div className="space-y-4">
          <div className="h-4 w-24 bg-tes-border rounded" />
          <div className="h-8 w-3/4 bg-tes-border rounded" />
          <div className="h-6 w-32 bg-tes-border rounded" />
          <div className="h-24 w-full bg-tes-border rounded" />
          <div className="h-12 w-full bg-tes-border rounded-full" />
        </div>
      </div>
    </div>
  );
}
