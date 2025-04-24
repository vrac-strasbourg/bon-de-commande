"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Qualite, { QualiteImage, map as QualiteMap } from "./qualite.js";
import PrintSizer from "./print-sizer.jsx";
import logo from "../public/logo.jpg";

function bloc(item, tp, t) {
  const ft = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
  return (
    <tr key={item.id}>
      <td>{tp(item)}</td>
      {Qualite({ qualites: item.fields.Qualite || [] })}
      <td className="number">{ft.format(item.fields.prix_TTC * 1.1)}</td>
      <td className="number">{ft.format(item.fields.prix_TTC * 0.9)}</td>
      <td className="number">{ft.format(item.fields.prix_TTC * 0.5)}</td>
      <td></td>
      <td>{t(item.fields.unit)}</td>
      <td></td>
    </tr>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [texts, setTexts] = useState([]);
  const [config, setConfig] = useState();
  const fallback = "Francais";
  const [langs, setLangs] = useState([]);
  const [currentLang, setCurrentLang] = useState(fallback);

  const tp = (product) => {
    const v = product.fields[currentLang];
    return v?.length ? v : product.fields[fallback];
  };

  const t = (prop) => {
    const v = texts?.[prop]?.[currentLang];
    return v?.length ? v : texts?.[prop]?.[fallback];
  };

  useEffect(() => {
    fetch(
      'https://vrac.getgrist.com/api/docs/2BPFJwZHF8Nq/tables/Produits/records?sort=Categorie,Nom',
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
      "https://vrac.getgrist.com/api/docs/2BPFJwZHF8Nq/tables/Langues/records?sort=Nom",
    )
      .then((r) => r.json())
      .then((r) => r.records)
      .then(setLangs);
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
            {t("bc")} {t(config?.Mois)}
          </h1>

          <ul>
            <li>{t("nom")} :</li>
            <li>{t("prénom")} :</li>
            <li>
              {t("email")} / {t("téléphone")} :
            </li>
            <li>{t("groupement")} :</li>
          </ul>
        </div>
        <Image src={logo} height={100} priority alt="Logo de Vrac Strasbourg" />
      </header>
      <select
        value={currentLang}
        onChange={(e) => setCurrentLang(e.target.value)}
      >
        {langs.map((lang) => {
          return (
            <option
              key={lang.fields.Nom_informatique}
              value={lang.fields.Nom_informatique}
            >
              {lang.fields.Nom}
            </option>
          );
        })}
      </select>
      <PrintSizer lang={currentLang} />
      <table>
        <thead>
          <tr>
            <th>{t("produit")}</th>
            <th>{t("qualité")}</th>
            <th>{`${t("tarif")} ${t("bleu")} (+10%)`}</th>
            <th>{`${t("tarif")} ${t("vert")} (-10%)`}</th>
            <th>{`${t("tarif")} ${t("rose")} (-50%)`}</th>
            <th>{t("quantité")}</th>
            <th>{t("unité")}</th>
            <th>{t("montant")}</th>
          </tr>
        </thead>
        <tbody>{products.map((i) => bloc(i, tp, t))}</tbody>
      </table>
      <footer>
        <div className="qualites">
          {Object.keys(QualiteMap).map((qualite) => (
            <div key={qualite}>
              {QualiteImage(qualite)}
              {t(qualite)}
            </div>
          ))}
        </div>
        <p>{t("explications")}</p>
        <h1>{t("tarifs")}</h1>
        <h2>{t("contact")}</h2>
        <div className="contacts">
          <div>
            {t("antenne")} Port du Rhin, Neuhof, Koenigshoffen,
            PARENCHchantement : 07 81 62 94 49 zoe‑strasbourg@vrac‑asso.org
          </div>
          <div>
            {t("antenne")} Illkirch Ampère-Musau, Montagne Verte :
            07 86 92 82 81 lea‑strasbourg@vrac‑asso.org
          </div>
          <div>
            {t("antenne")} Hautepierre, Cité Spach :
            07 66 67 95 66 alice‑strasbourg@vrac‑asso.org
          </div>
          <div>
            {t("antenne")} Recyclerie by AMITEL ({t("étudiants")}) :
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
