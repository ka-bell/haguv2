import { HaguFlowHeader } from "@/components/hagu/hagu-flow-header"
import { PageContent, PageFixedHeader, PageShell } from "@/components/ui/page-shell"

type HaguProviderTabShellProps = {
  children: React.ReactNode
}

/** Provider tab screens — fixed glass header, scrollable content, bottom nav spacing. */
export function HaguProviderTabShell({ children }: HaguProviderTabShellProps) {
  return (
    <PageShell className="bg-[#FCFFFF] px-6 pb-28 pt-0">
      <PageFixedHeader>
        <HaguFlowHeader />
      </PageFixedHeader>
      <PageContent className="pb-0" underFixedHeader>
        {children}
      </PageContent>
    </PageShell>
  )
}

type HaguFlowPageShellProps = {
  children: React.ReactNode
  onBack: () => void
  closeHref?: string | null
}

/** Flow sub-screens — fixed back/close header with scrollable body. */
export function HaguFlowPageShell({ children, onBack, closeHref }: HaguFlowPageShellProps) {
  return (
    <PageShell className="bg-[#FCFFFF] px-6 pb-28 pt-0">
      <PageFixedHeader>
        <HaguFlowHeader onBack={onBack} closeHref={closeHref} />
      </PageFixedHeader>
      <PageContent className="pb-0" underFixedHeader>
        {children}
      </PageContent>
    </PageShell>
  )
}
