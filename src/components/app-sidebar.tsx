import { Link, useMatchRoute, useNavigate, type LinkProps } from '@tanstack/react-router'
import {
  Building2,
  Calendar,
  FileText,
  LayoutDashboard,
  LogOut,
  Pill,
  Stethoscope,
  Users,
  type LucideIcon,
} from 'lucide-react'
import type { Role } from '@/types'
import { useAuthStore } from '@/stores/auth.store'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useLogout } from '@/hooks/useAuth'

// `to` accepts any registered route (type-safe); items without a `to` render as
// disabled placeholders.
type NavItem = { title: string; icon: LucideIcon; to?: LinkProps['to'] }

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  PATIENT: [
    { title: 'Dashboard', icon: LayoutDashboard, to: '/patient/dashboard' },
    { title: 'Appointments', icon: Calendar, to: '/patient/appointments' },
    { title: 'Medical records', icon: FileText },
    { title: 'Prescriptions', icon: Pill },
  ],
  DOCTOR: [
    { title: 'Dashboard', icon: LayoutDashboard, to: '/doctor/dashboard' },
    { title: 'Appointments', icon: Calendar },
    { title: 'Patients', icon: Users },
  ],
  RECEPTIONIST: [
    { title: 'Dashboard', icon: LayoutDashboard, to: '/receptionist/dashboard' },
    { title: 'Appointments', icon: Calendar },
    { title: 'Patients', icon: Users },
  ],
  ADMIN: [
    { title: 'Dashboard', icon: LayoutDashboard, to: '/admin/dashboard' },
    { title: 'Users', icon: Users },
    { title: 'Departments', icon: Building2 },
  ],
}

const ROLE_LABEL: Record<Role, string> = {
  PATIENT: 'Patient',
  DOCTOR: 'Doctor',
  RECEPTIONIST: 'Receptionist',
  ADMIN: 'Admin',
}

const initialsOf = (name?: string): string =>
  (name ?? '')
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?'

export function AppSidebar({ role }: { role: Role }) {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const matchRoute = useMatchRoute()
  const logout = useLogout()

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        navigate({ to: '/login' })
      }
    })
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-1 py-1.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Stethoscope className="size-4" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold text-foreground">Medicore</span>
            <span className="text-xs text-muted-foreground">{ROLE_LABEL[role]}</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_BY_ROLE[role].map((item) =>
                item.to ? (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={!!matchRoute({ to: item.to, fuzzy: true })}
                    >
                      <Link to={item.to}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton tooltip={`${item.title} (coming soon)`} disabled>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="pointer-events-none" size="lg">
              <Avatar className="size-8 rounded-md">
                <AvatarFallback className="rounded-md text-xs">
                  {initialsOf(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden text-left group-data-[collapsible=icon]:hidden">
                <span className="truncate text-sm font-medium">{user?.name ?? 'Signed in'}</span>
                <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Log out" onClick={handleLogout}>
              <LogOut />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
