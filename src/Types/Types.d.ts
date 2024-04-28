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
  domPos: number;
  card: GameCardType;
  posX: number;
  posY: number;
  tilt: number;
  rotation : number;
  scale : number;
  zInd: number;
  isBeingDragged: boolean;
  active: boolean;
  inUse: boolean;
}

interface GameHandAtributes {
  maxDegrees : number;
  maxOffsetY : number;
  offsetByCard : number;
  maxCardsInHand : number;
  discardedCardsY : number;
  usingCardPos : {
    x : number;
    y : number;
  }
}

interface GameDeckAtributes {
  offsetX : number;
  offsetY : number;
}

interface DeckTest {
  cards : GameCardType[]
}