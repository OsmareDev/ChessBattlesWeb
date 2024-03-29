import { useState, useEffect } from "react";
import "../Styles/styles.css";

interface cosaTipo {
  id: string;
  pos: number;
}

const repos = (arr : cosaTipo[]) => {
  arr.forEach((value, index) => {
    value.pos = 150 * index
  })
}

const shift = (arr : cosaTipo[]) => {
  const last = arr.pop()
  if (last) arr.unshift(last)
}

export default function Test() {
  const [ids, setIds] = useState<cosaTipo[]>([]);

  useEffect(() => {
    const initialIDs : cosaTipo[] = [];
    for (let i = 0; i < 3; ++i) {
      initialIDs.push({
        id: "idNumber" + i,
        pos: 0
    });
    }

    repos(initialIDs)
    setIds(initialIDs);
  }, []);

  const handleClick = () => {
    // Clonar la matriz de ids y luego modificarla
    // const newArray = structuredClone(ids);
    const newArray = structuredClone(ids);
    // shift( newArray )
    // repos( newArray )
    // const last = newArray.pop()
    // newArray.unshift(last)

    // newArray.forEach((value, index) => {
    //   value.pos = 150 * index
    // })

    newArray.forEach((value, index) => {
      value.pos = ids[(index+1)%ids.length].pos
    })

    setIds(newArray);
  };

  return (
    <>
      {ids.map((id) => (
        <div
          key={id.id}
          style={{
            left: `${id.pos}px`, // Ajusta la posición inicial de cada cubo
            top: `0px`, // Mantiene la posición en la parte superior
            height: "50px",
            width: "50px",
            position: "absolute",
            transition: "all 0.5s ease",
            background: "black",
          }}
        ></div>
      ))}
      <button style={{top: "5%", position: "absolute"}} onClick={handleClick}>Click</button>
    </>
  );
}
