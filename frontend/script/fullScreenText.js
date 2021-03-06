// const fullScreenTextInputElem = () =>
//   document.getElementById('fullScreenTextInput')

const FST_LOCAL_STORAGE = 'fullScreenTextList'

const initFullScreenTextElem = () => {
  const container = document.createElement('div')
  container.setAttribute('id', 'fullScreenText')
  app().append(container)
}

const updateFullScreenTextList = () => {
  const fullScreenTextListElem = document.getElementById('fullScreenTextList')
  fullScreenTextListElem.innerHTML = ''
  const fullScreenTextList = fullScreenText.renderTextList()
  fullScreenTextListElem.append(fullScreenTextList)
}

const fetchFullScreenTextList = () => {
  // Get full screen text from local storage
  const localStorage = window.localStorage
  const fullScreenTextList = localStorage.getItem(FST_LOCAL_STORAGE)
  if (fullScreenTextList == null) {
    return []
  }
  return JSON.parse(fullScreenTextList)
}

const cleanFullScreenTextList = () => {
  const localStorage = window.localStorage
  localStorage.removeItem(FST_LOCAL_STORAGE)
  updateFullScreenTextList()
}

/**
 * @namespace
 * @description Full screen text component
 * @property {string} name - Name of this component
 */
const fullScreenText = {
  name: 'fullScreenText',
  timer: '',
  practiceInterval: 30,
  thisElem: function () {
    return document.getElementById(`${this.name}`)
  },
  popUpElem: function () {
    return document.getElementById(`${this.name}Popup`)
  },
  inputElem: function () {
    return document.getElementById(`${this.name}Input`)
  },

  /**
   * Init this component
   */
  init: function () {
    // Empty parent element
    this.thisElem().innerHTML = ''
    // Create container
    const container = document.createElement('div')
    // Create html element with required ids
    container.innerHTML = `
    <input id="${this.name}Input">
    <button onclick="${this.name}.appendToList()">Add</button>
    <button onclick='cleanFullScreenTextList()'>Clean List</button>
    <div id="fullScreenTextList">
    </div>
    `
    // Append container
    this.thisElem().append(container)
    // Call function to insert content
    updateFullScreenTextList()
    fullScreenText.clearCountdown()
  },

  appendToList: function () {
    // Save user input to local storage
    const localStorage = window.localStorage
    const fullScreenTextList = fetchFullScreenTextList()

    // Get user input and form local storage list item
    const userInput = this.inputElem().value
    const fullScreenTextItem = {
      text: userInput,
      practiced: 0,
    }

    // Save fullScreenTextList to local storage as a string
    fullScreenTextList.push(fullScreenTextItem)
    const fullScreenTextListStr = JSON.stringify(fullScreenTextList)
    localStorage.setItem(FST_LOCAL_STORAGE, fullScreenTextListStr)
    updateFullScreenTextList()
  },

  renderTextList: function () {
    // Render full screen text to HTML list elements
    const container = document.createElement('ul')
    const fullScreenTextList = fetchFullScreenTextList()
    fullScreenTextList.forEach((textItem) => {
      const textItemElem = document.createElement('li')
      const text = textItem.text
      textItemElem.setAttribute(
        'onclick',
        `${this.name}.renderTextItem('${text}')`
      )
      textItemElem.innerHTML = `
      <b>${text}</b>
      <p>Practiced: ${textItem.practiced}</p>
      `
      container.append(textItemElem)
    })
    return container
  },

  renderTextItem: function (text) {
    const container = document.createElement('div')
    this.thisElem().innerHTML = ''
    container.innerHTML = `
    <h1>${text}</h1>
    <button onclick='fullScreenText.init()'>Back</button>
    `
    this.thisElem().append(container)
    fullScreenText.initCountdown()
  },

  initCountdown: function () {
    console.log('initCountdown')
    // The bind(this) is required for call back functions
    this.timer = setTimeout(
      this.showPopup.bind(this),
      this.practiceInterval * 60 * 1000
    )
  },

  clearCountdown: function () {
    clearTimeout(this.timer)
  },

  showPopup: function () {
    // Empty parent element
    // Create container
    const container = document.createElement('div')
    container.setAttribute('id', `${this.name}Popup`)
    container.setAttribute(
      'style',
      `width:100vw; 
      height:100vh; 
      position:absolute; 
      padding:2rem; 
      top:0; 
      left:0; 
      background:#fec4d0`
    )
    // Create html element with required ids
    const content = `
    <h1 onclick="${this.name}.removePopup()">Time to practice</h1>
    `
    // Append container
    container.innerHTML = content
    app().append(container)
    // Call function to insert content
  },

  removePopup: function () {
    this.popUpElem().outerHTML = ''
    this.initCountdown()
  },

  countUpPractice: function () {},
}

initFullScreenTextElem()
