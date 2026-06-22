/**
 * Prototype mode: skip auth guards and form validation so every screen is reachable.
 * Enable with NEXT_PUBLIC_PROTOTYPE=true in .env.local
 */
export function isPrototypeMode(): boolean {
  return process.env.NEXT_PUBLIC_PROTOTYPE === "true"
}
