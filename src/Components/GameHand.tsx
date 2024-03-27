import GameCard from "./GameCard"
import "../Styles/GameHand.css"
import { useEffect, useRef, useState } from "react";

// const SPACE_BETWEEN_CENTERS = 2;
const MAX_DEGREES = 30;
const MAX_OFFSET = -2;

let actualCardList : GameCardType[] = []

export default function GameHand() {
  const [cardDragged, setDraggedItem] = useState<number | null>(null)
  const [lastDraggedIndex, setLastDraggedIndex] = useState<number | null>(null)
  
  const [cardList, setNewCardList] = useState<GameCardType[]>([])

  const handleDragStart = (e : React.DragEvent<HTMLDivElement>, index : number) => {
    setDraggedItem(index)
  };

  const handleDragOver = (e : React.DragEvent<HTMLDivElement>, index : number) => {
    e.preventDefault();
    if (lastDraggedIndex === index) return
    if (cardDragged === null) return
    
    console.log(actualCardList[5])
    
    const newCardList = [...actualCardList]
    newCardList[index] = actualCardList[cardDragged]
    newCardList[cardDragged] = actualCardList[index]
    
    console.log(actualCardList[5])
    setNewCardList(newCardList)
    
    setLastDraggedIndex(index)
  };

  const handleDrop = (e : React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    actualCardList = [...cardList]
    setDraggedItem(null);
    setLastDraggedIndex(null);
    console.log('Elemento soltado:', cardDragged);
  };

  useEffect(() => {
    const cardNumber = 7
    const initialCards = []
    for (let i = 0; i < cardNumber; ++i) {
      const cardTest : GameCardType = {
        attack: i,
        cost: 3,
        description: "This is a game card test",
        imageURL: "",
        life: 20,
        name: "Test Card"
      }

      initialCards.push(cardTest)
    }

    setNewCardList(initialCards)
    actualCardList = initialCards
    console.log("first iteration : ", initialCards)
  }, [])

  const cards = []
  for (let i = 0; i < cardList.length; ++i) {
    const inclination = -(MAX_DEGREES/2) + MAX_DEGREES * i / (cardList.length - 1)
    // const offset = MAX_OFFSET * Math.abs(Math.floor(i - (cardNumber-1)/2)) / ((cardNumber - 1) / 2)  -> lineal
    const offset = MAX_OFFSET * Math.pow(Math.abs(Math.floor(i - (cardList.length-1)/2)), 2) / Math.pow((cardList.length-1)/2, 2)

    cards.push(
      <div key={`cardKey${i}`} className="GameHandCardPosition"
        onDragOver={(e) => handleDragOver(e, i)}
        onDrop={(e) => handleDrop(e)}>
        <div className="GameHandCardPivot"
          key={`pivot${i}`}
          draggable
          onDragStart={(e) => handleDragStart(e, i)}
          style={{
            transform: `RotateZ(${inclination}deg)`,
            bottom: `${offset}vw`
          }}>
          <GameCard key={`card${i}`} card={cardList[i]} />
        </div>
      </div>
    );
  }

  return <>
    <div className="GameHandContainer">
      { cards }
    </div>
  </>
}