import fileOpener from './services/fetch.js'

const extensionContainer = document.querySelector('#extensionContainer')
const filterButtons = document.querySelectorAll('.filter-btn')
let extensionsData = []
let currentFilter = 'all'

// Initialize the app
async function init() {
    try {
        extensionsData = await fileOpener()
        renderExtensions(extensionsData)
        setupFilterButtons()
    } catch (err) {
        console.error('Failed to load extensions:', err)
        extensionContainer.innerHTML = '<p style="color: var(--text-secondary);">Failed to load extensions. Please refresh the page.</p>'
    }
}

// Render extensions based on current filter
function renderExtensions(extensions) {
    const filtered = filterExtensions(extensions)
    extensionContainer.innerHTML = ''

    if (filtered.length === 0) {
        extensionContainer.innerHTML = '<p style="color: var(--text-secondary); grid-column: 1 / -1; text-align: center; padding: 40px;">No extensions found.</p>'
        return
    }

    filtered.forEach((extension) => {
        const originalIndex = extensionsData.indexOf(extension)
        const card = createExtensionCard(extension, originalIndex)
        extensionContainer.appendChild(card)
    })
}

// Filter extensions based on current filter
function filterExtensions(extensions) {
    switch (currentFilter) {
        case 'active':
            return extensions.filter(ext => ext.isActive)
        case 'inactive':
            return extensions.filter(ext => !ext.isActive)
        default:
            return extensions
    }
}

// Create extension card element
function createExtensionCard(extension, index) {
    const card = document.createElement('div')
    card.className = 'extension-card'
    card.dataset.index = index

    // Card header with icon and info
    const cardHeader = document.createElement('div')
    cardHeader.className = 'extension-card__header'

    const iconWrapper = document.createElement('div')
    iconWrapper.className = 'extension-card__icon'
    const iconImg = document.createElement('img')
    iconImg.src = extension.logo
    iconImg.alt = `${extension.name} icon`
    iconWrapper.appendChild(iconImg)

    const cardInfo = document.createElement('div')
    cardInfo.className = 'extension-card__info'

    const title = document.createElement('h3')
    title.className = 'extension-card__title'
    title.textContent = extension.name

    const description = document.createElement('p')
    description.className = 'extension-card__description'
    description.textContent = extension.description

    cardInfo.appendChild(title)
    cardInfo.appendChild(description)

    cardHeader.appendChild(iconWrapper)
    cardHeader.appendChild(cardInfo)

    // Card footer with remove button and toggle
    const cardFooter = document.createElement('div')
    cardFooter.className = 'extension-card__footer'

    const removeBtn = document.createElement('button')
    removeBtn.className = 'extension-card__remove-btn'
    removeBtn.textContent = 'Remove'
    removeBtn.type = 'button'
    removeBtn.addEventListener('click', () => handleRemove(index))

    const toggleWrapper = document.createElement('div')
    toggleWrapper.className = 'extension-card__toggle'

    const toggleSwitch = document.createElement('label')
    toggleSwitch.className = 'toggle'

    const toggleInput = document.createElement('input')
    toggleInput.type = 'checkbox'
    toggleInput.className = 'toggle__input'
    toggleInput.checked = extension.isActive
    toggleInput.setAttribute('aria-label', `Toggle ${extension.name}`)
    toggleInput.addEventListener('change', () => handleToggle(index))

    const toggleSlider = document.createElement('span')
    toggleSlider.className = 'toggle__slider'

    toggleSwitch.appendChild(toggleInput)
    toggleSwitch.appendChild(toggleSlider)
    toggleWrapper.appendChild(toggleSwitch)

    cardFooter.appendChild(removeBtn)
    cardFooter.appendChild(toggleWrapper)

    // Assemble card
    card.appendChild(cardHeader)
    card.appendChild(cardFooter)

    return card
}

// Handle toggle switch change
function handleToggle(index) {
    const extension = extensionsData[index]
    extension.isActive = !extension.isActive

    // Re-render if current filter would hide/show this card
    if (currentFilter !== 'all') {
        renderExtensions(extensionsData)
    }
}

// Handle remove button click
function handleRemove(index) {
    if (confirm(`Are you sure you want to remove "${extensionsData[index].name}"?`)) {
        extensionsData.splice(index, 1)
        renderExtensions(extensionsData)
    }
}

// Setup filter button event listeners
function setupFilterButtons() {
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('filter-btn--active'))
            btn.classList.add('filter-btn--active')

            // Update filter
            currentFilter = btn.dataset.filter
            renderExtensions(extensionsData)
        })
    })
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
} else {
    init()
}
