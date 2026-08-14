import type { ReactNode } from 'react'
import type { Role } from '@/types'
import { AppSidebar } from './app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'

/**
 * Shared chrome for every authenticated portal: a role-aware sidebar plus a
 * header with the collapse trigger. Role layouts wrap their <Outlet /> in this.
 */
export function PortalShell({ role, children }: { role: Role; children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          {/* breadcrumb slot */}
        </header>
        <div className="flex-1 overflow-auto p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
