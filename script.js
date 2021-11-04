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
        dictionary[word].splice(dictionary[word].indexOf(unnecessaryTranslation), 1)

        WordsStor.resetDictionaryInLocalStorage(dictionary)
    },

    deleteWordOrTranslation(word, translation){
        if( dictionaryWords.includes(word) ){
            if( dictionary[word].includes(translation) ){
                this.deleteTranslationOfWord(word, translation)
            }else if( translation === '' ){
                this.deleteWord(checkResult.indexOfWordInDictionary)
            }else{
                console.log('Word has not such translation')
                // in the future, a user will see message whit this information
            }
        }else{
            console.log('Dictionary has not this word')
            // in the future, a user will see message whit this information
        }
    }
}

// SETTING

const Settings = {
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
        addThisButton(WrittenWord, WrittenTranslation){
        },
        deleteThisButton(WrittenWord, WrittenTranslation){
        }
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

if(localStorage.propertyIsEnumerable('dictionaryJSON')){//YES
    dictionary = {...WordsStor.getDictionaryFromLocalStorage()}
    dictionaryWords = Object.keys(dictionary)
}