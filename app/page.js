"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Qualite, { QualiteImage, map as QualiteMap } from "./qualite.js";
import logo from "../public/logo.jpg";

function bloc(item, field, texts) {
  const ft = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
  return (
    <tr key={item.id}>
      <td>{item.fields[field]}</td>
      {Qualite({ qualites: item.fields.Qualite || [] })}
      <td className="number">{ft.format(item.fields.prix_TTC * 1.1)}</td>
      <td className="number">{ft.format(item.fields.prix_TTC * 0.9)}</td>
      <td className="number">{ft.format(item.fields.prix_TTC * 0.5)}</td>
      <td></td>
      <td>{texts?.[item.fields.unit]?.[field]}</td>
      <td></td>
    </tr>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [texts, setTexts] = useState([]);
  const [config, setConfig] = useState();
  const [field, setField] = useState("Francais");

  useEffect(() => {
    fetch(
      'https://vrac.getgrist.com/api/docs/2BPFJwZHF8Nq/tables/Produits/records?filter={"actif": [true]}',
    )
      .then((r) => r.json())
      .then((r) => r.records)
      .then(setProducts);
    fetch(
      "https://vrac.getgrist.com/api/docs/2BPFJwZHF8Nq/tables/Configuration/records",
    )
      .then((r) => r.json())
      .then((r) => r.records)
      .then((r) => r[0].fields)
      .then(setConfig);
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
  return Object.keys(texts).length ? (
    <main className={styles.main}>
      <header>
        <div>
          <h1>
            {texts?.bc?.[field]} {texts?.[config?.Mois]?.[field]}
          </h1>

          <ul>
            <li>{texts?.nom?.[field]} :</li>
            <li>{texts?.prénom?.[field]} :</li>
            <li>
              {texts?.email?.[field]} / {texts?.téléphone?.[field]} :
            </li>
            <li>{texts?.groupement?.[field]} :</li>
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
            <th>{texts?.produit?.[field]}</th>
            <th>{texts?.qualité?.[field]}</th>
            <th>{`${texts?.tarif?.[field]} ${texts?.bleu?.[field]} (+10%)`}</th>
            <th>{`${texts?.tarif?.[field]} ${texts?.vert?.[field]} (-10%)`}</th>
            <th>{`${texts?.tarif?.[field]} ${texts?.rose?.[field]} (-50%)`}</th>
            <th>{texts?.quantité?.[field]}</th>
            <th>{texts?.unité?.[field]}</th>
            <th>{texts?.montant?.[field]}</th>
          </tr>
        </thead>
        <tbody>{products.map((i) => bloc(i, field, texts))}</tbody>
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
        <div className="contacts">
          <div>
            {texts?.antenne?.[field]} Port du Rhin, Neuhof, Koenigshoffen,
            PARENCHchantement : 07 81 62 94 49 zoe‑strasbourg@vrac‑asso.org
          </div>
          <div>
            {texts?.antenne?.[field]} Illkirch Ampère-Musau, Montagne Verte :
            07 86 92 82 81 lea‑strasbourg@vrac‑asso.org
          </div>
          <div>
            {texts?.antenne?.[field]} Hautepierre, Cité Spach :
            07 66 67 95 66 alice‑strasbourg@vrac‑asso.org
          </div>
          <div>
            {texts?.antenne?.[field]} Recyclerie by AMITEL (
            {texts?.étudiants?.[field]}) :
            07 68 57 13 33 julianne‑strasbourg@vrac‑asso.org
          </div>
        </div>
      </footer>
    </main>
  ) : (
    <main>
      <h1>Chargement…</h1>
    </main>
  );
}
