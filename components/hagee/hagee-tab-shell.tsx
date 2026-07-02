import { HaguFlowHeader } from "@/components/hagu/hagu-flow-header"
import { PageContent, PageFixedHeader, PageShell } from "@/components/ui/page-shell"

type HageeTabShellProps = {
  children: React.ReactNode
  className?: string
}

type HageeFlowPageShellProps = {
  children: React.ReactNode
  onBack: () => void
  closeHref?: string | null
}

/** HAGEE flow sub-screens — fixed back/close header with scrollable body. */
export function HageeFlowPageShell({ children, onBack, closeHref }: HageeFlowPageShellProps) {
  return (
    <PageShell className="bg-hagu-canvas px-6 pb-[var(--hagu-tab-nav-clearance)] pt-0">
      <PageFixedHeader className="bg-hagu-canvas">
        <HaguFlowHeader onBack={onBack} closeHref={closeHref} />
      </PageFixedHeader>
      <PageContent className="pb-0" underFixedHeader>
        {children}
      </PageContent>
    </PageShell>
  )
}

/** HAGEE tab screens — fixed glass header, scrollable content, bottom nav spacing. */
export function HageeTabShell({ children, className }: HageeTabShellProps) {
  return (
    <PageShell className={className ?? "bg-hagu-canvas px-6 pb-[var(--hagu-tab-nav-clearance)] pt-0"}>
      <PageFixedHeader>
        <HaguFlowHeader />
      </PageFixedHeader>
      <PageContent className="pb-0" underFixedHeader>
        {children}
      </PageContent>
    </PageShell>
  )
}
