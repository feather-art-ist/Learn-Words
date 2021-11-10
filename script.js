// VIEW

const Theme = {
    now: 'light',
    changeTheme(){
        switch (this.now) {
            case 'light':
                document.head.querySelector('link').href = 'styleDark.css'
                document.querySelector('.themeIcon').src = 'img/sun.png'
                this.now = 'dark'
                localStorage.setItem('theme', 'dark')
            break;
        
            case 'dark':
                document.head.querySelector('link').href = 'styleLight.css'
                document.querySelector('.themeIcon').src = 'img/moon.png'
                this.now = 'light'
                localStorage.setItem('theme', 'light')
            break;
        }
    }
}

const UserView = {
    getHightOfSettingModule(){
        return parseInt(getComputedStyle(document.querySelector('.settings')).height)
    },
    showSettings(){
        window.scroll(0, this.getHightOfSettingModule())
    }
}

// STANDARD TOOLS

const Tools = {
    getRandomNum(fromNum, toNum){
        toNum++
        return (Math.floor(Math.random() * (toNum - fromNum))) + fromNum
    }
}

// DICTIONARY

let dictionary = {}
//  dictionary {
//      word: ['array', 'with', 'translations', 'of', 'word'],
//      nextWord:  [...]
//      ...
//  }

let dictionaryWords = []
//  ['word', 'nextWord', ... , 'lastWord']

const DictionaryMethods = {

    // Methods for settings

    addNewWord(newWord, newTranslation){
        dictionary[newWord] = [newTranslation]

        WordsStor.resetDictionaryInLocalStorage(dictionary)
        dictionaryWords = Object.keys(dictionary)

        Settings.inputs.resetWordInputValue()           //=====================================temp !!!
        Settings.inputs.resetTranslationInputValue()    //=====================================temp !!!
    },

    addNewTranslationForOldWord(OldWord, newTranslation){
        dictionary[OldWord].push(newTranslation)

        WordsStor.resetDictionaryInLocalStorage(dictionary)
    },

    newWordOrNewTranslation(word, translation){
        if( dictionaryWords.includes(word) ){
            if( dictionary[word].includes(translation) ){
                console.log('Dictionary already has this word with such translation')
                // in the future, a user will see message whit this information
            }else{
                this.addNewTranslationForOldWord(word, translation)
            }
        }else{
            this.addNewWord(word, translation)
        }
    },

    deleteWord(word){
        delete dictionary[word]

        WordsStor.resetDictionaryInLocalStorage(dictionary)
        dictionaryWords = Object.keys(dictionary)
    },

    deleteTranslationOfWord(word, unnecessaryTranslation){
        if( dictionary[word].length > 1 ){
            dictionary[word].splice(dictionary[word].indexOf(unnecessaryTranslation), 1)

            WordsStor.resetDictionaryInLocalStorage(dictionary)
        }else{
            console.log('You cannot delete the last translation of this word')
            // in the future, a user will see message whit this information
        }
    },

    deleteWordOrTranslation(word, translation){
        if( dictionaryWords.includes(word) ){
            if( dictionary[word].includes(translation) ){
                this.deleteTranslationOfWord(word, translation)
            }else if( translation === '' ){
                this.deleteWord(word)
            }else{
                console.log('Word does not have such translation')
                // in the future, a user will see message whit this information
            }
        }else{
            console.log('Dictionary does not have this word')
            // in the future, a user will see message whit this information
        }
    },

    // Methods for game

    getRandomWordWithoutLast(){
        return dictionaryWords[Tools.getRandomNum(0, dictionaryWords.length-2)]
    },

    moveWordInRoundToEnd(word){
        dictionaryWords.splice(dictionaryWords.indexOf(word), 1)
        dictionaryWords.push(word)
    },

    getRandomTranslationOfWord(word){
        let randomIndex = Tools.getRandomNum(0, dictionary[word].length - 1)
        let translation = dictionary[word][randomIndex]

        return translation
    }
}

// SETTING

