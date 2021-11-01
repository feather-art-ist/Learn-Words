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