function Footer() {
  return (
    <>
      <footer>
        <div className="container">
          <div className="footer-content">
            <ul className="footer-content__1">
              <li>
                <span>CAR & Moto</span> Rental
              </li>
              <li>
                Nous proposons une large gamme de véhicules pour répondre à tous vos besoins de conduite.
                Nous avons la voiture idéale pour vous.
              </li>
              <li>
                <a href="tel:123456789">
                  <i className="fa-solid fa-phone"></i> &nbsp; (212) -456-789
                </a>
              </li>

              <li>
                <a
                  href="mailto: 
                carmotorental@gmail.com"
                >
                  <i className="fa-solid fa-envelope"></i>
                  &nbsp;  carmotorental@gmail.com
                </a>
              </li>
            </ul>

            <ul className="footer-content__2">
              <li>Entreprise</li>
              <li>
                <a href="#home">Galerie</a>
              </li>
              <li>
                <a href="#home">Careers</a>
              </li>
              <li>
                <a href="#home">Mobile</a>
              </li>
              <li>
                <a href="#home">Blog</a>
              </li>
              <li>
                <a href="#home">Notre façon de travailler</a>
              </li>
            </ul>

            <ul className="footer-content__2">
              <li>Heures de travail</li>
              <li>Lundi - vendredi: 9:00AM - 9:00PM</li>
              <li>Samedi: 9:00AM - 19:00PM</li>
              <li>dimanche: Closed</li>
            </ul>

            <ul className="footer-content__2">
              <li>Abonnement</li>
              <li>
                <p>Inscrivez votre adresse e-mail pour recevoir les dernières nouvelles et mises à jour.</p>
              </li>
              <li>
                <input type="email" placeholder="Enter Email Address"></input>
              </li>
              <li>
                <button className="submit-email">Soumettre</button>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
