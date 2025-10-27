import { Cable, House, Workflow } from 'lucide-react';
import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link } from 'react-router-dom';

const navItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: House,
  },
  {
    title: 'Workflows',
    url: '/dashboard/workflows',
    icon: Workflow,
  },
  {
    title: 'Connections',
    url: '/dashboard/connections',
    icon: Cable,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="floating" {...props} className="p-0">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Workflow className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Floww Dashboard</span>
                  <span className="">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="gap-2">
          {navItems?.length ? (
            <div className="ml-0 border-l-0 px-1.5">
              {navItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <div className="flex items-center">
                      <item.icon className="size-4" />
                      <Link to={item.url} className="text-sm">
                        {item.title}
                      </Link>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </div>
          ) : null}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
