// your code here, it may be worth it to ensure this file only runs AFTER the dom has loaded.
const getElement = (element) => document.querySelector(element)
const makeElement = (element, elClass = "" ) => { 
    el = document.createElement(element)
    el.classList = elClass
    return el
}

const caloriesURL = "http://localhost:3000/api/v1/calorie_entries/"

document.addEventListener("DOMContentLoaded", () => {

    const calorieForm = getElement("#new-calorie-form")
    const caloriesList = getElement("#calories-list")
    const progressBar = getElement(".uk-progress")
    let totalCals = 0

    const getAndRenderListItems = (url) => {
        fetch(url)
            .then( resp => resp.json() )
            .then( renderLIs )
    }

    // render LIs for all items in database
    const renderLIs = (items) => {
        totalCals = 0
        caloriesList.innerHTML = ""
        for(const item of items ){
            createLI(item)
        }
    }

    // create individual LI and add to the beginning of the list
    const createLI = (item) => {
        const { calorie, note } = item
        // update progress bar with cals
        totalCals += calorie
        progressBar.value = totalCals

        // create show element
        const li = makeElement("li", "calories-list-item")
        const liDiv = makeElement("div", "uk-grid")
        
        const calsDiv = makeElement("div", "uk-width-1-6")

        // calsDiv.innerHTML = `<strong>${calorie}</strong><span>kcal</span>`

        const cals = makeElement("STRONG")
        cals.innerText = calorie
        const span = makeElement("span")
        span.innerText = "kcal"
        calsDiv.append(cals, span)
        
        const notesDiv = makeElement("div", "uk-width-4-5")
        const notes = makeElement("em", "uk-text-meta")
        notes.innerText = note
        notesDiv.append(notes)
        
        liDiv.append(calsDiv, notesDiv)

        const buttonDiv = makeElement("div", "list-item-menu")
        const editButton = makeElement("a", "edit-button")
        editButton.setAttribute("uk-icon", "icon: pencil")
        editButton.setAttribute("uk-toggle", "target: #edit-form-container")
        const deleteButton = makeElement("a", "delete-button")
        deleteButton.setAttribute("uk-icon", "icon: trash")
        buttonDiv.append(editButton, deleteButton)

        li.append(liDiv, buttonDiv)

        caloriesList.prepend(li)

        createDeleteFunctionality(deleteButton, item)
        createEditFunctionality(editButton,item)
    }

    // create event listener for form and create new item in database

    calorieForm.addEventListener("submit", (e) => {
        e.preventDefault()
        let caloriesInput = calorieForm.querySelector("input").value
        let notesInput = calorieForm.querySelector("textarea").value
        
        const configObj = {
            method: "post",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({
                calorie: caloriesInput,
                note: notesInput
            })
        }
        fetch(caloriesURL, configObj)
            .then(resp => resp.json())
            .then( createLI )

        e.target.reset()
    })


    // delete item from db when click delete button
    // then reduce calorie bar by calories
    // then LI from list
    const createDeleteFunctionality = (button, item) => {
        button.addEventListener("click", () => {
            const { id, calorie } = item
            let li = button.closest(".calories-list-item")
            fetch(caloriesURL + id, { method: "delete" })
            .then( 
                totalCals -= calorie,
                progressBar.value = totalCals,
                li.remove()
             )
        })
    }
  
    const createEditFunctionality = (button, item) => {
        button.addEventListener("click", () => {
            const { id, calorie, note } = item
            const popUp = getElement("#edit-calorie-form")
            
            let editCals = popUp.querySelector(".uk-input")
            let editNotes = popUp.querySelector(".uk-textarea")

            editCals.value = calorie
            editNotes.value = note

            // debugger

            popUp.addEventListener("submit", (e) => {
                e.preventDefault()
                debugger
                const configObj = {
                    method: "patch",
                    headers: { "content-type": "application/json",
                                "accept": "application/json"},
                    body: JSON.stringify({
                        calorie: editCals.value,
                        note: editNotes.value
                    })
                }
                fetch(caloriesURL + id, configObj)
                    .then( getAndRenderListItems(caloriesURL))
            })

        })
    }

    getAndRenderListItems(caloriesURL)

})