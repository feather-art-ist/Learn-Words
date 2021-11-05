// VIEW

const Theme = {
    now: 'light',
    changeTheme(){
        switch (this.now) {
            case 'light':
                document.head.querySelector('link').href = 'styleDark.css'
                document.querySelector('.themeIcon').src = 'img/sun.png'
                this.now = 'dark'
            break;
        
            case 'dark':
                document.head.querySelector('link').href = 'styleLight.css'
                document.querySelector('.themeIcon').src = 'img/moon.png'
                this.now = 'light'
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

// GAME

let dictionary = {}
//  dictionary {
//      word: ['array', 'with', 'translations', 'of', 'word'],
//      nextWord:  [...]
//      ...
//  }

let dictionaryWords = []
//  ['word', 'nextWord', ... , 'lastWord']

const DictionaryMethods = {

    addNewWord(newWord, newTranslation){
        dictionary[newWord] = [newTranslation]

        WordsStor.resetDictionaryInLocalStorage(dictionary)
        dictionaryWords = Object.keys(dictionary)
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
    }
}

// SETTING

const Settings = {
    pathHTML: document.forms[0],

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


// START GAME

if(localStorage.propertyIsEnumerable('dictionaryJSON')){
    dictionary = {...WordsStor.getDictionaryFromLocalStorage()}
    dictionaryWords = Object.keys(dictionary)
}

Settings.pathHTML.addEventListener('click', (e) => {
    switch (e.target) {
        case Settings.pathHTML.addThis:
            Settings.buttons.addThis()
            break;
    
        case Settings.pathHTML.deleteThis:
            Settings.buttons.deleteThis()
            break;
    }
})