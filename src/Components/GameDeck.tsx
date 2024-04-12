import "../Styles/GameDeck.css"
import { CARD_ASPECT_RATIO } from "../Utils/Utils";

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
        width: `${deckWidth + 0.1}vw`,
        height: `${CARD_ASPECT_RATIO * (deckWidth + 0.1)}vw`,
        transform: `translate(${offsetX}vw, ${offsetY}vw)`
      }}
    >
    </div>
  </>
}