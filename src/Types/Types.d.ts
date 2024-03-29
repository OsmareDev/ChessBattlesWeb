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