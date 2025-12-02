import MainImg from "../images/chooseUs/main.png";
import Box1 from "../images/chooseUs/icon1.png";
import Box2 from "../images/chooseUs/icon2.png";
import Box3 from "../images/chooseUs/icon3.png";

function ChooseUs() {
  return (
    <>
      <section className="choose-section">
        <div className="container">
          <div className="choose-container">
            <img
              className="choose-container__img"
              src={MainImg}
              alt="car_img"
            />
            <div className="text-container">
              <div className="text-container__left">
                <h4>Pourquoi nous choisir ?</h4>
                <h2>Les meilleures offres que vous trouverez.</h2>
                <p>
                  Découvrez les meilleures offres du marché grâce à nos offres imbattables.
                  Nous nous engageons à vous offrir le meilleur rapport qualité-prix,
                  pour que vous puissiez profiter de services et de produits de qualité supérieure sans vous ruiner. Nos offres sont conçues pour
                  vous offrir une expérience de location optimale, alors ne manquez pas
                  votre chance de faire de grosses économies.
                </p>
                <a href="#home">
                  Find Details &nbsp;
                  <i className="fa-solid fa-angle-right"></i>
                </a>
              </div>
              <div className="text-container__right">
                <div className="text-container__right__box">
                  <img src={Box1} alt="car-img" />
                  <div className="text-container__right__box__text">
                    <h4>Traversée du pays</h4>
                    <p>
                      Passez à la vitesse supérieure en matière d'expérience de conduite grâce à nos
                      véhicules haut de gamme pour vos aventures à travers le pays.
                    </p>
                  </div>
                </div>
                <div className="text-container__right__box">
                  {" "}
                  <img src={Box2} alt="coin-img" />
                  <div className="text-container__right__box__text">
                    <h4>Tarif tout compris</h4>
                    <p>
                      Obtenez tout ce dont vous avez besoin à un prix unique, pratique et transparent
                      grâce à notre politique de prix tout compris.
                    </p>
                  </div>
                </div>
                <div className="text-container__right__box">
                  {" "}
                  <img src={Box3} alt="coin-img" />
                  <div className="text-container__right__box__text">
                    <h4>Aucun frais caché</h4>
                    <p>
                      Ayez l'esprit tranquille grâce à notre politique de zéro frais cachés.
                      Nous croyons en une tarification transparente et honnête.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ChooseUs;
