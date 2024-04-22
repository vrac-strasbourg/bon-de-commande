import Image from "next/image";
import local from "../public/local.png";
import vrac from "../public/vrac.png";
import bio from "../public/bio.png";
import équitable from "../public/equitable.png";

export const map = {
  local,
  bio,
  vrac,
  équitable,
};

export default function Qualite({ qualites }) {
  const p = qualites.filter((i) => map[i]);
  return (
    <td>
      {p.map((i) => {
        return <Image key={i} src={map[i]} alt={i} height={25} priority />;
      })}
    </td>
  );
}

export function QualiteImage(qualite) {
  return <Image src={map[qualite]} alt={qualite} height={25} priority />;
}
