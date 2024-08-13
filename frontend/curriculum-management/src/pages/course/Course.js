import React from "react";
import { useLocation } from "react-router-dom";
import Card from "../../components/card/Card";
import "./Course.css"; // Create this CSS file to style the detail page

function Course() {
  const location = useLocation();
  const { title, description } = location.state || {};

  // Example set of new cards
  const newCards = [
    {
      id: 1,
      title: "Agilno planiranje i razvoj softvera",
      description:
        "Cilj: Kako isplanirati i organizovati posao je ključni element svakog rada, bez obzira na projekat i industriju. Sa malo planiranja, razvojni timovi troše vreme razvijajući funkcionalnosti koje ne donose vrednost po cenu bitnih elemenata softvera koje ne stižu da naprave. Sa previše planiranja, timovi konstruišu detaljne planove koji se gotovo uvek bacaju i izbegavaju da se prilagode novim informacijama i okolnostima. Kako bi izbegli ove probleme i pronašli tu zlatnu sredinu, učićemo kako da agilno planiramo i razvijamo naša softverska rešenja. Do kraja ove lekcije ćeš upoznati sve strategije i tehnike koje su ti potrebne da kreneš efikasno planiranje i organizaciju razvoja projektnog zadatka.",
    },
    {
      id: 2,
      title: "Razvoj vođen testovima",
      description: "Cilj: Do sada smo koristili primere zgrade ili automobila kao anaologiju za softver, sa idejom da želimo da napravimo stabilnu zgradu koja se neće urušiti. Novija literatura, poput Pragmatičnog Programera ili Growing Object-Oriented Software, Guided by Tests koristi primer bašte ili biljke kao analogiju za softver. Ideja je da želimo da negujemo i pospešujemo razvoj našeg rešenja kao što bismo želeli da negujemo baštu koju nam donosi plodove, odnosno korist kroz godine ili decenije.U sklopu ove lekcije učimo kako da pišemo automatske testove koji će pomoći našim softverskim sistemima da rastu i razvijaju se u stabilna i složena rešenja. Videćemo kako se pravi kvalitetan automatski test i na kraju ćemo naučiti kako da integrišemo pisanje testova u razvoj softvera prateći test-driven development (TDD) metodologiju.",
    },
  ];

  return (
    <div className="course-detail">
      <h1>{title}</h1>
      <p>{description}</p>
      <div className="card-grid">
        {newCards.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            title={card.title}
            description={card.description}
          />
        ))}
      </div>
    </div>
  );
}

export default Course;
