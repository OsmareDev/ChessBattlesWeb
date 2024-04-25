// const repositionAllCards = (cards : CardInHand[], handAtributes : GameHandAtributes) => {
//   const cardNumber = cards.length
//   const max_offsetX = ((cardNumber-1) / 2) * handAtributes.offsetByCard
  
//   cards.forEach( (card) => {
//     const div = (cardNumber == 1) ? 1 : cardNumber - 1

//     const inclination = (cardNumber == 1) ? 0 : -(handAtributes.maxDegrees/2) + handAtributes.maxDegrees * card.realPos / (cardNumber - 1)
//     const offsetX = -(max_offsetX) + (max_offsetX * 2) * card.realPos / div
//     const offsetY = handAtributes.maxOffsetY * Math.pow(Math.abs(Math.floor(card.realPos - (cardNumber-1)/2)), 2) / Math.pow(div/2, 2)
//     const zIndex = 10 + card.realPos

//     card.posX = offsetX
//     card.posY = offsetY
//     card.tilt = inclination
//     card.zInd = zIndex

//     console.log(max_offsetX);
//   })
// }

export const resetCardPosition = (card : CardInHand) => {
  card.posX = 0
  card.posY = 0
  card.tilt = 0
  card.zInd = 0
}

export const shiftAllCards = (cards : CardInHand[], from : number, left : boolean) => cards.forEach( card =>  { if (card.realPos >= from) card.realPos += (left) ? -1 : 1 } )

export const shiftCard = (cards : CardInHand[], from : number, to :number) => {
  const displacementDirection = Math.sign(from - to)
  
  cards.forEach( card => { 
    if (displacementDirection > 0) {
      if (card.realPos < from && card.realPos >= to)  {
        card.realPos++
      }
      else if (card.realPos == from) card.realPos = to
    } else {
      if (card.realPos > from && card.realPos <= to)  {
        card.realPos--
      }
      else if (card.realPos == from) card.realPos = to
    }
  })
}

export const repositionCards = (cards : CardInHand[], handAtributes : GameHandAtributes, currentIndex : number, cardsDiscarded : number) => {
  const numberOfCards = (cards.length - cardsDiscarded > handAtributes.maxCardsInHand - 1) ? handAtributes.maxCardsInHand : cards.length - cardsDiscarded

  const max_offsetX = (( numberOfCards - 1 ) / 2) * handAtributes.offsetByCard
  const max_offsetY = ( handAtributes.maxOffsetY * numberOfCards / handAtributes.maxCardsInHand )

  

  cards.forEach( card => {
    if (card.realPos < currentIndex) {
      const currentPos = (card.realPos - (currentIndex))

      const inclination = -90
      const offsetX = -max_offsetX - handAtributes.offsetByCard
      const offsetY = max_offsetY * Math.pow(Math.floor(Math.abs(currentPos - (numberOfCards - 1)/2)), 2) / Math.pow((numberOfCards - 1)/2, 2)
      const zIndex = 10 + card.realPos

      card.posX = offsetX
      card.posY = offsetY
      card.tilt = inclination
      card.zInd = zIndex
      card.active = false
    }

    else if (card.realPos >= currentIndex + handAtributes.maxCardsInHand || card.discarded) {
      if (card.discarded) {
        const currentPos = card.realPos - (cards.length - 1 - cardsDiscarded) - 1
        const maxofseto = (( cardsDiscarded - 1 ) / 2) * handAtributes.offsetByCard
        const discardedCards = (cardsDiscarded > 1) ? cardsDiscarded : 2
        
        const inclination = 0
        const offsetX = -(maxofseto) + (maxofseto * 2) * currentPos / (discardedCards - 1)
        const offsetY = -handAtributes.discardedCardsY
        const zIndex = 10 + card.realPos

        card.posX = offsetX
        card.posY = offsetY
        card.tilt = inclination
        card.zInd = zIndex
        card.active = false
      } else {
        const currentPos = card.realPos - currentIndex

        const inclination = 90
        const offsetX = max_offsetX + handAtributes.offsetByCard
        const offsetY = max_offsetY * Math.pow(Math.floor(Math.abs(currentPos - (numberOfCards - 1)/2)), 2) / Math.pow((numberOfCards - 1)/2, 2)
        const zIndex = 10 + card.realPos

        card.posX = offsetX
        card.posY = offsetY
        card.tilt = inclination
        card.zInd = zIndex
        card.active = false
      }
    }

    else {
      if (numberOfCards === 1) {
        resetCardPosition( card )
      } else {
        const currentPos = card.realPos - currentIndex

        console.log("currentPos : ", currentPos)
        
        const inclination = -(handAtributes.maxDegrees/2) + handAtributes.maxDegrees * currentPos / (numberOfCards - 1)
        const offsetX = -(max_offsetX) + (max_offsetX * 2) * currentPos / (numberOfCards - 1)
        const offsetY = max_offsetY * Math.pow(Math.floor(Math.abs(currentPos - (numberOfCards - 1)/2)), 2) / Math.pow((numberOfCards - 1)/2, 2)
        const zIndex = 10 + card.realPos

        console.log("inclination : ", inclination)
        console.log("offsetX : ", offsetX)
        console.log("offsetY : ", offsetY)
        console.log("zIndex : ", zIndex)

        card.posX = offsetX
        card.posY = offsetY
        card.tilt = inclination
        card.zInd = zIndex
      }
    }
  })
}

export const shiftValues = (cards : CardInHand[], index : number, wantedIndex : number) => {
  const changeCard = cards.find(card => card.realPos == wantedIndex)
  if (changeCard == null) return
  changeCard.realPos = cards[index].realPos
  cards[index].realPos = wantedIndex
}