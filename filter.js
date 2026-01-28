import fileOpener from './services/fetch.js'

const extension_container = document.querySelector('.extensionContainer')
const activeButton = document.querySelector('.activeButton')
const inactiveButton = document.querySelector('.inactiveButton')
const allButton = document.querySelector('.allButton')

filteredExt = []
extStatus = 'all'

function fetchNotes() {
    filteredExt = fileOpener()

    if (filteredExt.length === 0) {
        extension_container.innerHTML = '<p>No extensions available yet</p>'
        return
    }
}

function filterExtensionList() {
    switch (extStatus) {
        case 'inactive':
            filteredExt = filteredExt.filter(ext => !ext.isActive)
            break
        case 'active':
            filteredExt = filteredExt.filter(ext => ext.isActive)
            break
        default:
            break
    }
}

function renderNotes() {
    filterExtensionList()
}

function createCardElement() {
    const extensionCard = document.createElement('div')
    extensionCard.className = 'extension-card'

    filteredExt.forEach(extension => {
        const title = document.createElement('p')
        const button = document.createElement('button')
        const icon = document.createElement('img')

        title.textContent = extension.name
        button.innerHTML = 'Remove'
        icon.src = extension.logo
        icon.alt = extension.description

        extensionCard.append(title)
        extensionCard.append(icon)
        extensionCard.append(button)

        extension_container.append(extensionCard)
    })
}

inactiveButton.