import Footer from "../components/Footer";
import HeroPages from "../components/HeroPages";

function Contact() {
  return (
    <>
      <section className="contact-page">
        <HeroPages name="Contact" />
        <div className="container">
          <div className="contact-div">
            <div className="contact-div__text">
              <h2>Besoin d'informations supplémentaires ?</h2>
              <p>
                Professionnel polyvalent possédant des compétences dans de multiples domaines, notamment la recherche, le développement et la formation. Plus de 15 ans d'expérience.
              </p>
              <a href="/">
                <i className="fa-solid fa-phone"></i>&nbsp; (212) 456-7869
              </a>
              <a href="/">
                <i className="fa-solid fa-envelope"></i>&nbsp;
                carmotorental@xyz.com
              </a>
            </div>
            <div className="contact-div__form">
              <form>
                <label>
                  Nom et Prenom <b>*</b>
                </label>
                <input type="text" placeholder='E.g: "Sofyane Bentaleb"'></input>

                <label>
                  Email <b>*</b>
                </label>
                <input type="email" placeholder="youremail@example.com"></input>

                <label>
                  Parlez-nous-en <b>*</b>
                </label>
                <textarea placeholder="Écrivez ici.."></textarea>

                <button type="submit">
                  <i className="fa-solid fa-envelope-open-text"></i>&nbsp; Envoyer Message
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="book-banner">
          <div className="book-banner__overlay"></div>
          <div className="container">
            <div className="text-content">
              <h2>Réservez une voiture en nous contactant.</h2>
              <span>
                <i className="fa-solid fa-phone"></i>
                <h3>(212) 456-7869</h3>
              </span>
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </>
  );
}

export default Contact;
