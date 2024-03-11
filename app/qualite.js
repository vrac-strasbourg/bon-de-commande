import Image from "next/image";

import local from '../public/local.png';
import vrac from '../public/vrac.png';
import bio from '../public/bio.png';
import équitable from '../public/equitable.png';


const map = {
    local,
    vrac,
    bio,
    équitable
}

export default function Qualite(props) {
    const p = props.filter(i=> map[i])
    return (<td>
        {
            p.map(i => {
                return <Image key={i}
                  src={map[i]}
                  alt={i}
                  height={25}
                  priority
                />
        })}
    </td>)
}