
;
import { Link, useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Home, BarChart3, Trophy, Target } from '@/components/icons';

const items = [
  {
    title: "OPERAÇÃO",
    url: "/",
    icon: Home,
  },
  {
    title: "DADOS",
    url: "/dados",
    icon: BarChart3,
  },
  {
    title: "OBJETIVOS",
    url: "/objetivo",
    icon: Target,
  },
  {
    title: "MEDALHAS",
    url: "/dashboard",
    icon: Trophy,
  },
];

export const SidebarNavigation = () => {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="px-2">
        <SidebarMenu>
          {items.map((item, index) => (
            <SidebarMenuItem key={item.title} className={`stagger-enter stagger-item`} style={{ animationDelay: `${index * 50}ms` }}>
              <SidebarMenuButton 
                asChild
                className={`
                  px-3 py-2 rounded-lg mb-1 transition-all duration-200 font-normal text-sm tactical-hover
                  ${location.pathname === item.url 
                    ? 'tactical-active tactical-border-gold-active bg-tactical-lightGray' 
                    : 'tactical-border-subtle text-white hover:text-tactical-gold'
                  }
                `}
              >
                <Link to={item.url} className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4" />
                  <span className="tactical-element text-xs tracking-tactical">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
