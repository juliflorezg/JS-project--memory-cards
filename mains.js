const $ = selector => document.querySelector(selector)

const $cardsContainer = $('#cards-container')
const $prevBtn = $('#prev')
const $nextBtn = $('#next')
const $currentEl = $('#current')
const $showBtn = $('#show')
const $hideBtn = $('#hide')
const $questionEl = $('#question')
const $answerEl = $('#answer')
const $addCardBtn = $('#add-card')
const $clearBtn = $('#clear')
const $addContainer = $('#add-container')
// const $ = $('')

// Keep track of current card
let currentActiveCard = 0

// Store DOM cards
const cardsEl = []

// Store card data
const cardsData = getCardsData()

// const cardsData = [
// 	{
// 		question: 'What must a variable begin with?',
// 		answer: 'A letter, $ or _',
// 	},
// 	{
// 		question: 'What is a variable?',
// 		answer: 'Container for a piece of data',
// 	},
// 	{
// 		question: 'Example of Case Sensitive Variable',
// 		answer: 'thisIsAVariable',
// 	},
// 	{
// 		question: 'What is React JS?',
// 		answer: 'A JavaScript library for the frontend',
// 	},
// 	{
// 		question: 'What kind of programming uses React JS?',
// 		answer: 'Declarative programming',
// 	},
// ]

// Create all cards
function createCards() {
	cardsData.forEach((data, index) => createCard(data, index))
}

// Create single card
function createCard(data, index) {
	const card = document.createElement('div')
	card.classList.add('card')

	if (index === 0) card.classList.add('active')

	card.innerHTML = `
  <div class="inner-card">
    <div class="inner-card-front">
      <p>${data.question}</p>
    </div>
    <div class="inner-card-back">
      <p>${data.answer}</p>
    </div>
  </div>
  `
	card.addEventListener('click', () => card.classList.toggle('show-answer'))

	// add single card to DOM cards array
	cardsEl.push(card)

	$cardsContainer.appendChild(card)

	updateCurrentText()
}

// Show current number of cards
function updateCurrentText() {
	$currentEl.innerText = `${currentActiveCard + 1} / ${cardsEl.length}`
}

function getCardsData() {
	const cards = JSON.parse(localStorage.getItem('cards'))
	return cards === null ? [] : cards
}

// Add card to local storage
function setCardsData(cards) {
	localStorage.setItem('cards', JSON.stringify(cards))
	window.location.reload()
}

createCards()

//? Adding event listeners for buttons

// next button
$nextBtn.addEventListener('click', () => {
	cardsEl[currentActiveCard].className = 'card left'
	// cardsEl[currentActiveCard].classList.toggle('left')

	currentActiveCard = currentActiveCard + 1

	// if(currentActiveCard > cardsEl.length - 1) currentActiveCard = cardsEl.length-1

	// conditional for checking if we have reached the end of the cards, if so, then reset to the first one, so it starts again
	if (currentActiveCard > cardsEl.length - 1) {
		currentActiveCard = 0

		//* When we get to the end of the cards, reset the classes for all the cards to 'card' (this allows to keep seeing the animation so it comes from right to left)
		for (let i = 0; i < cardsEl.length; i++) {
			cardsEl[i].className = 'card'
		}
		// cardsEl[currentActiveCard].className = ''
	}

	cardsEl[currentActiveCard].className = 'card active'
	// cardsEl[currentActiveCard].classList.toggle('active')

	updateCurrentText()
})

// previous button
$prevBtn.addEventListener('click', () => {
	cardsEl[currentActiveCard].className = 'card'
	// cardsEl[currentActiveCard].classList.toggle('left')

	currentActiveCard = currentActiveCard - 1

	// if(currentActiveCard > cardsEl.length - 1) currentActiveCard = cardsEl.length-1

	// When we get to the start, we want to go back again from the last one to keep seeing the cards
	if (currentActiveCard < 0) {
		currentActiveCard = cardsEl.length - 1
		// This for loop resets the class name to 'card left' so the cards keep coming from left to right
		for (let i = 0; i < cardsEl.length; i++) {
			cardsEl[i].className = 'card left'
		}
		// cardsEl[currentActiveCard].className = ''
	}

	cardsEl[currentActiveCard].className = 'card active'
	// cardsEl[currentActiveCard].classList.toggle('active')

	updateCurrentText()
})

// Show button event listener
$showBtn.addEventListener('click', () => $addContainer.classList.add('show'))

// Hide button event listener
$hideBtn.addEventListener('click', () => $addContainer.classList.remove('show'))

// function for adding a new card
$addCardBtn.addEventListener('click', () => {
	const question = $questionEl.value
	const answer = $answerEl.value

	console.log(question, answer)
	console.log(question.trim())

	if (question.trim() && answer.trim()) {
		const newCard = { question, answer }

		createCard(newCard)

		$questionEl.value = ''
		$answerEl.value = ''

		$addContainer.classList.remove('show')
		cardsData.push(newCard)

		setCardsData(cardsData)
	} else {
		const error = document.createElement('p')
		error.classList.add('error')
		error.innerText = 'You must write a question an its answer'

		if (!$addContainer.querySelector('.error')) {
			$addContainer.appendChild(error)
		} else {
			$addContainer.querySelector('.error').style.color = 'red'
		}
	}
})

// Clear cards button
$clearBtn.addEventListener('click', () => {
	// localStorage.clear()
	localStorage.removeItem('cards')
	$cardsContainer.innerHTML = ''
	window.location.reload()
})
