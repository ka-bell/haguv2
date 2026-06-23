import Link from "next/link"
import { ROUTES } from "@/lib/routes"
import { isPrototypeMode } from "@/lib/prototype"
import {
  FIGMA_BASE,
  HAGU_PROVIDER_APP_FLOW,
  HAGEE_CLIENT_FLOW,
  AUTH_ONBOARDING_FLOWS,
  figmaNode,
} from "@/lib/figma-flows"

type FlowScreen = {
  href?: string
  name: string
  group: string
  figma?: string
  notes?: string
}

const AUTH_SCREENS: FlowScreen[] = [
  { href: ROUTES.entry, name: "Entry", group: "Auth" },
  { href: ROUTES.login, name: "Login", group: "Auth" },
  { href: ROUTES.forgotPassword, name: "Forgot password", group: "Auth" },
  { href: ROUTES.selectRole, name: "Select role", group: "Auth" },
]

const ONBOARDING_SCREENS: FlowScreen[] = AUTH_ONBOARDING_FLOWS.map((flow) => ({
  href: flow.id === "hagee-onboarding" ? ROUTES.onboardingHagee : ROUTES.onboardingHagu,
  name: flow.name,
  group: "Onboarding",
  figma: figmaNode(flow.figmaNodeId),
}))

const HAGEE_APP_SCREENS: FlowScreen[] = HAGEE_CLIENT_FLOW.screens.map((screen) => ({
  href: screen.route,
  name: screen.name,
  group: "HAGEE Client App",
  figma: figmaNode(screen.figmaNodeId),
  notes: screen.notes,
}))

const APP_SCREENS: FlowScreen[] = HAGU_PROVIDER_APP_FLOW.screens.map((screen) => ({
  href: screen.route,
  name: screen.name,
  group: "HAGU Provider App",
  figma: figmaNode(screen.figmaNodeId),
  notes: screen.notes,
}))

const DEV_SCREENS: FlowScreen[] = [
  { href: "/dev/components", name: "Component library", group: "Dev" },
]

const SCREENS: FlowScreen[] = [...AUTH_SCREENS, ...ONBOARDING_SCREENS, ...APP_SCREENS, ...HAGEE_APP_SCREENS, ...DEV_SCREENS]

const GROUPS = ["Auth", "Onboarding", "HAGU Provider App", "HAGEE Client App", "Dev"] as const

export default function DevFlowPage() {
  const prototype = isPrototypeMode()

  return (
    <main className="mx-auto min-h-dvh max-w-lg bg-[#FCFFFF] px-6 py-10 text-[#2D1012]">
      <h1 className="text-2xl font-semibold tracking-tight text-[#1A1A1E]">Flow map</h1>
      <p className="mt-2 text-sm text-[#8A8A96]">
        Dev index for all screens. Figma is the source of truth — see <code className="text-xs">docs/HANDOFF.md</code>{" "}
        in the repo.
      </p>

      <a
        href={figmaNode(HAGEE_CLIENT_FLOW.figmaNodeId)}
        target="_blank"
        rel="noreferrer"
        className="mt-4 block rounded-2xl border border-[#5BBFB5] bg-[rgba(208,241,240,0.4)] px-4 py-3 text-sm text-[#1A1A1E] hover:underline"
      >
        <strong>HAGEE Client flow</strong> — {HAGEE_CLIENT_FLOW.screens.length} screens in Figma frame{" "}
        <code className="text-xs">{HAGEE_CLIENT_FLOW.figmaNodeId}</code>
      </a>

      <a
        href={figmaNode(HAGU_PROVIDER_APP_FLOW.figmaNodeId)}
        target="_blank"
        rel="noreferrer"
        className="mt-4 block rounded-2xl border border-[#5BBFB5] bg-[rgba(208,241,240,0.4)] px-4 py-3 text-sm text-[#1A1A1E] hover:underline"
      >
        <strong>HAGU Provider App flow</strong> — {HAGU_PROVIDER_APP_FLOW.screens.length} screens in Figma frame{" "}
        <code className="text-xs">{HAGU_PROVIDER_APP_FLOW.figmaNodeId}</code>
      </a>

      <div
        className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
          prototype ? "border-[#5BBFB5] bg-[rgba(208,241,240,0.4)]" : "border-black/10 bg-[#F7F6F3]"
        }`}
      >
        {prototype ? (
          <p>
            <strong>Prototype mode on.</strong> Auth guards and disabled CTAs are bypassed.
          </p>
        ) : (
          <p>
            <strong>Prototype mode off.</strong> Set <code className="text-xs">NEXT_PUBLIC_PROTOTYPE=true</code> in{" "}
            <code className="text-xs">.env.local</code> and restart the dev server for click-through without blockers.
          </p>
        )}
      </div>

      <div className="mt-8 space-y-8">
        {GROUPS.map((group) => {
          const items = SCREENS.filter((s) => s.group === group)
          if (items.length === 0) return null
          return (
            <section key={group}>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-[#4A4A52]">{group}</h2>
              <ul className="mt-3 space-y-2">
                {items.map((screen) => (
                  <li
                    key={`${screen.name}-${screen.figma ?? screen.href}`}
                    className="rounded-2xl border border-black/[0.06] bg-white px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      {screen.href ? (
                        <Link href={screen.href} className="font-medium text-[#1A1A1E] hover:underline">
                          {screen.name}
                        </Link>
                      ) : (
                        <span className="font-medium text-[#1A1A1E]">{screen.name}</span>
                      )}
                      {screen.href ? (
                        <span className="text-xs text-[#8A8A96]">{screen.href}</span>
                      ) : (
                        <span className="text-xs text-[#8A8A96]">Figma only</span>
                      )}
                    </div>
                    {screen.notes ? <p className="mt-1 text-xs text-[#8A8A96]">{screen.notes}</p> : null}
                    {screen.figma ? (
                      <a
                        href={screen.figma}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-xs text-[#5BBFB5] underline"
                      >
                        Open in Figma
                      </a>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>

      <div className="mt-10 space-y-2 border-t border-black/[0.06] pt-6 text-sm text-[#8A8A96]">
        <p>
          <Link href={FIGMA_BASE} target="_blank" rel="noreferrer" className="text-[#1A1A1E] underline">
            Figma file
          </Link>
        </p>
        <p>
          <Link href={ROUTES.entry} className="text-[#1A1A1E] underline">
            Back to entry
          </Link>
        </p>
      </div>
    </main>
  )
}
