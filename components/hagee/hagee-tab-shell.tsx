import { HaguFlowHeader } from "@/components/hagu/hagu-flow-header"
import { PageContent, PageFixedHeader, PageShell } from "@/components/ui/page-shell"

type HageeTabShellProps = {
  children: React.ReactNode
  className?: string
}

/** HAGEE tab screens — fixed glass header, scrollable content, bottom nav spacing. */
export function HageeTabShell({ children, className }: HageeTabShellProps) {
  return (
    <PageShell className={className ?? "bg-hagu-canvas px-6 pb-28 pt-0"}>
      <PageFixedHeader>
        <HaguFlowHeader />
      </PageFixedHeader>
      <PageContent className="pb-0" underFixedHeader>
        {children}
      </PageContent>
    </PageShell>
  )
}
