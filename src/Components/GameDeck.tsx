import "../Styles/GameDeck.css"
import { CARD_ASPECT_RATIO } from "../Utils/Utils";
import GameCard from "./GameCard"

interface propTypes {
  deckWidth? : number;
  offsetX : number;
  offsetY : number;
  addCard : () => void;
}

export default function GameDeck({
  deckWidth = 6,
  offsetX,
  offsetY,
  addCard
} : propTypes) {

  return <>
    <div 
      onClick={addCard}
      className="GameDeckContainer"
      style={{
        width: `${deckWidth}vw`,
        height: `${CARD_ASPECT_RATIO * deckWidth}vw`,
        transform: `translate(${offsetX}vw, ${offsetY}vw)`
      }}
    >
    </div>
  </>
}