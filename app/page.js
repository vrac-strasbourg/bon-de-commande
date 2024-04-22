"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Qualite, { QualiteImage, map as QualiteMap } from "./qualite.js";
import logo from "../public/logo.jpg";

function bloc(item, field) {
  const ft = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
  return (
    <tr key={item.id}>
      <td>{item.fields.Nom}</td>
      {Qualite({ qualites: item.fields.Qualite || [] })}
      <td className="number">{ft.format(item.fields.prix_TTC * 1.1)}</td>
      <td className="number">{ft.format(item.fields.prix_TTC * 0.9)}</td>
      <td className="number">{ft.format(item.fields.prix_TTC * 0.5)}</td>
      <td></td>
      <td>{item.fields.Unite}</td>
      <td></td>
    </tr>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [texts, setTexts] = useState([]);
  const [field, setField] = useState("Francais");

  useEffect(() => {
    fetch(
      'https://vrac.getgrist.com/api/docs/2BPFJwZHF8Nq/tables/Produits/records?filter={"actif": [true]}',
    )
      .then((r) => r.json())
      .then((r) => r.records)
      .then(setProducts);
    fetch(
      "https://vrac.getgrist.com/api/docs/2BPFJwZHF8Nq/tables/Textes/records",
    )
      .then((r) => r.json())
      .then((r) => r.records)
      .then((texts) => {
        return texts.reduce((result, value) => {
          result[value.fields.cle] = value.fields;
          return result;
        }, {});
      })
      .then(setTexts);
  }, []);
  return (
    <main className={styles.main}>
      <header>
        <div>
          <h1>Bon de commande VRAC Février 2024</h1>

          <ul>
            <li>Nom :</li>
            <li>Prénom :</li>
            <li>Email / téléphone :</li>
            <li>Groupement d’achat :</li>
          </ul>
        </div>
        <Image src={logo} height={100} priority alt="Logo de Vrac Strasbourg" />
      </header>
      <select onChange={(e) => setField(e.target.value)}>
        <option value="Francais">Français</option>
        <option value="Russe">Russe</option>
      </select>
      <table>
        <thead>
          <tr>
            <th>Produit</th>
            <th>Qualité</th>
            <th>Tarif bleu (+10%)</th>
            <th>Tarif vert (-10%)</th>
            <th>Tarif rose (-50%)</th>
            <th>Quantité souhaitée</th>
            <th>Unité</th>
            <th>Montant</th>
          </tr>
        </thead>
        <tbody>{products.map((i) => bloc(i, field))}</tbody>
      </table>
      <footer>
        <div className="qualites">
          {Object.keys(QualiteMap).map((qualite) => (
            <div key={qualite}>
              {QualiteImage(qualite)}
              {texts?.[qualite]?.[field]}
            </div>
          ))}
        </div>
        <p>{texts?.explications?.[field]}</p>
        <h1>{texts?.tarifs?.[field]}</h1>
        <h2>{texts?.contact?.[field]}</h2>
        <div>
          <div>
            {texts?.antenne?.[field]} Port du Rhin, Neuhof, Koenigshoffen,
            PARENCHchantement : 07 81 62 94 49 zoe-strasbourg@vrac-asso.org
          </div>
          <div>
            {texts?.antenne?.[field]} Illkirch Ampère-Musau, Montagne Verte :
            07 86 92 82 81 lea-strasbourg@vrac-asso.org
          </div>
          <div>
            {texts?.antenne?.[field]} Hautepierre, Cité Spach : 07 66 67 95 66
            alice-strasbourg@vrac-asso.org
          </div>
          <div>
            {texts?.antenne?.[field]} Recyclerie by AMITEL (
            {texts?.étudiants?.[field]}) : 07 68 57 13 33
            julianne-strasbourg@vrac-asso.org
          </div>
        </div>
      </footer>
    </main>
  );
}
