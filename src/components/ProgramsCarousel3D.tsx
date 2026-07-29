import { useState } from "react";
import { ArrowUpRight, Instagram, Mail } from "lucide-react";
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

  const teamMembers: TeamMember[] = [
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
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    setTiltState((previous) => ({
      ...previous,
      [memberId]: { x: y * -7, y: x * 7 },
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
    <section className="w-full py-12 md:py-20" aria-labelledby="team-heading">
      <style>{`
        .team-wrapper {
          width: min(1200px, 100%);
          margin: 0 auto;
          padding: 0 16px;
        }

        .team-header {
          margin-bottom: 32px;
        }

        .team-header h2 {
          margin: 0 0 12px;
          color: #fff;
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .team-divider {
          width: 72px;
          height: 4px;
          border-radius: 999px;
          background: #ef4444;
        }

        .team-track {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: min(82vw, 310px);
          gap: 18px;
          overflow-x: auto;
          padding: 20px 2px 30px;
          scroll-snap-type: x mandatory;
          scrollbar-width: thin;
          scrollbar-color: rgba(239, 68, 68, 0.8) rgba(255, 255, 255, 0.08);
        }

        .team-dialog-trigger {
          position: relative;
          width: 100%;
          height: 390px;
          padding: 0;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 20px;
          background: #111;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.38);
          cursor: pointer;
          scroll-snap-align: center;
          text-align: left;
          transform:
            perspective(1000px)
            rotateX(var(--tilt-x, 0deg))
            rotateY(var(--tilt-y, 0deg));
          transition:
            transform 220ms ease,
            border-color 220ms ease,
            box-shadow 220ms ease;
        }

        .team-dialog-trigger:hover,
        .team-dialog-trigger:focus-visible {
          border-color: rgba(239, 68, 68, 0.8);
          box-shadow: 0 28px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(239, 68, 68, 0.22);
          transform:
            perspective(1000px)
            rotateX(var(--tilt-x, 0deg))
            rotateY(var(--tilt-y, 0deg))
            translateY(-7px)
            scale(1.015);
          outline: none;
        }

        .team-card-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .team-dialog-trigger:hover .team-card-image,
        .team-dialog-trigger:focus-visible .team-card-image {
          transform: scale(1.035);
        }

        .team-card-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 22px;
          color: white;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.96) 0%, rgba(0, 0, 0, 0.48) 42%, transparent 70%);
        }

        .team-card-name {
          margin: 0 0 7px;
          font-size: 1.35rem;
          font-weight: 800;
          line-height: 1.1;
        }

        .team-card-role {
          max-width: 90%;
          margin: 0;
          color: rgba(255, 255, 255, 0.78);
          font-size: 0.82rem;
          font-weight: 600;
          line-height: 1.4;
        }

        .team-card-hint {
          position: absolute;
          top: 16px;
          right: 16px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 10px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 999px;
          color: white;
          background: rgba(0, 0, 0, 0.52);
          backdrop-filter: blur(10px);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        @media (min-width: 768px) {
          .team-wrapper {
            padding: 0 40px;
          }

          .team-header {
            margin-bottom: 46px;
          }

          .team-track {
            grid-auto-flow: initial;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 24px;
            overflow: visible;
            padding: 18px 0 28px;
          }

          .team-dialog-trigger {
            height: 430px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .team-dialog-trigger,
          .team-card-image {
            transition: none;
          }
        }
      `}</style>

      <div className="team-wrapper">
        <div className="team-header">
          <h2 id="team-heading">{language === "en" ? "Our Team" : "Ekipi ynë"}</h2>
          <div className="team-divider" />
        </div>

        <div className="team-track">
          {teamMembers.map((member) => (
            <Dialog key={member.id}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="team-dialog-trigger"
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
                    className="team-card-image"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="team-card-hint">
                    {language === "en" ? "View bio" : "Shiko bio"}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="team-card-overlay">
                    <span className="team-card-name">{member.name}</span>
                    <span className="team-card-role">{member.role}</span>
                  </span>
                </button>
              </DialogTrigger>

              <DialogContent className="max-h-[92vh] w-[calc(100%_-_1.5rem)] max-w-4xl gap-0 overflow-y-auto border-white/15 bg-[#0b0b0d] p-0 text-white shadow-2xl sm:rounded-3xl">
                <div className="grid min-h-0 md:grid-cols-[0.88fr_1.12fr]">
                  <div className="relative min-h-64 overflow-hidden bg-black md:min-h-[560px]">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/15" />
                  </div>

                  <div className="flex flex-col justify-center px-6 py-9 sm:px-10 md:px-12">
                    <DialogHeader>
                      <span className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-red-400">
                        {language === "en" ? "Team biography" : "Biografia e ekipit"}
                      </span>
                      <DialogTitle className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                        {member.name}
                      </DialogTitle>
                      <DialogDescription className="pt-2 text-sm font-semibold leading-relaxed text-red-300 sm:text-base">
                        {member.role}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="my-7 h-px w-full bg-white/10" />

                    <p className="text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
                      {member.bio}
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      {member.links.map((link) => (
                        <a
                          key={`${member.id}-${link.href}`}
                          href={link.href}
                          target={link.href.startsWith("http") ? "_blank" : undefined}
                          rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-5 py-3 text-sm font-bold text-white transition hover:border-red-400/70 hover:bg-red-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsCarousel3D;
