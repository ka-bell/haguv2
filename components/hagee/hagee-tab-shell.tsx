import { PageContent, PageShell } from "@/components/ui/page-shell"

type HageeTabShellProps = {
  children: React.ReactNode
  className?: string
}

/** HAGEE tab screens — scrollable content with bottom nav spacing. */
export function HageeTabShell({ children, className }: HageeTabShellProps) {
  return (
    <PageShell className={className ?? "bg-[#FCFFFF] px-5 pb-28 pt-0"}>
      <PageContent className="pb-0 pt-14">{children}</PageContent>
    </PageShell>
  )
}
