// ---- Inline Edit + Save ----
document.querySelectorAll('.edit-button').forEach(button => {
    button.addEventListener('click', () => {
        const card = button.closest('.quote-card')
        card.querySelector('.quote-text').classList.add('hidden')
        card.querySelector('.quote-actions').classList.add('hidden')
        card.querySelector('.edit-form').classList.remove('hidden')
    })
})

document.querySelectorAll('.cancel-button').forEach(button => {
    button.addEventListener('click', () => {
        const card = button.closest('.quote-card')
        card.querySelector('.quote-text').classList.remove('hidden')
        card.querySelector('.quote-actions').classList.remove('hidden')
        card.querySelector('.edit-form').classList.add('hidden')
    })
})

document.querySelectorAll('.save-button').forEach(button => {
    button.addEventListener('click', async () => {
        const card = button.closest('.quote-card')
        const id = card.dataset.id
        const name = card.querySelector('.edit-name').value.trim()
        const quote = card.querySelector('.edit-quote').value.trim()

        const res = await fetch(`/quotes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, quote })
        })

        const data = await res.json()
        alert(data.message)
        window.location.reload()
    })
})

// ---- Delete Button ----
document.querySelectorAll('.delete-button').forEach(button => {
    button.addEventListener('click', async () => {
        const card = button.closest('.quote-card')
        const id = card.dataset.id

        if (!confirm('Are you sure you want to delete this quote?')) return

        const res = await fetch(`/quotes/${id}`, {
            method: 'DELETE'
        })

        const data = await res.json()
        alert(data.message)
        window.location.reload()
    })
})
