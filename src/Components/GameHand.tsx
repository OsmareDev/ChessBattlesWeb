import GameCard from "./GameCard"
import "../Styles/GameHand.css"
import useHandCards from "../Hooks/useHandCards";
import useDeckCards from "../Hooks/useDeckCards";
import { deckTest } from "../Utils/DeckTest";
import GameDeck from "./GameDeck";

interface propTypes {
  initialNumberOfCards? : number;
  maxCardsInHand? : number;
  maxDegrees? : number;
  maxOffsetY? : number;
  cardContainerLenght? : number;
  cardsContainerGap? : number;
  cardGrowthRespectContainer? : number;
  bottom? : number;
}

export default function GameHand({
  initialNumberOfCards = 11,
  maxCardsInHand = 7,
  maxDegrees = 30,
  maxOffsetY = -2,
  cardContainerLenght = 4.5,
  cardsContainerGap = 0.5,
  cardGrowthRespectContainer = 2,
  bottom = 4
} : propTypes) {
  const { handleDragStart, handleDragOver, handleDrop, addNewCard, cardList, cardMoving, currentIndex } = useHandCards({maxDegrees, maxOffsetY, offsetByCard : cardContainerLenght + cardsContainerGap, maxCardsInHand})
  const { loadNextCard, topCard } = useDeckCards( deckTest, { offsetX : 40, offsetY : 0 } )

  const cards = []
  const backs = []

  const length = (cardList.length > maxCardsInHand) ? maxCardsInHand : cardList.length
  for (let i = 0; i < length; ++i) {
    backs.push(
      <div 
        key={`cardKey${i + currentIndex}`} 
        className="GameHandCardPosition"
        style={{
          visibility: (cardMoving) ? "visible" : "hidden",
          minWidth: `${cardContainerLenght}vw`,
          width: `${cardContainerLenght}vw`,
          bottom: `${-bottom}vw`
        }}
        onDragOver={(e) => handleDragOver(e, i + currentIndex)}
        >
      </div>
    );
  }

  for (let i = 0; i < cardList.length; ++i) {
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
          <GameCard card={cardList[i].card} cardWidth={cardContainerLenght * cardGrowthRespectContainer} />
      </div>
    );
  }

  // DECK CARD
  if (topCard) {
    cards.push(
      <div className="GameHandCardPivot"
          id={topCard.id}
          key={topCard.id}
          style={{
            zIndex: topCard.zInd,
            transform: `TranslateX(${topCard.posX}vw) TranslateY(${-topCard.posY}vw) RotateZ(${(topCard.isBeingDragged) ? 0 : topCard.tilt}deg) RotateY(180deg)`,
          }}>
            <GameCard card={topCard.card} cardWidth={cardContainerLenght * cardGrowthRespectContainer} />
        </div>
    )
  }

  // HANDLE NEW CARD
  const addCardToHand = () => {
    if (topCard === null) return

    addNewCard(topCard)
    loadNextCard()
  }

  return <>
    <div className="GameHandContainer"
      style={{
        gap: `${cardsContainerGap}vw`,
        bottom: `${bottom}vw`
      }}
    >
      { 
        cards
      }
      {
        backs
      }
      
      <GameDeck addCard={addCardToHand} offsetX={40} offsetY={0} deckWidth={cardContainerLenght * cardGrowthRespectContainer}/>
    </div>
  </>
}