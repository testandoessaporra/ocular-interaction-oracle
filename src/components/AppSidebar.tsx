
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader as SidebarHeaderUI,
} from "@/components/ui/sidebar";
import GamificationControls from "@/components/GamificationControls";
import ParticleEffect from "@/components/ParticleEffect";
import { SidebarHeader } from "@/components/sidebar/SidebarHeader";
import { SidebarNavigation } from "@/components/sidebar/SidebarNavigation";
import { useSidebarEvents } from "@/hooks/useSidebarEvents";

export function AppSidebar() {
  const [showParticles, setShowParticles] = useState(false);
  const [particlePosition, setParticlePosition] = useState({ x: 0, y: 0 });
  const [levelUpGlow, setLevelUpGlow] = useState(false);
  const [medalPulse, setMedalPulse] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useSidebarEvents({
    setLevelUpGlow,
    setMedalPulse,
    setShowConfetti,
    setParticlePosition,
    setShowParticles
  });

  return (
    <>
      <Sidebar className="tactical-sidebar border-r border-gray-800/50 rounded-tr-xl rounded-br-xl border-r-2 border-white/20 shadow-2xl">
        <SidebarHeaderUI className="p-0">
          <SidebarHeader 
            levelUpGlow={levelUpGlow}
            medalPulse={medalPulse}
            showConfetti={showConfetti}
          />
        </SidebarHeaderUI>
        
        <SidebarContent className="tactical-sidebar-bg">
          <SidebarNavigation />
        </SidebarContent>

        <SidebarFooter className="p-3 border-t border-gray-800/30 tactical-sidebar-bg">
          <div className="flex justify-center">
            <GamificationControls />
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Particle Effects */}
      {showParticles && (
        <ParticleEffect
          x={particlePosition.x}
          y={particlePosition.y}
          color="#F59E0B"
          onComplete={() => setShowParticles(false)}
        />
      )}
    </>
  );
}