const Settings = {
    node: document.forms[0],

    inputs: {
        wordInputValue(){
            return document.forms[0].enteredEnglishWord.value
        },
        translationInputValue(){
            return document.forms[0].enteredTranslation.value
        },
        resetWordInputValue(str = ''){
            document.forms[0].enteredEnglishWord.value = str
        },
        resetTranslationInputValue(str = ''){
            document.forms[0].enteredTranslation.value = str
        },
    },

    buttons: {
        addThis(word = Settings.inputs.wordInputValue(), translation = Settings.inputs.translationInputValue() ){
            Settings.checkWordBeforeAdding(word)
            .then(resultOfWordCheck => {
                if(resultOfWordCheck){
                    Settings.checkTranslationBeforeAdding(translation)
                    .then(resultOfTranslationCheck => {
                        if(resultOfTranslationCheck){
                            DictionaryMethods.newWordOrNewTranslation(word, translation)
                        }
                    })
                }
            })
        },
        deleteThis(){
            DictionaryMethods.deleteWordOrTranslation(
                Settings.inputs.wordInputValue(),
                Settings.inputs.translationInputValue()
            )
        }
    },

    checkWordBeforeAdding(word){
        return new Promise(resolve => {
            let resultOfWordCheck
            if( word.trim() !== '' ){
                let charFromWord = word.trim().split('')

                resultOfWordCheck = !(charFromWord.some( char => !(isNaN(char * 1) || char === ' ') ))
                !resultOfWordCheck && console.log('Write a word without numbers')
            }else{
                console.log('Write something, the field for a word is empty')
                resultOfWordCheck = false
            }
            resolve(resultOfWordCheck)
        })
    },

    checkTranslationBeforeAdding(translation){
        return new Promise(resolve => {
            let resultOfTranslationCheck
            if( translation.trim() !== '' ){
                let charFromTranslation = translation.trim().split('')

                resultOfTranslationCheck = !(charFromTranslation.some( char => !(isNaN(char * 1) || char === ' ') ))
                !resultOfTranslationCheck && console.log('Write a translation without numbers')
            }else{
                console.log('Write something, the field for a translation is empty')
                resultOfTranslationCheck = false
            }
            resolve(resultOfTranslationCheck)
        })
    }
}

Settings.node.addEventListener('click', (e) => {
    switch (e.target) {
        case Settings.node.addThis:
            Settings.buttons.addThis()
            break;
    
        case Settings.node.deleteThis:
            Settings.buttons.deleteThis()
            break;
    }
})

// LOCAL_STORAGE

const WordsStor = {
    getDictionaryFromLocalStorage(){
        return JSON.parse(localStorage.getItem('dictionaryJSON'))
    },

    resetDictionaryInLocalStorage(dictionaryObject){
        localStorage.setItem( 'dictionaryJSON', JSON.stringify(dictionaryObject))
    },

    clear(){
        localStorage.clear() // this method there is for the future. User will be able to clear his localStore (his Dictionary)
    }
}

// GAME SECTION ON THE PAGE

const GameSection = {
    node: document.querySelector('.game'),

    getWordValue(){
        return document.querySelector('.word').firstChild.textContent
    },

    setWordValue(value){
        document.querySelector('.word').firstChild.innerHTML = value
    },

    optionsOfTranslationButtons: {
        first: {
            node: document.querySelector('.firstOptionOfTranslation'),
            getValue(){
                return this.node.textContent
            },
            setValue(value){
                this.node.firstChild.innerHTML = value
            },
            putRandomTranslationWithoutLast(){
                let wrongWord = DictionaryMethods.getRandomWordWithoutLast()
                this.setValue(DictionaryMethods.getRandomTranslationOfWord(wrongWord))
            }
        },
        second: {
            node: document.querySelector('.secondOptionOfTranslation'),
            getValue(){
                return this.node.textContent
            },
            setValue(value){
                this.node.firstChild.innerHTML = value
            },
            putRandomTranslationWithoutLast(){
                let wrongWord = DictionaryMethods.getRandomWordWithoutLast()
                this.setValue(DictionaryMethods.getRandomTranslationOfWord(wrongWord))
            }
        },
        third: {
            node: document.querySelector('.thirdOptionOfTranslation'),
            getValue(){
                return this.node.textContent
            },
            setValue(value){
                this.node.firstChild.innerHTML = value
            },
            putRandomTranslationWithoutLast(){
                let wrongWord = DictionaryMethods.getRandomWordWithoutLast()
                this.setValue(DictionaryMethods.getRandomTranslationOfWord(wrongWord))
            }
        },

        backlightTime: 800,

        backlightForButton(orderNumber, color){
            switch(color){
                case 'green':
                    color = 'rgb(101, 161, 101)'
                break
                case 'red':
                    color = 'rgb(209, 106, 140)'
                break
            }

            let buttonNode
            let defaultColor

            switch(orderNumber){
                case 'first':
                    buttonNode = this.first.node
                    defaultColor = getComputedStyle(buttonNode).backgroundColor
                    buttonNode.style.backgroundColor = color
                    setTimeout(() => {
                        buttonNode.style.backgroundColor = defaultColor
                    }, this.backlightTime)
                break
                case 'second':
                    buttonNode = this.second.node
                    defaultColor = getComputedStyle(buttonNode).backgroundColor
                    buttonNode.style.backgroundColor = color
                    setTimeout(() => {
                        buttonNode.style.backgroundColor = defaultColor
                    }, this.backlightTime)
                break
                case 'third':
                    buttonNode = this.third.node
                    defaultColor = getComputedStyle(buttonNode).backgroundColor
                    buttonNode.style.backgroundColor = color
                    setTimeout(() => {
                        buttonNode.style.backgroundColor = defaultColor
                    }, this.backlightTime)
                break
            }
        }
    },

    skipWordButton: {
        node: document.querySelector('.skipWord'),
        pressed(){
            startGameRound()
        }
    },

    canPressGameButtons: true
}

