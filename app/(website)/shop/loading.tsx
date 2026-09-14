export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-8 sm:py-10 animate-pulse">
      <div className="h-4 w-32 bg-tes-border rounded" />
      <div className="mt-4 h-9 w-48 bg-tes-border rounded" />
      <div className="mt-8 flex flex-col lg:flex-row gap-8">
        <div className="hidden lg:block w-64 shrink-0 space-y-4">
          <div className="h-40 bg-tes-border rounded-xl" />
          <div className="h-24 bg-tes-border rounded-xl" />
        </div>
        <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl bg-tes-border" />
          ))}
        </div>
      </div>
    </div>
  );
}
