export function PageLayout({
  title,
  children,
  actions,
}: {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col px-12 pt-12">
      <div className="mx-auto w-full">
        <div className="rounded-2xl bg-white p-6 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
          {(title || actions) && (
            <div className="mb-4 flex items-center justify-between gap-4">
              {title && <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">{title}</h1>}
              {!title && <div />}
              {actions}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
