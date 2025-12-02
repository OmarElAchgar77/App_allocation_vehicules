import SelectCar from "../images/plan/icon1.png";
import Contact from "../images/plan/icon2.png";
import Drive from "../images/plan/icon3.png";

function PlanTrip() {
  return (
    <>
      <section className="plan-section">
        <div className="container">
          <div className="plan-container">
            <div className="plan-container__title">
              <h3>Planifiez votre voyage dès maintenant</h3>
              <h2>Location de voiture rapide et facile</h2>
            </div>

            <div className="plan-container__boxes">
              <div className="plan-container__boxes__box">
                <img src={SelectCar} alt="icon_img" />
                <h3>Sélectionner une voiture</h3>
                <p>
                  Nous proposons une large gamme de véhicules pour répondre à tous vos besoins.
                  Nous avons la voiture idéale pour vous.
                </p>
              </div>

              <div className="plan-container__boxes__box">
                <img src={Contact} alt="icon_img" />
                <h3>Contacter l'opérateur</h3>
                <p>
                  Nos opérateurs compétents et aimables sont toujours prêts à
                  répondre à vos questions et préoccupations.
                </p>
              </div>

              <div className="plan-container__boxes__box">
                <img src={Drive} alt="icon_img" />
                <h3>Allons faire un tour en voiture</h3>
                <p>
                  Que vous preniez la route, nous avons ce qu'il vous faut
                  avec notre large gamme de voitures
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default PlanTrip;
