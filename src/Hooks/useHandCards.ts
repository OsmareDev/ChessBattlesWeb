import { useEffect, useRef, useState } from "react"

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

const resetCardPosition = (card : CardInHand) => {
  card.posX = 0
  card.posY = 0
  card.tilt = 0
  card.zInd = 0
}

const shiftAllCards = (cards : CardInHand[]) => cards.forEach( card => card.realPos++ )

const repositionCards = (cards : CardInHand[], handAtributes : GameHandAtributes, currentIndex : number) => {
  const numberOfCards = (cards.length > handAtributes.maxCardsInHand - 1) ? handAtributes.maxCardsInHand : cards.length
  if (numberOfCards === 1) {
    resetCardPosition( cards[0] )
    return
  }

  const max_offsetX = (( numberOfCards - 1 ) / 2) * handAtributes.offsetByCard
  const max_offsetY = ( handAtributes.maxOffsetY * numberOfCards / handAtributes.maxCardsInHand )

  cards.forEach( card => {
    console.log("de cada carta ", card.realPos)
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
    }

    else if (card.realPos >= currentIndex + handAtributes.maxCardsInHand) {
      const currentPos = card.realPos - currentIndex

      const inclination = 90
      const offsetX = max_offsetX + handAtributes.offsetByCard
      const offsetY = max_offsetY * Math.pow(Math.floor(Math.abs(currentPos - (numberOfCards - 1)/2)), 2) / Math.pow((numberOfCards - 1)/2, 2)
      const zIndex = 10 + card.realPos

      card.posX = offsetX
      card.posY = offsetY
      card.tilt = inclination
      card.zInd = zIndex
    }

    else {
      const currentPos = card.realPos - currentIndex

      const inclination = -(handAtributes.maxDegrees/2) + handAtributes.maxDegrees * currentPos / (numberOfCards - 1)
      const offsetX = -(max_offsetX) + (max_offsetX * 2) * currentPos / (numberOfCards - 1)
      const offsetY = max_offsetY * Math.pow(Math.floor(Math.abs(currentPos - (numberOfCards - 1)/2)), 2) / Math.pow((numberOfCards - 1)/2, 2)
      const zIndex = 10 + card.realPos

      card.posX = offsetX
      card.posY = offsetY
      card.tilt = inclination
      card.zInd = zIndex
    }
  })
}

const shiftValues = (cards : CardInHand[], index : number, wantedIndex : number) => {
  const changeCard = cards.find(card => card.realPos == wantedIndex)
  if (changeCard == null) return
  changeCard.realPos = cards[index].realPos
  cards[index].realPos = wantedIndex
}

let lastDraggedIndex : (number) = 0
let pickedCardIndex : (number) = 0

export default function useHandCards( initialAtributes : GameHandAtributes ) {
  const [cardList, setNewCardList] = useState<CardInHand[]>([])
  const [cardMoving, setCardMoving] = useState(false)
  
  const cooldownScroll = useRef(false)
  const currentIndex = useRef(0)

  useEffect(() => {
    const handleScroll = (event : WheelEvent) => {
      event.preventDefault
      if (cooldownScroll.current) return
      if (cardList.length <= initialAtributes.maxCardsInHand) return

      currentIndex.current = currentIndex.current + Math.sign(event.deltaY)
      if (currentIndex.current < 0) {
        currentIndex.current = 0
        return
      }
      if (currentIndex.current + initialAtributes.maxCardsInHand > cardList.length) {
        currentIndex.current -= 1
        return
      }

      const newCardList = structuredClone(cardList)
      repositionCards(newCardList, initialAtributes, currentIndex.current)
      setNewCardList(newCardList)
      
      cooldownScroll.current = true
      setTimeout(() => {
        cooldownScroll.current = false
      }, 100)
    }

    window.addEventListener('wheel', handleScroll)

    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [cardList])

  const handleDragStart = (e : React.DragEvent<HTMLDivElement>, index : number) => {
    
    const renewedList = structuredClone(cardList)
    setNewCardList(renewedList)

    // Hide the shadow of the dragged element
    e.dataTransfer.setDragImage(e.target as Element, window.outerWidth * 2, window.outerHeight * 2);

    console.log("picked card index: ", index)
    console.log("picked card index: ", cardList[index].realPos)
    lastDraggedIndex = index
    pickedCardIndex = index

    setCardMoving(true)
  };

  const handleDragOver = (e : React.DragEvent<HTMLDivElement>, index : number) => {
    e.preventDefault();
    if (cardList[lastDraggedIndex].realPos === index) return
    
    const renewedList = structuredClone(cardList)
    shiftValues( renewedList, pickedCardIndex, index )
    repositionCards( renewedList, initialAtributes, currentIndex.current )
    
    setNewCardList( renewedList )
    lastDraggedIndex = renewedList[index].realPos
  }
  
  const handleDrop = (e : React.DragEvent<HTMLDivElement>) => {
    console.log("llamada")
    e.preventDefault()
    setCardMoving(false)
  };

  const addNewCard = ( newCard : CardInHand ) => {
    const newCardList = structuredClone(cardList)
    
    newCard.realPos = cardList.length

    newCardList.push(newCard)

    repositionCards( newCardList, initialAtributes, currentIndex.current )
    setNewCardList( newCardList )
  }

  const addNewCardLeft = ( newCard : CardInHand ) => {
    const newCardList = structuredClone(cardList)
    
    shiftAllCards(newCardList)
    newCard.realPos = 0

    newCardList.push(newCard)

    repositionCards( newCardList, initialAtributes, currentIndex.current )
    setNewCardList( newCardList )
  }

  return {handleDragStart, handleDragOver, handleDrop, addNewCard, addNewCardLeft, cardList, cardMoving, currentIndex : currentIndex.current}
}