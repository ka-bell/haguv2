import { HaguFlowHeader } from "@/components/hagu/hagu-flow-header"
import { PageContent, PageShell } from "@/components/ui/page-shell"

type HaguProviderTabShellProps = {
  children: React.ReactNode
}

/** Provider app tab screens — glass header + canvas background + bottom nav spacing */
export function HaguProviderTabShell({ children }: HaguProviderTabShellProps) {
  return (
    <PageShell className="bg-[#FCFFFF] px-6 pb-28 pt-14">
      <PageContent className="pb-0">
        <HaguFlowHeader className="mb-5" />
        {children}
      </PageContent>
    </PageShell>
  )
}
