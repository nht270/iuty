const API_KEY = '/nUjsj0bp2bAB+uhKy4j6A==viEe74dB3Ci2tNhM'
const QUOTE_ENDPOINT = 'https://api.api-ninjas.com/v1/quotes'
const DEFAULT_QUOTE_CATEGORY = 'happiness'
const LIGHT_THEME_ICON = 'sun_3d.png'
const DARK_THEME_ICON = 'full_moon_3d.png'

const quoteCategories = [
    "age",
    "alone",
    "amazing",
    "anger",
    "architecture",
    "art",
    "attitude",
    "beauty",
    "best",
    "birthday",
    "business",
    "car",
    "change",
    "communications",
    "computers",
    "cool",
    "courage",
    "dad",
    "dating",
    "death",
    "design",
    "dreams",
    "education",
    "environmental",
    "equality",
    "experience",
    "failure",
    "faith",
    "family",
    "famous",
    "fear",
    "fitness",
    "food",
    "forgiveness",
    "freedom",
    "friendship",
    "funny",
    "future",
    "god",
    "good",
    "government",
    "graduation",
    "great",
    "happiness",
    "health",
    "history",
    "home",
    "hope",
    "humor",
    "imagination",
    "inspirational",
    "intelligence",
    "jealousy",
    "knowledge",
    "leadership",
    "learning",
    "legal",
    "life",
    "love",
    "marriage",
    "medical",
    "men",
    "mom",
    "money",
    "morning",
    "movies",
    "success"
]

const themes = {
    light: {
        '--background-color': '#ffffff',
        '--quote-shadow': 'rgba(0,0,0,0.14)',
        '--text-color': '#242424'
    },
    dark: {
        '--background-color': '#292929',
        '--quote-shadow': 'rgba(0,0,0,0.28)',
        '--text-color': '#ffffff'
    }
}

async function getQuote(category = DEFAULT_QUOTE_CATEGORY) {

    const quoteUrl = new URL(QUOTE_ENDPOINT)
    if (quoteCategories.includes(category)) {
        quoteUrl.searchParams.set('category', category)
    } else {
        quoteUrl.searchParams.set('category', DEFAULT_QUOTE_CATEGORY)
    }

    const response = await fetch(
        quoteUrl,
        {
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': API_KEY
            }
        }
    )
    const [quote] = await response.json()
    return quote
}

function updateDataQuoteElement(quoteElement, data) {
    const quoteTextElement = quoteElement.querySelector('.quote__text')
    const quoteAuthorElement = quoteElement.querySelector('.quote__author')
    quoteTextElement.innerHTML = data.quote
    quoteAuthorElement.innerHTML = data.author
}

function loadTheme(themeName = 'light') {
    const theme = themes[themeName]
    for (let prop in theme) {
        document.body.style.setProperty(prop, theme[prop])
    }
}

window.addEventListener('load', () => {
    const screen = document.querySelector('.screen')
    const quote = document.querySelector('.quote')
    const reloadButton = document.querySelector('button.reload-btn')
    const categorySelect = document.querySelector('select#quote-category')
    const themeButton = document.querySelector('button.change-theme-btn')

    // first load
    reloadButton.innerHTML = '?Wait a minute'
    getQuote().then(data => {
        reloadButton.innerHTML = 'Click here'
        updateDataQuoteElement(quote, data)
    })

    themeButton.addEventListener('click', (e) => {
        e.stopImmediatePropagation()
        const themeButtonIcon = themeButton.querySelector('img')
        if (themeButtonIcon.src.includes(LIGHT_THEME_ICON)) {
            themeButtonIcon.src = themeButtonIcon.src.replace(LIGHT_THEME_ICON, DARK_THEME_ICON)
            loadTheme('dark')
        } else {
            themeButtonIcon.src = themeButtonIcon.src.replace(DARK_THEME_ICON, LIGHT_THEME_ICON)
            loadTheme('light')
        }
    })

    reloadButton.addEventListener('click', async (e) => {
        e.stopPropagation()
        reloadButton.innerHTML = '?Wait a minute'
        const data = await getQuote(categorySelect.value)
        reloadButton.innerHTML = 'Click here'
        updateDataQuoteElement(quote, data)
    })

    quote.addEventListener('click', (e) => e.stopImmediatePropagation())

    screen.addEventListener('click', async (e) => {
        const { clientX: x, clientY: y } = e
        const [{ width: quoteWidth, height: quoteHeight }] = quote.getClientRects()
        const offsetHeight = window.innerHeight - y < quoteHeight ? quoteHeight : 0
        const offsetWidth = window.innerWidth - x < quoteWidth
            ? (x - quoteWidth < 0) ? (quoteWidth - window.innerWidth) / 2 + x : quoteWidth
            : 0
        quote.style.left = `${x - offsetWidth}px`
        quote.style.top = `${y - offsetHeight}px`
    })
})