import { Link, useMatchRoute, useNavigate, type LinkProps } from '@tanstack/react-router'
import {
  Activity,
  Bell,
  Building2,
  Calendar,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Pill,
  Settings,
  TestTubeDiagonal,
  UserRound,
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
    { title: 'Medical Records', icon: FileText },
    { title: 'Prescriptions', icon: Pill },
    { title: 'Lab', icon: TestTubeDiagonal },
    { title: 'Notifications', icon: Bell },
  ],
  DOCTOR: [
    { title: 'Dashboard', icon: LayoutDashboard, to: '/doctor/dashboard' },
    { title: 'Appointments', icon: Calendar },
    { title: 'Patients', icon: Users },
    { title: 'Lab', icon: TestTubeDiagonal },
    { title: 'Notifications', icon: Bell },
  ],
  RECEPTIONIST: [
    { title: 'Dashboard', icon: LayoutDashboard, to: '/receptionist/dashboard' },
    { title: 'Appointments', icon: Calendar },
    { title: 'Patients', icon: Users },
    { title: 'Lab', icon: TestTubeDiagonal },
    { title: 'Notifications', icon: Bell },
  ],
  ADMIN: [
    { title: 'Dashboard', icon: LayoutDashboard, to: '/admin/dashboard' },
    { title: 'Users', icon: Users },
    { title: 'Departments', icon: Building2 },
    { title: 'Lab', icon: TestTubeDiagonal },
    { title: 'Notifications', icon: Bell },
  ],
}

// MISC group — keyed by role so items/routes can differ per portal. Placeholders
// (no `to`) until the profile/settings/help routes exist; add a role-scoped `to`
// (e.g. '/patient/profile') then.
const MISC_BY_ROLE: Record<Role, NavItem[]> = {
  PATIENT: [
    { title: 'Profile', icon: UserRound },
    { title: 'Settings', icon: Settings },
    { title: 'Help center', icon: HelpCircle },
  ],
  DOCTOR: [
    { title: 'Profile', icon: UserRound },
    { title: 'Settings', icon: Settings },
    { title: 'Help center', icon: HelpCircle },
  ],
  RECEPTIONIST: [
    { title: 'Profile', icon: UserRound },
    { title: 'Settings', icon: Settings },
    { title: 'Help center', icon: HelpCircle },
  ],
  ADMIN: [
    { title: 'Profile', icon: UserRound },
    { title: 'Settings', icon: Settings },
    { title: 'Help center', icon: HelpCircle },
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

  const renderItems = (items: NavItem[]) =>
    items.map((item) =>
      item.to ? (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            tooltip={item.title}
            isActive={!!matchRoute({ to: item.to, fuzzy: true })}
            className="px-4 py-5"
          >
            <Link to={item.to}>
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ) : (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton tooltip={`${item.title} (coming soon)`} disabled className="px-4 py-5">
            <item.icon />
            <span>{item.title}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ),
    )

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-1 py-1.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#6CC7C3]/20">
            <Activity className="size-[22px] text-[#6CC7C3]" strokeWidth={2.8} />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold tracking-tight text-sidebar-foreground">MediCore</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/70">
              {ROLE_LABEL[role]}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>MENU</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(NAV_BY_ROLE[role])}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>MISC</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(MISC_BY_ROLE[role])}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className='flex'>
            <SidebarMenuButton className="pointer-events-none flex-1" size="lg">
              <Avatar className="size-8 rounded-md">
                <AvatarFallback className="rounded-md text-xs">
                  {initialsOf(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden text-left group-data-[collapsible=icon]:hidden">
                <span className="truncate text-sm font-medium">{user?.name ?? 'Signed in'}</span>
                <span className="truncate text-xs text-sidebar-foreground/70">{user?.email}</span>
              </div>
            </SidebarMenuButton>
            <SidebarMenuButton className='w-10 h-full flex items-center justify-center hover:bg-transparent' tooltip="Log out" onClick={handleLogout}>
              <LogOut className='size-12' />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
