// Main exports
export { SidebarProvider, useSidebar } from './context'
export { Sidebar } from './sidebar-main'
export { SidebarTrigger } from './sidebar-trigger'
export { SidebarRail } from './sidebar-rail'
export { 
  SidebarInset,
  SidebarInput,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarSeparator
} from './sidebar-simple-components'
export {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent
} from './sidebar-group-components'
export {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from './sidebar-menu-components'

// Re-export constants if needed externally
export * from './constants'