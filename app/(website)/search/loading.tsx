export default function SearchLoading() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-8 sm:py-10 animate-pulse">
      <div className="h-4 w-24 bg-tes-border rounded" />
      <div className="mt-4 h-9 w-64 bg-tes-border rounded" />
      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-2xl bg-tes-border" />
        ))}
      </div>
    </div>
  );
}
