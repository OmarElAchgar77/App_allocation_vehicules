import { Link } from "react-router-dom";

function HeroPages({ name, child=<></> }) {
  return (
    <>
      <section className="hero-pages">
        <div className="hero-pages__overlay"></div>
        <div className="container">
          <div className="hero-pages__text">
            <h3>{name}</h3>
            <p>
              <Link to="/">Home</Link> / {name}
            </p>
            {child}
          </div>
        </div>
      </section>
    </>
  );
}

export default HeroPages;
