import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { company } from "@/data/company";
import { markets } from "@/data/markets";
import { services } from "@/data/services";
import { materials } from "@/data/materials";
import { ArrowRight } from "@/components/ui/Icons";

export function Footer() {
  return (
    <footer className="brushed relative bg-ink text-white">
      <div className="container-x">
        <div className="grid gap-12 border-b border-white/10 py-16 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-6 max-w-sm leading-relaxed text-white/65">
              Precision metal fabrication and forming for OEMs. Tube bending, sheet metal, welding, hardware and assembly, from prototype to production.
            </p>
            <address className="mt-8 space-y-1 not-italic text-white/80">
              <p>{company.legalName}</p>
              <p>{company.address.street}</p>
              <p>
                {company.address.city}, {company.address.region} {company.address.postal}
              </p>
            </address>
            <div className="mt-6 space-y-1">
              <a href={company.phoneHref} className="block text-white hover:text-blue-bright">
                <span className="label mr-3 text-gray">T</span>
                {company.phone}
              </a>
              <a href={`mailto:${company.email}`} className="block text-white hover:text-blue-bright">
                <span className="label mr-3 text-gray">E</span>
                {company.email}
              </a>
              <p className="text-white/60">
                <span className="label mr-3 text-gray">F</span>
                {company.fax}
              </p>
            </div>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-8">
            <div>
              <p className="label text-blue-bright">Capabilities</p>
              <ul className="mt-4 space-y-2.5">
                {services.map((s) => (
                  <li key={s.id}>
                    <Link href={`/capabilities/${s.id}`} className="text-[0.95rem] text-white/70 hover:text-white">
                      {s.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/capability-finder" className="text-[0.95rem] text-white/70 hover:text-white">
                    Capability Finder
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="label text-blue-bright">Markets</p>
              <ul className="mt-4 space-y-2.5">
                {markets.map((m) => (
                  <li key={m.id}>
                    <Link href={`/markets/${m.id}`} className="text-[0.95rem] text-white/70 hover:text-white">
                      {m.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label text-blue-bright">Materials</p>
              <ul className="mt-4 space-y-2.5">
                {materials.map((m) => (
                  <li key={m.id}>
                    <Link href={`/materials/${m.id}`} className="text-[0.95rem] text-white/70 hover:text-white">
                      {m.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label text-blue-bright">Company</p>
              <ul className="mt-4 space-y-2.5">
                {[
                  ["About", "/about"],
                  ["Why Right", "/about#why-right"],
                  ["Finishing with APC", "/capabilities/finishing"],
                  ["Resources & FAQs", "/resources"],
                  ["Start a project", "/start-a-project"],
                ].map(([l, h]) => (
                  <li key={h}>
                    <Link href={h} className="text-[0.95rem] text-white/70 hover:text-white">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="label text-[0.68rem] text-white/45">
            © {new Date().getFullYear()} Right Manufacturing LLC · San Diego, California · Est. 1990s
          </p>
          <Link href="/start-a-project" className="label inline-flex items-center gap-2 text-white hover:text-blue-bright">
            Have a drawing? Start a project <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
