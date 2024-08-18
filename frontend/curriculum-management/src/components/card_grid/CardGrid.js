import React from "react";
import "./CardGrid.css"
import Card from "../card/Card";

function CardGrid() {
  const cards = [
    {
      id: 1,
      title: "Projektovanje softvera",
      description:
        "Projektovanje softvera (PSW) je kurs na 4. godini studijskog programa Računarstva i automatike. Cilj predmeta je da upozna studenta sa aktivnostima i izazovima koji postoje u okviru razrađenog procesa razvoja složenog softverskog sistema u velikom timu.",
    },
    { id:2, title: "XML i veb servisi", description: "XML i veb servisi je kurs na 4. godini studijskih programa Računarstvo i automatika i Informacioni inženjering. Cilj predmeta je da upozna studente sa konceptima servisno orijentisanih arhitektura, sa akcentom na mikroservisnoj arhitekturi." },
  ];

  return (
    <div className="grid">
      {cards.map(card => (
        <Card
          key={card.id}
          id={card.id}
          title={card.title}
          description={card.description}
        />
      ))}
    </div>
  );
}

export default CardGrid;
