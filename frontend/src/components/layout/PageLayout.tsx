import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';

export function PageLayout({
  title,
  children,
  actions,
  back,
  backLabel = 'Go back',
}: {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  back?: string;
  backLabel?: string;
}) {
  return (
    <div className="flex flex-1 flex-col px-12 pt-12">
      <div className="mx-auto w-full">
        <div className="rounded-2xl bg-white p-6 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
          {(title || actions) && (
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {back && (
                  <Link
                    to={back}
                    aria-label={backLabel}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeftIcon size={20} />
                  </Link>
                )}
                {title && <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">{title}</h1>}
              </div>
              {actions ?? <div />}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
