import { Link } from "react-router-dom";
import "@styles/Hero.css";

export default function Hero() {
  return (
    <section className="hero" role="banner" aria-labelledby="hero-heading">
      <div className="hero__overlay">
        <div className="hero__text">
          <span className="hero__eyebrow">Axepress Hub</span>
          <h1 id="hero-heading" className="hero__headline">
            Campus updates at a glance.
          </h1>
          <h2 className="hero__description">
            All the Notices & Events on this website are only examples.
          </h2>
        </div>
      </div>
    </section>
  );
}
