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

let Dictionary = {}
//  Dictionary {
//      0: {
//          word: 'word user is learning',
//          translation: ['array', 'with', 'translations', 'of', 'word']
//      }
//      1:  {...}
//      ...
//  }

const DictionaryMethods = {
    includes(word = '', translation = ''){

        // this method returns Object with three keys, where:
        //  - Object.DictionaryHasThisWord:
        //      - true if Dictionary has this word
        //      - false if Dictionary hasn't this word
        //  - Object.indexOfWordInDictionary:
        //      - key of this word in Dictionary if Dictionary has this word
        //      - false if Dictionary hasn't this word
        //  - Object.wordHasSuchTranslation:
        //      - true if this word was found and one has this translation
        //      - false if this word wasn't found or one hasn't such translation

        let answer = {
            DictionaryHasThisWord: false,
            indexOfWordInDictionary: false,
            wordHasSuchTranslation: false,
        }

        for(let key in Dictionary){
            if( Dictionary[key].word === word ){
                answer.DictionaryHasThisWord = true
                answer.indexOfWordInDictionary = key

                if( Dictionary[key].translation.includes(translation) ){
                    answer.wordHasSuchTranslation = true
                }
            }
        }

        return answer
    },

    getTheFirstFreeKey(){
        let i = 0

        for(let key in Dictionary){
            i++
        }

        return i
    },

    addNewWord(newWord, translation){
        let newKey = this.getTheFirstFreeKey()

        Dictionary[newKey] = {}
        Dictionary[newKey].word = newWord
        Dictionary[newKey].translation = [translation]

        WordsStor.resetDictionaryInLocalStorage(Dictionary)
    },

    addNewTranslationForOldWord(OldWordIndex, newTranslation){
        Dictionary[OldWordIndex].translation.push(newTranslation)

        WordsStor.resetDictionaryInLocalStorage(Dictionary)
    },

    newWordOrNewTranslation(word, translation){
        let checkResult = this.includes(word, translation)
        if(checkResult.DictionaryHasThisWord){
            if(checkResult.wordHasSuchTranslation){
                console.log('Dictionary already has this word with such translation') // in the future, a user will see message whit this information
            }else{
                this.addNewTranslationForOldWord(checkResult.indexOfWordInDictionary, translation)
            }
        }else{
            this.addNewWord(word, translation)
        }
    },

    deleteWord(key){
        delete Dictionary[key]

        WordsStor.resetDictionaryInLocalStorage(Dictionary)
    },

    deleteTranslationOfWord(key, unnecessaryTranslation){
        let indexOfUnnecessaryTranslation = Dictionary[key].translation.indexOf(unnecessaryTranslation)
        Dictionary[key].translation.splice(indexOfUnnecessaryTranslation, 1)

        WordsStor.resetDictionaryInLocalStorage(Dictionary)
    },

    deleteWordOrTranslation(word, translation){
        let checkResult = this.includes(word, translation)
        if(checkResult.DictionaryHasThisWord){
            if(checkResult.wordHasSuchTranslation){
                this.deleteTranslationOfWord(checkResult.indexOfWordInDictionary, translation)
            }else if(translation === ''){
                this.deleteWord(checkResult.indexOfWordInDictionary)
            }else{
                console.log('Word has not such translation') // in the future, a user will see message whit this information
            }
        }else{
            console.log('Dictionary has not this word') // in the future, a user will see message whit this information
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
        addThisButton(){
        },
        deleteThisButton(){
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

if(localStorage.propertyIsEnumerable('dictionaryJSON')){
    Dictionary = {...WordsStor.getDictionaryFromLocalStorage()}
}