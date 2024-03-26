import "../Styles/GameCard.css"

const CIRCLE = "☆";

interface PropTypes {
  card : GameCardType
}

export default function GameCard({
  card
} : PropTypes) {

  const costArray = []
  for (let i = 0; i < card.cost; ++i) costArray.push(<p key={i}>{CIRCLE}</p>)

  const valueArray = []
  valueArray.push(<p key="attack">{card.attack}</p>)
  valueArray.push(<p key="separator">{"/"}</p>)
  valueArray.push(<p key="life">{card.life}</p>)

  return <>
    <div className="GameCardContainer">
      <div className="GameCardBack" />
      <div className="GameCardFront">
        <div className="GameCardBorder" />

        <div className="GameCardImageBg" ></div>

        <div className="GameCardCost">{costArray}</div>

        <div className="GameCardPoints">{valueArray}</div>

        <div className="GameCardExplication">
          <div className="GameCardName">{card.name}</div>
          <div className="GameCardDesc">{card.description}</div>
        </div>
      </div>
    </div>
  </>
}