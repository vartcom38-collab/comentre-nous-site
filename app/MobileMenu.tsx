'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const links = [
  ['Com’ en famille', '/com-en-famille'],
  ['Com’ des entrepreneuses', '/com-des-entrepreneuses'],
  ['La papeterie', '/papeterie-du-lien'],
  ['Le podcast', '/podcast'],
  ['Les petits cadeaux', '/les-petits-cadeaux'],
  ['À propos', '/a-propos'],
  ['Boutique', '/boutique'],
] as const;

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, []);

  return (
    <>
      <header className="mobile-global-header">
        <Link href="/" className="mobile-global-logo" aria-label="Accueil Com’ entre nous" onClick={() => setOpen(false)}>
          <img src="/logo-comentre-nous.svg?v=transparent-final-20260907" alt="Com’ entre nous" />
        </Link>

        <div className="mobile-global-actions">
          <Link href="/boutique" className="mobile-cart-link" aria-label="Boutique">♡</Link>
          <button
            type="button"
            className={`mobile-menu-button ${open ? 'is-open' : ''}`}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-global-menu"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`mobile-menu-panel ${open ? 'is-open' : ''}`} id="mobile-global-menu">
        <div className="mobile-menu-inner">
          <p className="mobile-menu-kicker">Explorer</p>
          <nav aria-label="Navigation mobile">
            {links.map(([label, href], index) => (
              <Link href={href} key={href} onClick={() => setOpen(false)}>
                <span>{label}</span>
                <b>{String(index + 1).padStart(2, '0')}</b>
              </Link>
            ))}
          </nav>
          <div className="mobile-menu-bottom">
            <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
            <Link href="/faq" onClick={() => setOpen(false)}>FAQ</Link>
          </div>
        </div>
      </div>
      {open ? <button className="mobile-menu-backdrop" aria-label="Fermer le menu" onClick={() => setOpen(false)} /> : null}
    </>
  );
}
