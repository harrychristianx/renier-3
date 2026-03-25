import { Link, NavLink } from "react-router-dom";

export function Header() {
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link className="brand" to="/">
          <span className="brand-mark">RR</span>
          <span className="brand-copy">
            <span className="brand-kicker">Renier's</span>
            <strong>Real Estate</strong>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
            Home
          </NavLink>
          <NavLink to="/properties" className={({ isActive }) => (isActive ? "active" : "")}>
            Properties
          </NavLink>
          <a href="/#services">Services</a>
          <a href="/#about">About</a>
          <a href="/#join">Join Us</a>
          <a href="/#news">News</a>
          <a href="/#contact">Contact</a>
        </nav>

        <Link className="cta-btn" to="/properties?intent=viewing">
          Book a Viewing
        </Link>
      </div>
    </header>
  );
}
