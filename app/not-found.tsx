import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="blueprint flex min-h-[80vh] items-end bg-ink pb-20 pt-40 text-white">
      <div className="container-x">
        <p className="label text-blue-bright">404 · Out of tolerance</p>
        <h1 className="display mt-4 text-[clamp(2.6rem,8vw,6rem)]">This page isn&apos;t on the drawing.</h1>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/">Back to home</Button>
          <Button href="/capability-finder" variant="ghost-light">
            Ask the Capability Finder
          </Button>
        </div>
      </div>
    </section>
  );
}
