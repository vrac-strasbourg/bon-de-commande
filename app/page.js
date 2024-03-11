'use client'

import Image from "next/image";
import { useState, useEffect } from 'react';
import styles from "./page.module.css";
import Qualite from "./qualite.js";
import logo from '../public/logo.jpg';

function bloc(item, field) {
  const ft = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })
  return (<tr key={item.id}>
    <td>{item.fields[field]}</td>
    {Qualite(item.fields.Qualite)}
    <td className="number">{ft.format(item.fields.Prix*1.1)}</td>
    <td className="number">{ft.format(item.fields.Prix*0.9)}</td>
    <td className="number">{ft.format(item.fields.Prix*0.5)}</td>
    <td></td>
    <td>{item.fields.Unite}</td>
    <td></td>
  </tr>)
}

export default function Home() {
  const [data, setData] = useState([])
  const [field, setField] = useState("Produit")

  useEffect(() => {
    fetch('https://vrac.getgrist.com/api/docs/2BPFJwZHF8Nq/tables/Produits/records')
      .then(r => r.json())
      .then(r => r.records)
      .then(setData)
  }, [])
  return (
    <main className={styles.main}>
      <header>
        <div>
          <h1>
            Bon de commande VRAC Février 2024
          </h1>

          <ul>
            <li>Nom :</li>
            <li>Prénom :</li>
            <li>Email / téléphone :</li>
            <li>Groupement d'achat :</li>
          </ul>
          </div>
        <Image
          src={logo}
          height={100}
          priority
        />
      </header>
      <select onChange={e => setField(e.target.value)}>
        <option value="Produit">Français</option>
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
      <tbody>
        {data.map(i => bloc(i,field))}
      </tbody>
  {/*        {data.records.map(bloc)}
        {data.records.map(bloc)}
        {data.records.map(bloc)}*/}
      </table>
    </main>
  );
}
