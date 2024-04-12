interface GameCardType {
  cost : number;
  life : number;
  attack : number;
  name : string;
  description : string;
  imageURL : string;
}

interface CardInHand {
  id: string;
  realPos: number;
  card: GameCardType;
  posX: number;
  posY: number;
  tilt: number;
  zInd: number;
  isBeingDragged: boolean;
}

interface GameHandAtributes {
  maxDegrees : number;
  maxOffsetY : number;
  offsetByCard : number;
  maxCardsInHand : number;
}

interface GameDeckAtributes {
  offsetX : number;
  offsetY : number;
}

interface DeckTest {
  cards : GameCardType[]
}