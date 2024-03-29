import GameCard from "./GameCard"
import "../Styles/GameHand.css"
import { useEffect, useState } from "react";

const MAX_DEGREES = 30;
const MAX_OFFSET = -2;
const OFFSET_BY_CARD = 6.5;

let lastDraggedIndex : (number) = 0
let pickedCardIndex : (number) = 0

const repositionAllCards = (cards : CardInHand[]) => {
  const cardNumber = cards.length
  const max_offsetX = ((cardNumber-1) / 2) * OFFSET_BY_CARD
  
  cards.forEach( (card) => {
    const inclination = -(MAX_DEGREES/2) + MAX_DEGREES * card.realPos / (cardNumber - 1)
    const offsetX = -(max_offsetX) + (max_offsetX * 2) * card.realPos / (cardNumber - 1)
    const offsetY = MAX_OFFSET * Math.pow(Math.abs(Math.floor(card.realPos - (cardNumber-1)/2)), 2) / Math.pow((cardNumber-1)/2, 2)
    const zIndex = 10 + card.realPos

    card.posX = offsetX
    card.posY = offsetY
    card.tilt = inclination
    card.zInd = zIndex
  })
}

const shiftValues = (cards : CardInHand[], index : number, wantedIndex : number) => {
  const changeCard = cards.find(card => card.realPos == wantedIndex)
  if (changeCard == null) return
  changeCard.realPos = cards[index].realPos
  cards[index].realPos = wantedIndex
}

export default function GameHand() {
  const [cardList, setNewCardList] = useState<CardInHand[]>([])
  const [cardMoving, setCardMoving] = useState(false)


  const handleDragStart = (e : React.DragEvent<HTMLDivElement>, index : number) => {
    
    const renewedList = structuredClone(cardList)
    setNewCardList(renewedList)

    // Hide the shadow of the dragged element
    e.dataTransfer.setDragImage(e.target as Element, window.outerWidth, window.outerHeight);

    console.log("picked card index: ", index)
    console.log("picked card index: ", cardList[index].realPos)
    lastDraggedIndex = index
    pickedCardIndex = index

    setCardMoving(true)
  };

  const handleDragOver = (e : React.DragEvent<HTMLDivElement>, index : number) => {
    e.preventDefault();
    if (cardList[lastDraggedIndex].realPos === index) return
    
    const renewedList = structuredClone(cardList)
    shiftValues( renewedList, pickedCardIndex, index )
    repositionAllCards( renewedList )
    
    setNewCardList( renewedList )
    lastDraggedIndex = renewedList[index].realPos
  }
  
  const handleDrop = (e : React.DragEvent<HTMLDivElement>) => {
    console.log("llamada")
    e.preventDefault();
    setCardMoving(false);
  };

  useEffect(() => {
    const cardNumber = 7
    const initialCards : CardInHand[] = []

    for (let i = 0; i < cardNumber; ++i) {

      const cardTest : GameCardType = {
        attack: i,
        cost: 3,
        description: "This is a game card test",
        imageURL: "",
        life: 20,
        name: "Test Card"
      }

      const cardInHandTest : CardInHand = {
        id: "cardN"+i,
        realPos: i,
        card: cardTest,
        posX: 0,
        posY: 0,
        tilt: 0,
        zInd: 0,
        isBeingDragged: false
      }

      initialCards.push(cardInHandTest)
    }

    repositionAllCards( initialCards )
    setNewCardList( initialCards )
  }, [])

  const cards = []
  const backs = []

  for (let i = 0; i < cardList.length; ++i) {

    backs.push(
      <div 
        key={`cardKey${i}`} 
        className="GameHandCardPosition"
        style={{
          visibility: (cardMoving) ? "visible" : "hidden"
        }}
        onDragOver={(e) => handleDragOver(e, i)}
        >
      </div>
    );

    cards.push(
      <div className="GameHandCardPivot"
        id={cardList[i].id}
        key={cardList[i].id}
        draggable
        onDragStart={(e) => handleDragStart(e, i)}
        onDragEnd={(e) => handleDrop(e)}
        style={{
          zIndex: cardList[i].zInd,
          transform: `TranslateX(${cardList[i].posX}vw) TranslateY(${-cardList[i].posY}vw) RotateZ(${(cardList[i].isBeingDragged) ? 0 : cardList[i].tilt}deg)`,
        }}>
          <GameCard card={cardList[i].card} />
      </div>
    );
  }

  return <>
    <div className="GameHandContainer">
      { 
        cards
      }
      {
        backs
      }
    </div>
  </>
}