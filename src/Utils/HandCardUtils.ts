export const resetCardPosition = (card : CardInHand) => {
  card.posX = 0
  card.posY = 0
  card.tilt = 0
  card.zInd = 0
  card.rotation = 0
  card.scale = 1
}

export const repositionCards = (cards : CardInHand[], handAtributes : GameHandAtributes, currentIndex : number) => {
  if (cards.length == 1) {
    resetCardPosition( cards[0] )
    return
  }
  const numberOfCards = (cards.length > handAtributes.maxCardsInHand - 1) ? handAtributes.maxCardsInHand : cards.length

  const max_offsetX = (( numberOfCards - 1 ) / 2) * handAtributes.offsetByCard
  const max_offsetY = ( handAtributes.maxOffsetY * numberOfCards / handAtributes.maxCardsInHand )

  cards.forEach( (card, index) => {
    card.rotation = 0

    if (index < currentIndex) {
      repositionPreCard(card, index, currentIndex, max_offsetX, max_offsetY, handAtributes, numberOfCards)
    }

    else if (index >= currentIndex + handAtributes.maxCardsInHand) {
      repositionPostCard(card, index, currentIndex, max_offsetX, max_offsetY, handAtributes, numberOfCards)
    }

    else {
      repositionHandCard(card, index, currentIndex, max_offsetX, max_offsetY, handAtributes, numberOfCards)
    }
  })
}

const repositionPreCard = ( card : CardInHand, index : number, currentIndex : number, max_offsetX : number, max_offsetY : number, handAtributes : GameHandAtributes, numberOfCards : number ) => {
  const currentPos = (index - (currentIndex))

  const inclination = -90
  const offsetX = -max_offsetX - handAtributes.offsetByCard
  const offsetY = max_offsetY * Math.pow(Math.floor(Math.abs(currentPos - (numberOfCards - 1)/2)), 2) / Math.pow((numberOfCards - 1)/2, 2)
  const zIndex = 10 + index

  card.posX = offsetX
  card.posY = offsetY
  card.tilt = inclination
  card.zInd = zIndex
  card.active = false
}

export const repositionHandCard = (card : CardInHand, index : number, currentIndex : number, max_offsetX : number, max_offsetY : number, handAtributes : GameHandAtributes, numberOfCards : number) => {
  const currentPos = index - currentIndex
        
  const inclination = -(handAtributes.maxDegrees/2) + handAtributes.maxDegrees * currentPos / (numberOfCards - 1)
  const offsetX = -(max_offsetX) + (max_offsetX * 2) * currentPos / (numberOfCards - 1)
  const offsetY = max_offsetY * Math.pow(Math.floor(Math.abs(currentPos - (numberOfCards - 1)/2)), 2) / Math.pow((numberOfCards - 1)/2, 2)
  const zIndex = 10 + index

  card.posX = offsetX
  card.posY = offsetY
  card.tilt = inclination
  card.zInd = zIndex
}

const repositionPostCard = (card : CardInHand, index : number, currentIndex : number, max_offsetX : number, max_offsetY : number, handAtributes : GameHandAtributes, numberOfCards : number) => {
  const currentPos = index - currentIndex

  const inclination = 90
  const offsetX = max_offsetX + handAtributes.offsetByCard
  const offsetY = max_offsetY * Math.pow(Math.floor(Math.abs(currentPos - (numberOfCards - 1)/2)), 2) / Math.pow((numberOfCards - 1)/2, 2)
  const zIndex = 10 + index

  card.posX = offsetX
  card.posY = offsetY
  card.tilt = inclination
  card.zInd = zIndex
  card.active = false
}

export const repositionDiscardedCards = ( discardedCards : CardInHand[], handAtributes : GameHandAtributes ) => {
  discardedCards.forEach( (card, i) => {
    const currentPos = i
    const max_offsetX = (( discardedCards.length - 1 ) / 2) * handAtributes.offsetByCard
    const nDiscardedCards = (discardedCards.length > 1) ? discardedCards.length : 2
    
    const inclination = 0
    const offsetX = -(max_offsetX) + (max_offsetX * 2) * currentPos / (nDiscardedCards - 1)
    const offsetY = -handAtributes.discardedCardsY
    const zIndex = 10 + currentPos

    card.posX = offsetX
    card.posY = offsetY
    card.tilt = inclination
    card.zInd = zIndex
    card.active = false
  } )
  
}

export const repositionPreparedCards = ( cardList : CardInHand[], handAtributes : GameHandAtributes ) => {
  cardList.forEach( card => {
    card.tilt = 0
    card.active = false
    
    card.posX = (card.inUse) 
      ? handAtributes.usingCardPos.x
      : 0
    card.posY = (card.inUse) 
      ? handAtributes.usingCardPos.y
      : -handAtributes.discardedCardsY

    card.rotation = (card.inUse)
      ? 720
      : 180
  })
}

export const shiftValues = (cards : CardInHand[], index : number, wantedIndex : number) => {
  const auxCard = structuredClone(cards[wantedIndex])
  cards[wantedIndex] = structuredClone(cards[index])
  cards[index] = auxCard
  
  // const changeCard = cards.find(card => card.realPos == wantedIndex)
  // if (changeCard == null) return
  // changeCard.realPos = cards[index].realPos
  // cards[index].realPos = wantedIndex
}