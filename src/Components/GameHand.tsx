import GameCard from "./GameCard"
import "../Styles/GameHand.css"

const SPACE_BETWEEN_CENTERS = 2;
const MAX_DEGREES = 30;
const MAX_OFFSET = -3;

export default function GameHand() {
  
  const cards = []
  const cardTest : GameCardType = {
    attack:1,
    cost: 3,
    description: "This is a game card test",
    imageURL: "",
    life: 20,
    name: "Test Card"
  }

  const cardNumber = 14
  for (let i = 0; i < cardNumber; ++i) {
    const inclination = -(MAX_DEGREES/2) + MAX_DEGREES * i / (cardNumber - 1)
    const offset = MAX_OFFSET * Math.abs(Math.floor(i - (cardNumber-1)/2)) / ((cardNumber - 1) / 2)
    
    cards.push(
      <div className="GameHandCardPosition">
        <div className="GameHandCardPivot"
          style={{
            transform: `RotateZ(${inclination}deg)`,
            bottom: `${offset}vw`
          }}>
          <GameCard card={cardTest} />
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