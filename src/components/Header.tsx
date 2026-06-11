import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-navy/10 bg-paper/90 backdrop-blur">
      <div className="container-rk flex h-14 items-center justify-between">
        <Link href="/" className="font-display text-lg font-bold tracking-wide text-navy">
          Rescue<span className="text-teal-dark">Kits</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-ink/80">
          <Link href="/kits" className="hover:text-navy">Kits</Link>
          <Link href="/bundle" className="hover:text-navy">Bundle</Link>
          <Link href="/#faq" className="hidden hover:text-navy sm:block">FAQ</Link>
          <Link href="/access" className="btn-ghost !px-3 !py-1.5 text-xs">
            Access my kits
          </Link>
        </nav>
      </div>
    </header>
  );
}
