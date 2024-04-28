import "../Styles/GameCard.css"
import { CARD_ASPECT_RATIO } from "../Utils/Utils";
import { trash } from "../assets/trash.tsx"
import { useSVG } from "../assets/use.tsx";

const CIRCLE = "☆";

interface PropTypes {
  card : GameCardType;
  // The height and width are relative to the screen width (vw)
  cardWidth? : number;
  rotation? : number;
  active? : boolean;
  disabled? : boolean;
  onClick? : () => void;
  handleDiscard? : () => void;
  handleUse? : () => void;
}

export default function GameCard({
  card,
  cardWidth = 12,
  rotation = 0,
  active = false,
  disabled = false,
  onClick = () => {},
  handleDiscard = () => {},
  handleUse = () => {},
} : PropTypes) {

  const costArray = []
  for (let i = 0; i < card.cost; ++i) costArray.push(<p key={i}>{CIRCLE}</p>)

  const valueArray = []
  valueArray.push(<p key="attack">{card.attack}</p>)
  valueArray.push(<p key="separator">{"/"}</p>)
  valueArray.push(<p key="life">{card.life}</p>)

  return <>
    <div className="GameCardContainer"
      
      style={{
        width: `${cardWidth}vw`,
        height: `${CARD_ASPECT_RATIO * cardWidth}vw`,
        transform: (active) ? "translateY(-2vw)" : "",
        pointerEvents: (disabled) ? "none" : "all"
      }}
    >
      <div 
        className="GameCardBack"
        style={{ transform: `rotateY(${180 + rotation}deg)` }} 
      />
      <div 
        onClick={onClick}
        className="GameCardFront"
        style={{ transform: `rotateY(${rotation}deg)` }}
      >
        <div className="GameCardBorder" />

        <div className="GameCardImageBg" ></div>

        <div className="GameCardCost">{costArray}</div>

        <div className="GameCardPoints">{valueArray}</div>

        <div 
          className="GameCardUsage"
          style={{
            opacity: (active) ? "1" : "0",
            pointerEvents: (active) ? "all" : "none"
          }}
        >
          <button className="GameCardButton" onClick={ (e) => { handleUse(); e.stopPropagation(); }}>{ useSVG }</button>
          <button className="GameCardButton">B</button>
          <button className="GameCardButton" onClick={ (e) => { handleDiscard(); e.stopPropagation(); }}>{ trash }</button>
        </div>

        <div 
          className="GameCardExplication"
          style={{
            top: (active) ? "-11vw" : "-10vw"
          }}
        >
          <div className="GameCardName">{card.name}</div>
          <div className="GameCardDesc">{card.description}</div>
        </div>
      </div>
    </div>
  </>
}