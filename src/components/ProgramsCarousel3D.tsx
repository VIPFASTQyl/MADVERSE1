import { useState } from "react";
import { Instagram, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TeamLink {
  href: string;
  label: string;
  icon: "mail" | "instagram";
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  links: TeamLink[];
}

const ProgramsCarousel3D = () => {
  const { language, t } = useLanguage();
  const [tiltState, setTiltState] = useState<Record<string, { x: number; y: number }>>({});

  // The order is intentional: the supplied design features Klest in the centre.
  const teamMembers: TeamMember[] = [
    {
      id: "guri",
      name: t("guri"),
      role: t("guriTitleAbout"),
      image: "/team-guri.jpg",
      bio: t("guriDescAbout"),
      links: [
        {
          href: "mailto:gurigaca13@gmail.com",
          label: language === "en" ? "Email Guri" : "Dërgo email Gurit",
          icon: "mail",
        },
        {
          href: "https://www.instagram.com/madverse.ks/",
          label: "MADVERSE Instagram",
          icon: "instagram",
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
          href: "mailto:klestdrancolli@gmail.com",
          label: language === "en" ? "Email Klest" : "Dërgo email Klestit",
          icon: "mail",
        },
        {
          href: "https://www.instagram.com/madverse.ks/",
          label: "MADVERSE Instagram",
          icon: "instagram",
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
          href: "mailto:erijonGashi@gmail.com",
          label: language === "en" ? "Email Erijon" : "Dërgo email Erijonit",
          icon: "mail",
        },
        {
          href: "https://www.instagram.com/madverse.ks/",
          label: "MADVERSE Instagram",
          icon: "instagram",
        },
      ],
    },
  ];

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

  const renderLinkIcon = (icon: TeamLink["icon"]) =>
    icon === "mail" ? <Mail aria-hidden="true" /> : <Instagram aria-hidden="true" />;

  return (
    <section className="mad-team-section" aria-labelledby="team-heading">
      <style>{`
        .mad-team-section {
          --mad-team-bg: oklch(0.115 0 0);
          --mad-team-surface: oklch(0.159 0 0);
          --mad-team-fg: oklch(0.985 0 0);
          --mad-team-muted: oklch(0.626 0 0);
          --mad-team-border: oklch(0.235 0 0);
          --mad-team-accent: oklch(0.637 0.237 25.331);
          --mad-team-shadow: oklch(0.04 0 0 / 0.72);
          width: 100%;
          overflow: hidden;
          padding: clamp(48px, 8vw, 104px) clamp(16px, 4vw, 56px);
          background: var(--mad-team-bg);
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

        .mad-team-stage {
          position: relative;
          height: clamp(340px, 56vw, 570px);
          margin-top: clamp(22px, 4vw, 52px);
          perspective: 1300px;
          transform-style: preserve-3d;
        }

        .mad-team-shell {
          --x: 0px;
          --fan-y: 0deg;
          --fan-z: 0deg;
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
            translateX(var(--x))
            rotateY(var(--fan-y))
            rotateZ(var(--fan-z));
          transform-style: preserve-3d;
          transition:
            transform 560ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity 300ms ease,
            filter 300ms ease;
        }

        .mad-team-shell:nth-child(1) {
          --x: clamp(-330px, -24vw, -64px);
          --fan-y: -24deg;
          --fan-z: -7deg;
          --idle-opacity: 0.58;
          z-index: 1;
        }

        .mad-team-shell:nth-child(2) {
          z-index: 4;
        }

        .mad-team-shell:nth-child(3) {
          --x: clamp(64px, 24vw, 330px);
          --fan-y: 24deg;
          --fan-z: 7deg;
          --idle-opacity: 0.58;
          z-index: 1;
        }

        .mad-team-shell:hover,
        .mad-team-shell:focus-within {
          z-index: 20;
          opacity: 1;
          filter: saturate(1.04);
          transform:
            translate(-50%, -50%)
            translateX(var(--x))
            translateY(-18px)
            rotateY(0deg)
            rotateZ(0deg)
            scale(1.035);
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
            height: clamp(330px, 108vw, 460px);
            margin-inline: -4px;
          }

          .mad-team-shell {
            width: clamp(208px, 57vw, 238px);
          }

          .mad-team-shell:nth-child(1) {
            --x: clamp(-132px, -19vw, -64px);
            --fan-y: -19deg;
            --fan-z: -6deg;
          }

          .mad-team-shell:nth-child(3) {
            --x: clamp(64px, 19vw, 132px);
            --fan-y: 19deg;
            --fan-z: 6deg;
          }

          .mad-team-shell:hover,
          .mad-team-shell:focus-within {
            transform:
              translate(-50%, -50%)
              translateX(var(--x))
              translateY(-10px)
              rotateY(0deg)
              rotateZ(0deg)
              scale(1.02);
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

          .mad-team-shell {
            width: 208px;
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

        <div className="mad-team-stage">
          {teamMembers.map((member) => (
            <article className="mad-team-shell" key={member.id}>
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="mad-team-card"
                    aria-label={
                      language === "en"
                        ? `Open ${member.name}'s biography`
                        : `Hap biografinë e ${member.name}`
                    }
                    onMouseMove={(event) => handleMouseMove(event, member.id)}
                    onMouseLeave={() => resetTilt(member.id)}
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
                </DialogTrigger>

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
                            <span className="[&>svg]:h-4 [&>svg]:w-4">
                              {renderLinkIcon(link.icon)}
                            </span>
                            {link.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsCarousel3D;
