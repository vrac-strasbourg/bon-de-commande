"use client";
import { useState, useEffect } from "react";


export default function Importation() {
  const [files, setFiles] = useState([])
  const [tarifications, setTarifications] = useState([])

  function onChangeFiles(e) {
    const ff = []
    for (var i = 0; i < e.target.files.length; i++) {
      ff.push(e.target.files[i])
    }
    setFiles(ff)
  }

  useEffect(() => {
    setTarifications(files.map(f => {
      return {
        name: f.name,
        valeur: f.name.match("coûtant") ? "coûtant" : "triple"
      }
    }))
  }, [files])

  function onUpdate(i, v) {
    const tarifs = tarifications.map(t => t)
    tarifs[i].valeur = v
    setTarifications(tarifs)
  }

  async function onClick() {
    const contents = await Promise.all(files.map(f => f.text()))
    const newLines = []
    let headersAdded = false
    contents.forEach((content, i) => {
      const lines = content.split("\n")
      const h = lines.shift()
      if (!headersAdded) {
        headersAdded = true
        newLines.push(`${h};Tarification;actif`)
      }
      lines.map(l => {
        if (l.length) {
          newLines.push([l, `"${tarifications[i].valeur}";true`].join(";"))
        }
      })
    })

    newLines.push("")

    var link = document.createElement("a");
    link.download = "Produits.csv";

    // Hack changement de prix
    const formatted = newLines.join('\n').replace(/ €/g, " €")
    const b = new Blob([formatted]);
    link.href = URL.createObjectURL(b);
    link.click();
  }

  return <div>
    <p>Dans lʼépicerie, pour chaque catalogue</p>
    <ul>
      <li>Cliquer sur « Récapitulatif »</li>
      <li>Aller en bas de la liste</li>
      <li>Cliquer sur « Export Excel/CSV »</li>
    </ul>

    <div><label htmlFor="files">Une fois tous les fichiers exportés de lʼépicerie, les sélectionner tous dʼun coup (ctrl+clic ou shift)</label></div>
    <input id="files" type="file" multiple onChange={onChangeFiles}/>
    {tarifications.length ? <table>
      <thead><tr><th>Triple</th><th>Coûtant</th><th>Fichier</th></tr></thead>
      <tbody>{
        tarifications.map((t, i) => <tr key={t.name}>
          <td><input name={`tarif_${i}`} type="radio"
            onChange={(e) => onUpdate(i, e.target.value)} value="triple" checked={t.valeur == "triple"} /></td>
          <td><input name={`tarif_${i}`} type="radio"
            onChange={(e) => onUpdate(i, e.target.value)} value="coûtant" checked={t.valeur == "coûtant"}/></td>
          <td>{t.name}</td>
          </tr>)
      }</tbody>
      </table> : <></>
    }

    <div><button onClick={onClick} disabled={tarifications.length == 0}>Générer le fichier unique</button></div>

    <p>Dans Grist</p>
    <ul>
      <li>Cliquer sur « Nouveau »</li>
      <li>Cliquier « Importer depuis un fichier »</li>
      <li>Sélectionner « Produits »</li>
      <li>Cocher « Mettre à jour les enregistrements existants »</li>
      <li>Indiquer « Référence »</li>
      <li>Vérifier les modifications apportées</li>
      <li>Cliquer sur « Import »</li>
    </ul>
  </div>
}