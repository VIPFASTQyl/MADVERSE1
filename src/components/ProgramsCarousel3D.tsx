import { useEffect, useRef, useState } from "react";
import { Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TeamLink {
  href: string;
  label: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  links: TeamLink[];
}

type TeamCardLayout = {
  x: number;
  y: number;
  fanY: number;
  fanZ: number;
  scale: number;
  opacity: number;
  zIndex: number;
};

const SETTLE_MS = 900;
const SWITCH_DISTANCE = 84;

const clampNumber = (min: number, preferred: number, max: number) =>
  Math.min(Math.max(preferred, min), max);

const getIdleTeamLayout = (viewportWidth: number, count: number): TeamCardLayout[] => {
  const vw = viewportWidth / 100;
  const idle: TeamCardLayout[] = [
    { x: clampNumber(-440, -34 * vw, -170), y: 0, fanY: -28, fanZ: -8, scale: 0.9, opacity: 0.5, zIndex: 1 },
    { x: clampNumber(-255, -19 * vw, -95), y: 0, fanY: -17, fanZ: -4, scale: 0.96, opacity: 0.68, zIndex: 2 },
    { x: 0, y: 0, fanY: 0, fanZ: 0, scale: 1, opacity: 1, zIndex: 5 },
    { x: clampNumber(82, 14 * vw, 180), y: 0, fanY: 13, fanZ: 3, scale: 0.98, opacity: 0.76, zIndex: 3 },
    { x: clampNumber(150, 25 * vw, 320), y: 0, fanY: 21, fanZ: 6, scale: 0.94, opacity: 0.62, zIndex: 2 },
    { x: clampNumber(215, 36 * vw, 450), y: 0, fanY: 28, fanZ: 8, scale: 0.9, opacity: 0.5, zIndex: 1 },
  ];

  return idle.slice(0, count);
};

const getSurroundTeamLayout = (
  focusIndex: number,
  count: number,
  stageWidth: number,
  stageHeight: number,
): TeamCardLayout[] => {
  const radiusX = clampNumber(210, stageWidth * 0.34, 300);
  const radiusY = clampNumber(118, stageHeight * 0.26, 168);
  const others = Math.max(count - 1, 1);

  return Array.from({ length: count }, (_, index) => {
    if (index === focusIndex) {
      return {
        x: 0,
        y: 0,
        fanY: 0,
        fanZ: 0,
        scale: 0.9,
        opacity: 1,
        zIndex: 20,
      };
    }

    let order = index - focusIndex;
    if (order < 0) order += count;
    const surroundIndex = order - 1;
    const angle = -Math.PI / 2 + (surroundIndex / others) * Math.PI * 2;
    const x = Math.round(Math.cos(angle) * radiusX);
    const y = Math.round(Math.sin(angle) * radiusY);
    const depth = (y + radiusY) / Math.max(radiusY * 2, 1);

    return {
      x,
      y,
      fanY: Math.round(Math.cos(angle) * 18),
      fanZ: Math.round(Math.sin(angle) * 5),
      scale: 0.56,
      opacity: 0.78,
      zIndex: 4 + Math.round(depth * 8),
    };
  });
};

const ProgramsCarousel3D = () => {
  const { language, t } = useLanguage();
  const [tiltState, setTiltState] = useState<Record<string, { x: number; y: number }>>({});
  const [isMobileCarousel, setIsMobileCarousel] = useState(false);
  const [centeredMember, setCenteredMember] = useState("klest");
  const [activeMember, setActiveMember] = useState<string | null>(null);
  const [openMember, setOpenMember] = useState<string | null>(null);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window === "undefined" ? 1280 : window.innerWidth,
  );
  const [stageSize, setStageSize] = useState({ width: 1100, height: 520 });
  const stageRef = useRef<HTMLDivElement>(null);
  const shellRefs = useRef<Record<string, HTMLElement | null>>({});
  const activeMemberRef = useRef<string | null>(null);
  const isMobileCarouselRef = useRef(false);
  const selectionPointRef = useRef({ x: 0, y: 0 });
  const selectionAtRef = useRef(0);

  // The order is intentional: Laura sits to Guri's left while Klest remains centred.
  const teamMembers: TeamMember[] = [
    {
      id: "laura",
      name: t("laura"),
      role: t("lauraTitleAbout"),
      image: "/team-laura.png",
      bio: t("lauraDescAbout"),
      links: [
        {
          href: "mailto:lauralaiq1@gmail.com",
          label: language === "en" ? "Email Laura" : "Dërgo email Laurës",
        },
      ],
    },
    {
      id: "guri",
      name: t("guri"),
      role: t("guriTitleAbout"),
      image: "/team-guri.jpg",
      bio: t("guriDescAbout"),
      links: [
        {
          href: "mailto:gurigaca12@gmail.com",
          label: language === "en" ? "Email Guri" : "Dërgo email Gurit",
        },
      ],
    },
    {
      id: "klest",
      name: t("klest"),
      role: t("klestTitleAbout"),
      image: "/team-klest.png",
      bio: t("klestDescAbout"),
      links: [
        {
          href: "mailto:klestdrancolli@gmai.com",
          label: language === "en" ? "Email Klest" : "Dërgo email Klestit",
        },
      ],
    },
    {
      id: "erijon",
      name: t("erion"),
      role: t("erionTitleAbout"),
      image: "/team-gashi.jpg",
      bio: t("erionDescAbout"),
      links: [
        {
          href: "mailto:gashierjon31@gmail.com",
          label: language === "en" ? "Email Erijon" : "Dërgo email Erijonit",
        },
      ],
    },
    {
      id: "viola",
      name: "Viola Shala",
      role: language === "en" ? "Artist" : "Artiste",
      image: "/team-viola.png",
      bio:
        language === "en"
          ? "Viola Shala is an Artist at MADVERSE, contributing her creative perspective and artistic work to the organization's cultural projects and initiatives."
          : "Viola Shala është Artiste në MADVERSE, duke kontribuar me perspektivën kreative dhe punën e saj artistike në projektet dhe iniciativat kulturore të organizatës.",
      links: [
        {
          href: "mailto:violaashalaa15@gmail.com",
          label: language === "en" ? "Email Viola" : "Dërgo email Violës",
        },
      ],
    },
    {
      id: "albina",
      name: "Albina Bersha",
      role: language === "en" ? "Artist" : "Artiste",
      image: "/team-albina.png",
      bio:
        language === "en"
          ? "Albina Bersha is an Artist at MADVERSE, contributing her creative perspective and artistic work to the organization's cultural projects and initiatives."
          : "Albina Bersha është Artiste në MADVERSE, duke kontribuar me perspektivën kreative dhe punën e saj artistike në projektet dhe iniciativat kulturore të organizatës.",
      links: [
        {
          href: "mailto:albinaberisha183@gmail.com",
          label: language === "en" ? "Email Albina" : "Dërgo email Albinës",
        },
      ],
    },
  ];

  const spotlightId = !isMobileCarousel ? (openMember ?? activeMember) : null;
  const spotlightIndex = spotlightId
    ? teamMembers.findIndex((member) => member.id === spotlightId)
    : -1;
  const cardLayouts =
    spotlightIndex >= 0
      ? getSurroundTeamLayout(
          spotlightIndex,
          teamMembers.length,
          stageSize.width,
          stageSize.height,
        )
      : getIdleTeamLayout(viewportWidth, teamMembers.length);

  const canSwitchSelection = (clientX: number, clientY: number) => {
    if (!activeMemberRef.current) return true;
    if (Date.now() - selectionAtRef.current < SETTLE_MS) return false;

    const deltaX = clientX - selectionPointRef.current.x;
    const deltaY = clientY - selectionPointRef.current.y;
    return deltaX * deltaX + deltaY * deltaY >= SWITCH_DISTANCE * SWITCH_DISTANCE;
  };

  const activateMember = (
    memberId: string,
    clientX?: number,
    clientY?: number,
    force = false,
  ) => {
    if (isMobileCarouselRef.current || activeMemberRef.current === memberId) return;
    if (
      !force &&
      activeMemberRef.current &&
      (clientX == null || !canSwitchSelection(clientX, clientY))
    ) {
      return;
    }

    activeMemberRef.current = memberId;
    setActiveMember(memberId);
    selectionAtRef.current = Date.now();
    if (clientX != null && clientY != null) {
      selectionPointRef.current = { x: clientX, y: clientY };
    }
  };

  const clearActiveMember = () => {
    activeMemberRef.current = null;
    selectionAtRef.current = 0;
    setActiveMember(null);
  };

  const handleStageMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const hoveredShell = (event.target as HTMLElement | null)?.closest?.(".mad-team-shell");
    const hoveredId = hoveredShell?.getAttribute("data-member-id");
    if (hoveredId) activateMember(hoveredId, event.clientX, event.clientY);
  };

  const handleStageMouseLeave = () => {
    if (isMobileCarouselRef.current) return;
    clearActiveMember();
  };

  const handleMemberEnter = (memberId: string, event: React.MouseEvent<HTMLElement>) => {
    activateMember(memberId, event.clientX, event.clientY);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>, memberId: string) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const horizontal = (event.clientX - rect.left) / rect.width - 0.5;
    const vertical = (event.clientY - rect.top) / rect.height - 0.5;

    setTiltState((previous) => ({
      ...previous,
      [memberId]: {
        x: vertical * -8,
        y: horizontal * 8,
      },
    }));
  };

  const resetTilt = (memberId: string) => {
    setTiltState((previous) => ({
      ...previous,
      [memberId]: { x: 0, y: 0 },
    }));
  };

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 760px)");
    let animationFrame = 0;

    const updateCenteredMember = () => {
      animationFrame = 0;
      const stage = stageRef.current;

      if (!stage || !mobileQuery.matches) {
        return;
      }

      const stageRect = stage.getBoundingClientRect();
      const stageCenter = stageRect.left + stage.clientWidth / 2;
      let closestMember = "laura";
      let closestDistance = Number.POSITIVE_INFINITY;

      Object.entries(shellRefs.current).forEach(([memberId, shell]) => {
        if (!shell) return;
        const shellRect = shell.getBoundingClientRect();
        const distance = Math.abs(shellRect.left + shellRect.width / 2 - stageCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestMember = memberId;
        }
      });

      setCenteredMember(closestMember);
    };

    const requestCenterUpdate = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateCenteredMember);
    };

    const initializeCarousel = () => {
      const isMobile = mobileQuery.matches;
      isMobileCarouselRef.current = isMobile;
      setIsMobileCarousel(isMobile);

      if (!isMobile) {
        setCenteredMember("klest");
        return;
      }

      clearActiveMember();

      window.requestAnimationFrame(() => {
        const stage = stageRef.current;
        if (!stage) return;

        stage.scrollLeft = 0;
        updateCenteredMember();
      });
    };

    const stage = stageRef.current;
    stage?.addEventListener("scroll", requestCenterUpdate, { passive: true });
    window.addEventListener("resize", requestCenterUpdate, { passive: true });
    mobileQuery.addEventListener("change", initializeCarousel);
    initializeCarousel();

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      stage?.removeEventListener("scroll", requestCenterUpdate);
      window.removeEventListener("resize", requestCenterUpdate);
      mobileQuery.removeEventListener("change", initializeCarousel);
    };
  }, []);

  useEffect(() => {
    const updateViewportWidth = () => setViewportWidth(window.innerWidth);
    updateViewportWidth();
    window.addEventListener("resize", updateViewportWidth, { passive: true });
    return () => window.removeEventListener("resize", updateViewportWidth);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver((entries) => {
      const contentRect = entries[0]?.contentRect;
      if (!contentRect) return;
      setStageSize({
        width: contentRect.width,
        height: contentRect.height,
      });
    });

    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const handleCardClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    memberId: string,
  ) => {
    if (!isMobileCarousel || centeredMember === memberId) {
      setOpenMember(memberId);
      return;
    }

    event.preventDefault();
    const stage = stageRef.current;
    const shell = shellRefs.current[memberId];
    if (!stage || !shell) return;

    const targetLeft =
      shell.offsetLeft - (stage.clientWidth - shell.offsetWidth) / 2;
    stage.scrollTo({ left: targetLeft, behavior: "smooth" });
  };

  return (
    <section className="mad-team-section" aria-labelledby="team-heading">
      <style>{`
        .mad-team-section {
          --mad-team-surface: oklch(0.159 0 0);
          --mad-team-fg: oklch(0.985 0 0);
          --mad-team-muted: oklch(0.626 0 0);
          --mad-team-border: oklch(0.235 0 0);
          --mad-team-accent: oklch(0.637 0.237 25.331);
          --mad-team-shadow: oklch(0.04 0 0 / 0.72);
          width: 100%;
          overflow: hidden;
          padding: clamp(48px, 8vw, 104px) clamp(16px, 4vw, 56px);
          background: transparent;
          color: var(--mad-team-fg);
          font-family: "Space Grotesk", "Segoe UI", sans-serif;
          isolation: isolate;
        }

        .mad-team-inner {
          width: min(1240px, 100%);
          margin: 0 auto;
        }

        .mad-team-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          padding-inline: clamp(0px, 2vw, 24px);
        }

        .mad-team-eyebrow {
          margin: 0 0 10px;
          color: var(--mad-team-muted);
          font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .mad-team-heading {
          max-width: 10ch;
          margin: 0;
          color: var(--mad-team-fg);
          font-family: "Space Grotesk", "Avenir Next", "Segoe UI", sans-serif;
          font-size: clamp(36px, 6vw, 68px);
          font-weight: 600;
          letter-spacing: -0.03em;
          line-height: 0.98;
        }

        .mad-team-accent-rule {
          width: 76px;
          height: 4px;
          margin-top: 20px;
          border-radius: 999px;
          background: var(--mad-team-accent);
        }

        @property --x {
          syntax: "<length>";
          inherits: true;
          initial-value: 0px;
        }

        @property --y {
          syntax: "<length>";
          inherits: true;
          initial-value: 0px;
        }

        @property --card-scale {
          syntax: "<number>";
          inherits: true;
          initial-value: 1;
        }

        @property --fan-y {
          syntax: "<angle>";
          inherits: true;
          initial-value: 0deg;
        }

        @property --fan-z {
          syntax: "<angle>";
          inherits: true;
          initial-value: 0deg;
        }

        @property --idle-opacity {
          syntax: "<number>";
          inherits: true;
          initial-value: 1;
        }

        .mad-team-stage {
          position: relative;
          height: clamp(380px, 58vw, 620px);
          margin-top: clamp(22px, 4vw, 52px);
          perspective: 1300px;
        }

        .mad-team-shell {
          --x: 0px;
          --y: 0px;
          --fan-y: 0deg;
          --fan-z: 0deg;
          --card-scale: 1;
          --idle-opacity: 1;
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 2;
          width: clamp(208px, 29vw, 360px);
          aspect-ratio: 0.83;
          opacity: var(--idle-opacity);
          transform:
            translate(-50%, -50%)
            translate3d(var(--x), var(--y), 0);
          transition:
            --x 640ms cubic-bezier(0.22, 1, 0.36, 1),
            --y 640ms cubic-bezier(0.22, 1, 0.36, 1),
            --fan-y 640ms cubic-bezier(0.22, 1, 0.36, 1),
            --fan-z 640ms cubic-bezier(0.22, 1, 0.36, 1),
            --card-scale 640ms cubic-bezier(0.22, 1, 0.36, 1),
            --idle-opacity 320ms ease,
            opacity 320ms ease,
            filter 320ms ease;
        }

        .mad-team-motion {
          width: 100%;
          height: 100%;
          transform:
            rotateY(var(--fan-y))
            rotateZ(var(--fan-z))
            scale(var(--card-scale));
          transform-style: preserve-3d;
          transition: transform 640ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .mad-team-shell:nth-child(1) {
          --x: clamp(-440px, -34vw, -170px);
          --fan-y: -28deg;
          --fan-z: -8deg;
          --card-scale: 0.9;
          --idle-opacity: 0.5;
          z-index: 1;
        }

        .mad-team-shell:nth-child(2) {
          --x: clamp(-255px, -19vw, -95px);
          --fan-y: -17deg;
          --fan-z: -4deg;
          --card-scale: 0.96;
          --idle-opacity: 0.68;
          z-index: 2;
        }

        .mad-team-shell:nth-child(3) {
          z-index: 5;
        }

        .mad-team-shell:nth-child(4) {
          --x: clamp(82px, 14vw, 180px);
          --fan-y: 13deg;
          --fan-z: 3deg;
          --card-scale: 0.98;
          --idle-opacity: 0.76;
          z-index: 3;
        }

        .mad-team-shell:nth-child(5) {
          --x: clamp(150px, 25vw, 320px);
          --fan-y: 21deg;
          --fan-z: 6deg;
          --card-scale: 0.94;
          --idle-opacity: 0.62;
          z-index: 2;
        }

        .mad-team-shell:nth-child(6) {
          --x: clamp(215px, 36vw, 450px);
          --fan-y: 28deg;
          --fan-z: 8deg;
          --card-scale: 0.9;
          --idle-opacity: 0.5;
          z-index: 1;
        }

        .mad-team-shell:hover,
        .mad-team-shell.is-active,
        .mad-team-shell.is-spotlight,
        .mad-team-shell:focus-within {
          z-index: 20;
          opacity: 1;
          filter: saturate(1.04);
        }

        .mad-team-shell:hover .mad-team-motion,
        .mad-team-shell.is-active .mad-team-motion,
        .mad-team-shell:focus-within .mad-team-motion {
          transform:
            translateY(-18px)
            rotateY(0deg)
            rotateZ(0deg)
            scale(1.035);
        }

        .mad-team-stage.is-orbiting .mad-team-shell:hover .mad-team-motion,
        .mad-team-stage.is-orbiting .mad-team-shell.is-active .mad-team-motion,
        .mad-team-stage.is-orbiting .mad-team-shell:focus-within .mad-team-motion,
        .mad-team-stage.is-orbiting .mad-team-shell.is-spotlight .mad-team-motion {
          transform:
            rotateY(var(--fan-y))
            rotateZ(var(--fan-z))
            scale(var(--card-scale));
        }

        .mad-team-stage.is-orbiting .mad-team-shell.is-spotlight {
          z-index: 20;
        }

        .mad-team-stage.is-orbiting .mad-team-shell.is-spotlight .mad-team-card {
          box-shadow:
            0 14px 32px oklch(0.03 0 0 / 0.42),
            0 34px 92px oklch(0.03 0 0 / 0.7);
        }

        .mad-team-stage.is-orbiting .mad-team-shell.is-spotlight .mad-team-portrait {
          filter: brightness(1.06);
          transform: scale(1.045);
        }

        .mad-team-card {
          position: relative;
          display: block;
          width: 100%;
          height: 100%;
          padding: 0;
          overflow: hidden;
          border: 0;
          border-radius: 18px;
          clip-path: inset(0 round 18px);
          isolation: isolate;
          backface-visibility: hidden;
          background: var(--mad-team-surface);
          box-shadow: 0 22px 58px var(--mad-team-shadow);
          color: inherit;
          cursor: pointer;
          text-align: left;
          transform:
            perspective(900px)
            rotateX(var(--tilt-x, 0deg))
            rotateY(var(--tilt-y, 0deg));
          transform-style: preserve-3d;
          transition:
            transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 260ms ease;
        }

        .mad-team-card:hover,
        .mad-team-card:focus-visible {
          box-shadow:
            0 14px 32px oklch(0.03 0 0 / 0.42),
            0 34px 92px oklch(0.03 0 0 / 0.7);
          outline: none;
        }

        .mad-team-card:focus-visible {
          outline: 2px solid var(--mad-team-fg);
          outline-offset: 5px;
        }

        .mad-team-portrait {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transform: scale(1.002);
          transition:
            transform 480ms cubic-bezier(0.22, 1, 0.36, 1),
            filter 300ms ease;
        }

        .mad-team-shell:hover .mad-team-portrait,
        .mad-team-shell:focus-within .mad-team-portrait {
          filter: brightness(1.06);
          transform: scale(1.045);
        }

        .mad-team-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: clamp(16px, 2.3vw, 26px);
          background: linear-gradient(
            to top,
            oklch(0.035 0 0 / 0.96) 0%,
            oklch(0.035 0 0 / 0.58) 35%,
            transparent 68%
          );
          pointer-events: none;
          transform: translateZ(30px);
        }

        .mad-team-tag {
          position: absolute;
          top: clamp(14px, 2vw, 22px);
          right: clamp(14px, 2vw, 22px);
          padding: 7px 11px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 999px;
          background: rgba(24, 24, 24, 0.68);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.32);
          backdrop-filter: blur(12px);
          color: var(--mad-team-fg);
          font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transform: translateZ(32px);
        }

        .mad-team-name {
          margin: 0 0 7px;
          color: var(--mad-team-fg);
          font-size: clamp(20px, 2.2vw, 28px);
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1.05;
        }

        .mad-team-role {
          max-width: 27ch;
          margin: 0;
          color: rgba(255, 255, 255, 0.78);
          font-size: clamp(12px, 1.3vw, 14px);
          font-weight: 500;
          letter-spacing: 0.01em;
          line-height: 1.45;
        }

        @media (max-width: 760px) {
          .mad-team-section {
            padding-top: 46px;
          }

          .mad-team-stage {
            --mobile-card-width: min(76vw, 300px);
            display: flex;
            width: 100vw;
            height: auto;
            gap: 18px;
            margin-top: 26px;
            margin-left: calc(50% - 50vw);
            padding: 20px calc((100vw - var(--mobile-card-width)) / 2) 34px;
            overflow-x: auto;
            overflow-y: visible;
            perspective: none;
            scroll-snap-type: x mandatory;
            scroll-padding-inline: calc((100vw - var(--mobile-card-width)) / 2);
            overscroll-behavior-x: contain;
            touch-action: pan-x;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
          }

          .mad-team-stage::-webkit-scrollbar {
            display: none;
          }

          .mad-team-shell {
            --x: 0px;
            --y: 0px;
            --fan-y: 0deg;
            --fan-z: 0deg;
            --card-scale: 1;
            --idle-opacity: 1;
            position: relative;
            top: auto;
            left: auto;
            width: var(--mobile-card-width);
            flex: 0 0 var(--mobile-card-width);
            z-index: 1;
            opacity: 1;
            filter: none;
            transform: none;
            scroll-snap-align: center;
            scroll-snap-stop: always;
            transition:
              opacity 280ms ease,
              filter 280ms ease;
          }

          .mad-team-motion {
            transform: scale(1);
            transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
          }

          .mad-team-shell:nth-child(1),
          .mad-team-shell:nth-child(2),
          .mad-team-shell:nth-child(3),
          .mad-team-shell:nth-child(4),
          .mad-team-shell:nth-child(5),
          .mad-team-shell:nth-child(6) {
            z-index: 1;
            margin: 0;
            opacity: 1;
          }

          .mad-team-shell:hover,
          .mad-team-shell.is-active,
          .mad-team-shell:focus-within {
            z-index: 1;
            opacity: 1;
            filter: none;
          }

          .mad-team-shell:hover .mad-team-motion,
          .mad-team-shell.is-active .mad-team-motion,
          .mad-team-shell:focus-within .mad-team-motion {
            transform: scale(1);
          }

          .mad-team-shell.is-centered,
          .mad-team-shell.is-centered:hover,
          .mad-team-shell.is-centered.is-active,
          .mad-team-shell.is-centered:focus-within {
            z-index: 1;
            opacity: 1;
            filter: none;
          }

          .mad-team-shell.is-centered .mad-team-motion,
          .mad-team-shell.is-centered:hover .mad-team-motion,
          .mad-team-shell.is-centered.is-active .mad-team-motion,
          .mad-team-shell.is-centered:focus-within .mad-team-motion {
            transform: scale(1);
          }

          .mad-team-shell:not(.is-centered):hover .mad-team-card,
          .mad-team-shell:not(.is-centered):focus-within .mad-team-card {
            box-shadow: 0 22px 58px var(--mad-team-shadow);
          }

          .mad-team-shell:not(.is-centered):hover .mad-team-portrait,
          .mad-team-shell:not(.is-centered):focus-within .mad-team-portrait {
            filter: none;
            transform: scale(1.002);
          }

          .mad-team-shell.is-centered .mad-team-card {
            box-shadow: 0 22px 58px var(--mad-team-shadow);
          }

          .mad-team-shell.is-centered .mad-team-portrait {
            filter: none;
            transform: scale(1.002);
          }

          .mad-team-name {
            font-size: 19px;
          }

          .mad-team-role {
            font-size: 11px;
          }
        }

        @media (max-width: 410px) {
          .mad-team-heading {
            font-size: 34px;
          }

          .mad-team-stage {
            --mobile-card-width: 78vw;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .mad-team-section *,
          .mad-team-section *::before,
          .mad-team-section *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="mad-team-inner">
        <header className="mad-team-header">
          <div>
            <p className="mad-team-eyebrow">
              {language === "en" ? "MADVERSE / People" : "MADVERSE / Njerëzit"}
            </p>
            <h2 id="team-heading" className="mad-team-heading">
              {language === "en" ? "Our Team" : "Ekipi ynë"}
            </h2>
            <div className="mad-team-accent-rule" aria-hidden="true" />
          </div>
        </header>

        <div
          ref={stageRef}
          className={`mad-team-stage ${spotlightId ? "is-orbiting" : ""}`}
          onMouseMove={handleStageMouseMove}
          onMouseLeave={handleStageMouseLeave}
        >
          {teamMembers.map((member, index) => {
            const layout = cardLayouts[index] ?? cardLayouts[0];

            return (
            <article
              ref={(element) => {
                shellRefs.current[member.id] = element;
              }}
              data-member-id={member.id}
              className={`mad-team-shell ${
                isMobileCarousel && centeredMember === member.id ? "is-centered" : ""
              } ${!isMobileCarousel && activeMember === member.id ? "is-active" : ""} ${
                spotlightId === member.id ? "is-spotlight" : ""
              }`}
              aria-current={
                isMobileCarousel && centeredMember === member.id ? "true" : undefined
              }
              onMouseEnter={(event) => handleMemberEnter(member.id, event)}
              onMouseLeave={() => {
                resetTilt(member.id);
              }}
              key={member.id}
              style={
                {
                  "--x": `${layout.x}px`,
                  "--y": `${layout.y}px`,
                  "--fan-y": `${layout.fanY}deg`,
                  "--fan-z": `${layout.fanZ}deg`,
                  "--card-scale": String(layout.scale),
                  "--idle-opacity": String(layout.opacity),
                  zIndex: layout.zIndex,
                } as React.CSSProperties
              }
            >
              <Dialog
                open={openMember === member.id}
                onOpenChange={(open) => setOpenMember(open ? member.id : null)}
              >
                <div className="mad-team-motion">
                  <button
                    type="button"
                    className="mad-team-card"
                    aria-haspopup="dialog"
                    aria-label={
                      language === "en"
                        ? `Open ${member.name}'s biography`
                        : `Hap biografinë e ${member.name}`
                    }
                    onMouseMove={(event) => handleMouseMove(event, member.id)}
                    onMouseLeave={() => resetTilt(member.id)}
                    onFocus={() => {
                      if (!isMobileCarouselRef.current) activateMember(member.id, undefined, undefined, true);
                    }}
                    onClick={(event) => handleCardClick(event, member.id)}
                    style={
                      {
                        "--tilt-x": `${tiltState[member.id]?.x || 0}deg`,
                        "--tilt-y": `${tiltState[member.id]?.y || 0}deg`,
                      } as React.CSSProperties
                    }
                  >
                    <img
                      src={member.image}
                      alt=""
                      className="mad-team-portrait"
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                    <span className="mad-team-tag">
                      {language === "en" ? "Team" : "Ekipa"}
                    </span>
                    <span className="mad-team-overlay">
                      <span className="mad-team-name">{member.name}</span>
                      <span className="mad-team-role">{member.role}</span>
                    </span>
                  </button>
                </div>

                <DialogContent className="max-h-[calc(100svh_-_1.75rem)] w-[calc(100%_-_1.75rem)] max-w-[880px] gap-0 overflow-y-auto border-white/15 bg-[#242424] p-0 text-white shadow-[0_40px_120px_rgba(0,0,0,0.82)] sm:rounded-3xl">
                  <div className="grid min-h-0 md:min-h-[540px] md:grid-cols-[minmax(260px,0.86fr)_minmax(320px,1.14fr)]">
                    <div className="relative min-h-[250px] overflow-hidden bg-black sm:min-h-[320px] md:min-h-full">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="absolute inset-0 h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="flex flex-col justify-center px-6 py-9 sm:px-10 md:px-14">
                      <DialogHeader>
                        <span className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.08em] text-white/55">
                          {language === "en" ? "Team biography" : "Biografia e ekipit"}
                        </span>
                        <DialogTitle className="text-[clamp(2.125rem,5vw,3.25rem)] font-semibold leading-none tracking-[-0.03em] text-white">
                          {member.name}
                        </DialogTitle>
                        <DialogDescription className="pt-3 text-[15px] font-semibold leading-relaxed text-white">
                          {member.role}
                        </DialogDescription>
                      </DialogHeader>

                      <p className="mt-7 border-t border-white/10 pt-6 text-[15px] leading-[1.65] text-white/75">
                        {member.bio}
                      </p>

                      <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                        {member.links.map((link) => (
                          <a
                            key={`${member.id}-${link.href}`}
                            href={link.href}
                            target={link.href.startsWith("http") ? "_blank" : undefined}
                            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/20 bg-transparent px-[18px] text-[13px] font-semibold tracking-[0.02em] text-white transition hover:border-white/40 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                          >
                            <Mail aria-hidden="true" className="h-4 w-4" />
                            {link.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProgramsCarousel3D;