// ACTIONS BEFORE GAME

if(localStorage.propertyIsEnumerable('dictionaryJSON')){
    dictionary = {...WordsStor.getDictionaryFromLocalStorage()}
    dictionaryWords = Object.keys(dictionary)
}

if(['light', 'dark'].includes(localStorage.getItem('theme'))){
    localStorage.getItem('theme') !== Theme.now && Theme.changeTheme()
}

// START GAME

GameSection.skipWordButton.node.addEventListener('click', () => {
    if(GameSection.canPressGameButtons){
        GameSection.skipWordButton.pressed()
    }
})

GameSection.node.addEventListener('click', (e) => {
    if(GameSection.canPressGameButtons){
        let translationsOfRoundWord = dictionary[GameSection.getWordValue()]

        switch(e.target){
            case GameSection.optionsOfTranslationButtons.first.node.firstChild:
            case GameSection.optionsOfTranslationButtons.first.node:
                if(translationsOfRoundWord.includes(GameSection.optionsOfTranslationButtons.first.getValue())){
                    GameSection.optionsOfTranslationButtons.backlightForButton('first', 'green')
                    GameSection.canPressGameButtons = false
                    setTimeout(startGameRound, GameSection.optionsOfTranslationButtons.backlightTime)
                }else{
                    GameSection.optionsOfTranslationButtons.backlightForButton('first', 'red')
                    GameSection.canPressGameButtons = false
                    setTimeout(() => GameSection.canPressGameButtons = true, GameSection.optionsOfTranslationButtons.backlightTime)
                }
            break
            case GameSection.optionsOfTranslationButtons.second.node.firstChild:
            case GameSection.optionsOfTranslationButtons.second.node:
                if(translationsOfRoundWord.includes(GameSection.optionsOfTranslationButtons.second.getValue())){
                    GameSection.optionsOfTranslationButtons.backlightForButton('second', 'green')
                    GameSection.canPressGameButtons = false
                    setTimeout(startGameRound, GameSection.optionsOfTranslationButtons.backlightTime)
                }else{
                    GameSection.optionsOfTranslationButtons.backlightForButton('second', 'red')
                    GameSection.canPressGameButtons = false
                    setTimeout(() => GameSection.canPressGameButtons = true, GameSection.optionsOfTranslationButtons.backlightTime)
                }
            break
            case GameSection.optionsOfTranslationButtons.third.node.firstChild:
            case GameSection.optionsOfTranslationButtons.third.node:
                if(translationsOfRoundWord.includes(GameSection.optionsOfTranslationButtons.third.getValue())){
                    GameSection.optionsOfTranslationButtons.backlightForButton('third', 'green')
                    GameSection.canPressGameButtons = false
                    setTimeout(startGameRound, GameSection.optionsOfTranslationButtons.backlightTime)
                }else{
                    GameSection.optionsOfTranslationButtons.backlightForButton('third', 'red')
                    GameSection.canPressGameButtons = false
                    setTimeout(() => GameSection.canPressGameButtons = true, GameSection.optionsOfTranslationButtons.backlightTime)
                }
            break
        }   
    }
 
})


function startGameRound(){
    let wordInGameRound = DictionaryMethods.getRandomWordWithoutLast()
    DictionaryMethods.moveWordInRoundToEnd(wordInGameRound)
    GameSection.setWordValue(wordInGameRound)

    let randomTranslationOfWord = DictionaryMethods.getRandomTranslationOfWord(wordInGameRound)
    let translationsOrder
    switch (Tools.getRandomNum(0, 2)) {
        case 0:
            translationsOrder = ['first', 'second', 'third']
        break;
        case 1:
            translationsOrder = ['third', 'first', 'second']
        break;
        case 2:
            translationsOrder = ['second', 'third', 'first']
        break;
    }
    GameSection.optionsOfTranslationButtons[translationsOrder[0]].setValue(randomTranslationOfWord)
    GameSection.optionsOfTranslationButtons[translationsOrder[1]].putRandomTranslationWithoutLast()
    GameSection.optionsOfTranslationButtons[translationsOrder[2]].putRandomTranslationWithoutLast()

    GameSection.canPressGameButtons = true
}

startGameRound()