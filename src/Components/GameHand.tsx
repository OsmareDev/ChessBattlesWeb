import GameCard from "./GameCard"
import "../Styles/GameHand.css"
import useHandCards from "../Hooks/useHandCards";
import useDeckCards from "../Hooks/useDeckCards";
import { deckTest, deckTest2 } from "../Utils/DeckTest";
import GameDeck from "./GameDeck";
import { CARD_ASPECT_RATIO } from "../Utils/Utils";
import { useDomController } from "../Hooks/Stores/useDomController";

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
  // initialNumberOfCards = 11,
  maxCardsInHand = 7,
  maxDegrees = 30,
  maxOffsetY = -2,
  cardContainerLenght = 4.5,
  cardsContainerGap = 0.5,
  cardGrowthRespectContainer = 2,
  bottom = 4
} : propTypes) {
  const { handleDragStart, handleDragOver, handleDrop, addNewCard, addNewCardLeft, changeCardState, discard, recoverCard, cardList, cardMoving, currentIndex, discardedCards } = useHandCards({maxDegrees, maxOffsetY, offsetByCard : cardContainerLenght + cardsContainerGap, maxCardsInHand, discardedCardsY : bottom + (cardContainerLenght * cardGrowthRespectContainer + CARD_ASPECT_RATIO) * 0.9})
  const { loadNextCard, topCard } = useDeckCards( deckTest, { offsetX : 40, offsetY : 0 }, "deck1" )
  const { loadNextCard: loadNextCard2, topCard: topCard2 } = useDeckCards( deckTest2, { offsetX : -40, offsetY : 0 }, "deck2" )
  const { domCounter } = useDomController()

  const cards = Array(domCounter + 1)
  const backs = []

  const length = (cardList.length > maxCardsInHand) ? maxCardsInHand : cardList.length
  for (let i = 0; i < length; ++i) {
    backs.push(
      <div 
        key={`cardKey${i + currentIndex}`} 
        className="GameHandCardPosition"
        style={{
          // visibility: (cardMoving) ? "visible" : "hidden",
          // display: (cardMoving) ? "block" : "none",
          minWidth: `${cardContainerLenght}vw`,
          width: `${cardContainerLenght}vw`,
          bottom: `${-bottom - 200}vw`,
          transform: `translateY(${(cardMoving) ? -200 : 0}vw)`
          // pointerEvents: (cardMoving) ? "all" : "none",
          // zIndex: (cardMoving) ? "10000" : "-10000",
        }}
        onDragOver={(e) => handleDragOver(e, i + currentIndex)}
        >
      </div>
    );
  }

  for (let i = 0; i < cardList.length; ++i) {
    cards[cardList[i].domPos] = (
      <div className="GameHandCardPivot"
        id={cardList[i].id}
        key={cardList[i].id}
        draggable={ true }
        onDragStart={(e) => handleDragStart(e, i)}
        onDragEnd={(e) => handleDrop(e)}
        style={{
          zIndex: cardList[i].zInd,
          transform: `TranslateX(${cardList[i].posX}vw) TranslateY(${-cardList[i].posY}vw) RotateZ(${(cardList[i].isBeingDragged) ? 0 : cardList[i].tilt}deg)`,
        }}>
          <GameCard 
            card={cardList[i].card} 
            cardWidth={cardContainerLenght * cardGrowthRespectContainer} 
            active={cardList[i].active} 
            onClick={ () => changeCardState(i) } 
            handleDiscard={ () => discard(i) }
            disabled={(Math.abs(cardList[i].tilt) == 90)}
          />
      </div>
    );
  }

  // DECK CARD
  if (topCard) {
    cards[topCard.domPos] = (
      <div className="GameHandCardPivot"
          id={topCard.id}
          key={topCard.id}
          style={{
            zIndex: topCard.zInd,
            transform: `TranslateX(${topCard.posX}vw) TranslateY(${-topCard.posY}vw) RotateZ(${(topCard.isBeingDragged) ? 0 : topCard.tilt}deg)`,
          }}>
            <GameCard card={topCard.card} cardWidth={cardContainerLenght * cardGrowthRespectContainer} rotation={180} />
        </div>
    )
  }

  if (topCard2) {
    cards[topCard2.domPos] = (
      <div className="GameHandCardPivot"
          id={topCard2.id}
          key={topCard2.id}
          style={{
            zIndex: topCard2.zInd,
            transform: `TranslateX(${topCard2.posX}vw) TranslateY(${-topCard2.posY}vw) RotateZ(${(topCard2.isBeingDragged) ? 0 : topCard2.tilt}deg)`,
          }}>
            <GameCard card={topCard2.card} cardWidth={cardContainerLenght * cardGrowthRespectContainer} rotation={180} />
        </div>
    )
  }

  // DISCARDED CARDS
  for (let i = 0; i < discardedCards.length; ++i) {
    cards[discardedCards[i].domPos] = (
      <div className="GameHandCardPivot"
        id={discardedCards[i].id}
        key={discardedCards[i].id}
        style={{
          zIndex: discardedCards[i].zInd,
          transform: `TranslateX(${discardedCards[i].posX}vw) TranslateY(${-discardedCards[i].posY}vw) RotateZ(${(discardedCards[i].isBeingDragged) ? 0 : discardedCards[i].tilt}deg)`,
        }}>
          <GameCard 
            card={discardedCards[i].card} 
            cardWidth={cardContainerLenght * cardGrowthRespectContainer} 
            onClick={ () => recoverCard(i) }
          />
      </div>
    );
  }

  // HANDLE NEW CARD
  const addCardToHand = () => {
    if (topCard === null) return

    addNewCard(topCard)
    loadNextCard()
  }

  const addCard2ToHand = () => {
    if (topCard2 === null) return

    addNewCardLeft(topCard2)
    loadNextCard2()
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
      <GameDeck addCard={addCard2ToHand} offsetX={-40} offsetY={0} deckWidth={cardContainerLenght * cardGrowthRespectContainer}/>
    </div>
  </>
}