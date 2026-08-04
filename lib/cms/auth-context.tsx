"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  type AdminUser,
  type AdminSession,
  type LoginCredentials,
  AdminRole,
  Permission,
  hasPermission,
} from "@/lib/cms/types"
import {
  loginAdmin as loginApi,
  logoutAdmin as logoutApi,
  getCurrentAdmin,
  getAuthToken,
  setAuthToken,
  getAdminSession,
  setAdminSession,
  clearAuth,
} from "@/lib/cms/api"

interface AuthContextType {
  user: AdminUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  hasPermission: (permission: Permission) => boolean
  hasRole: (role: AdminRole) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"]

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken()
      const session = getAdminSession()
      
      if (token && session?.isLoggedIn) {
        try {
          // Verify token is still valid
          const admin = await getCurrentAdmin()
          if (admin) {
            setUser(admin)
          } else {
            clearAuth()
          }
        } catch {
          clearAuth()
        }
      }
      
      setIsLoading(false)
    }
    
    initAuth()
  }, [])

  // Protect routes
  useEffect(() => {
    if (isLoading) return
    
    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname?.startsWith(route))
    
    if (!user && !isPublicRoute) {
      router.push("/admin/login")
    } else if (user && isPublicRoute) {
      router.push("/admin/dashboard")
    }
  }, [user, isLoading, pathname, router])

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    try {
      const { token, user: adminUser } = await loginApi(credentials)
      
      setAuthToken(token)
      setAdminSession({
        isLoggedIn: true,
        token,
        user: adminUser,
      })
      setUser(adminUser)
      
      router.push("/admin/dashboard")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await logoutApi()
    } catch {
      // Ignore errors during logout
    } finally {
      setUser(null)
      router.push("/admin/login")
      setIsLoading(false)
    }
  }

  const checkPermission = (permission: Permission): boolean => {
    if (!user) return false
    return hasPermission(user.role, permission)
  }

  const checkRole = (role: AdminRole): boolean => {
    if (!user) return false
    if (user.role === "SUPER_ADMIN") return true
    return user.role === role
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        hasPermission: checkPermission,
        hasRole: checkRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}
