import { useState } from "react";

function Faq() {
  const [activeQ, setActiveQ] = useState("q1");

  const openQ = (id) => {
    setActiveQ(activeQ === id ? "" : id);
  };

  const getClassAnswer = (id) => {
    return activeQ === id ? "active-answer" : "";
  };

  const getClassQuestion = (id) => {
    return activeQ === id ? "active-question" : "";
  };

  return (
    <>
      <section className="faq-section">
        <div className="container">
          <div className="faq-content">
            <div className="faq-content__title">
              <h5>FAQ</h5>
              <h2>Foire aux questions</h2>
              <p>
                Foire aux questions sur le processus de réservation de location de voiture
                sur notre site Web : Réponses aux questions et préoccupations courantes.
              </p>
            </div>

            <div className="all-questions">
              <div className="faq-box">
                <div
                  id="q1"
                  onClick={() => openQ("q1")}
                  className={`faq-box__question  ${getClassQuestion("q1")}`}
                >
                  <p>1. Qu'y a-t-il de particulier à comparer les offres de location de voitures ?</p>
                  <i className="fa-solid fa-angle-down"></i>
                </div>
                <div
                  id="q1"
                  onClick={() => openQ("q1")}
                  className={`faq-box__answer ${getClassAnswer("q1")}`}
                >
                  Comparer les offres de location de voitures est important car cela permet de trouver la
                  meilleure offre adaptée à votre budget et à vos besoins, vous assurant ainsi
                  d'en avoir pour votre argent. En comparant différentes
                  options, vous pouvez trouver des offres proposant des prix plus bas,
                  des services supplémentaires ou de meilleurs modèles de voitures. Vous pouvez trouver des offres de location de voitures en effectuant des recherches en ligne et en comparant les prix de différentes agences de location.
                </div>
              </div>
              <div className="faq-box">
                <div
                  id="q2"
                  onClick={() => openQ("q2")}
                  className={`faq-box__question ${getClassQuestion("q2")}`}
                >
                  <p>2. Comment trouver les meilleures offres de location de voitures ?</p>
                  <i className="fa-solid fa-angle-down"></i>
                </div>
                <div
                  id="q2"
                  onClick={() => openQ("q2")}
                  className={`faq-box__answer ${getClassAnswer("q2")}`}
                >
                  Vous pouvez trouver des offres de location de voiture en effectuant des recherches en ligne et
                  en comparant les prix de différentes agences de location. Des sites web
                  tels qu'Expedia, Kayak et Travelocity vous permettent de comparer
                  les prix et de consulter les options de location disponibles. Il est également
                  recommandé de s'inscrire aux newsletters par e-mail et de suivre les agences de location de voitures sur les réseaux sociaux pour être informé(e) des offres spéciales
                  et des promotions.
                </div>
              </div>
              <div className="faq-box">
                <div
                  id="q3"
                  onClick={() => openQ("q3")}
                  className={`faq-box__question ${getClassQuestion("q3")}`}
                >
                  <p>3. How do I find such low rental car prices?</p>
                  <i className="fa-solid fa-angle-down"></i>
                </div>
                <div
                  id="q3"
                  onClick={() => openQ("q3")}
                  className={`faq-box__answer ${getClassAnswer("q3")}`}
                >
                  Réservez à l'avance : Réserver votre voiture de location à l'avance permet
                  souvent de bénéficier de prix plus bas. Comparez les prix de plusieurs
                  compagnies : Utilisez des sites web comme Kayak, Expedia ou Travelocity pour
                  comparer les prix de plusieurs loueurs de voitures. Recherchez
                  des codes de réduction et des coupons : Recherchez des codes de réduction et des
                  coupons que vous pouvez utiliser pour réduire le prix de la location. Louer
                  hors aéroport peut parfois permettre de bénéficier de prix plus bas.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Faq;
