export function PageLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col gap-12 px-12 pt-12">
      <h1 className="text-6xl text-black">{title}</h1>
      {children}
    </div>
  );
}
