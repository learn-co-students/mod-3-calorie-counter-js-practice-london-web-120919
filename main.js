// your code here, it may be worth it to ensure this file only runs AFTER the dom has loaded.
const baseUrl = 'http://localhost:3000/api/v1/calorie_entries/';
let listNode = '';

document.addEventListener('DOMContentLoaded', e => {
	listNode = document.querySelector('#calories-list');
	const listForm = document.querySelector('#new-calorie-form');

	listForm.addEventListener('submit', e => {
		e.preventDefault();
		const calorie = listForm.querySelector('input').value;
		const note = listForm.querySelector('textarea').value;

		const body = { calorie, note };
		addEntry(body);
	});

	fetchAllEntries(renderAllEntries);
});

const renderEntry = entry => {
	let list = document.createElement('li');
	list.classList.add('calories-list-item');

	list.innerHTML = `
    <div class="uk-grid">
      <div class="uk-width-1-6">
        <strong>${entry.calorie}</strong>
        <span>kcal</span>
      </div>
      <div class="uk-width-4-5">
        <em class="uk-text-meta">${entry.note}</em>
      </div>
    </div>
    `;

	let div = document.createElement('div');
	div.classList.add('list-item-menu');

	let editBtn = document.createElement('a');
	editBtn.classList.add('edit-button');
	editBtn.setAttribute('uk-toggle', 'target: #edit-form-container');
	editBtn.setAttribute('uk-icon', 'icon: pencil');
	editBtn.addEventListener('click', e => {});
	div.appendChild(editBtn);

	let deleteBtn = document.createElement('a');
	deleteBtn.classList.add('delete-button');
	deleteBtn.setAttribute('uk-icon', 'icon: trash');
	deleteBtn.addEventListener('click', e => {
		deleteEntry(entry);
		e.target.parentNode.parentNode.parentNode.remove();
	});
	div.appendChild(deleteBtn);

	list.append(div);
	listNode.appendChild(list);
};

const renderAllEntries = dataArray => {
	listNode.innerHTML = '';
	for (const entry of dataArray) {
		renderEntry(entry);
	}
};

// Fetchs'

const addEntry = body => {
	fetch(baseUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	})
		.then(res => res.json())
		.then(renderEntry);
};

const deleteEntry = entry => {
	fetch(baseUrl + entry.id, {
		method: 'DELETE'
	}).then(res => res.json());
};

const fetchAllEntries = renderAllEntries => {
	fetch(baseUrl)
		.then(res => res.json())
		.then(renderAllEntries);
};
