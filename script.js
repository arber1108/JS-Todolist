document.addEventListener('DOMContentLoaded', function() {
  const todoForm = document.getElementById('todoForm'); // Das Formular-Element für das Hinzufügen von Todos
  const todoList = document.getElementById('todoList'); // Die Liste der Todos
  const todos = []; // Ein Array zur Speicherung der Todo-Objekte

  todoForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // Erfassen der eingegebenen Werte aus dem Formular
    const title = document.getElementById('titleInput').value;
    const beschreibung = document.getElementById('beschreibungInput').value;
    const kuerzel = document.getElementById('kuerzelInput').value;
    const important = document.getElementById('importantCheckbox').checked;
    const urgent = document.getElementById('urgentCheckbox').checked;
    const startDate = document.getElementById('startDateInput').value;
    const endDate = document.getElementById('endDateInput').value;
    const progress = document.getElementById('progressInput').value;

    const today = new Date().toISOString().split('T')[0];

    // Überprüfung der eingegebenen Werte
    if (startDate < today) {
      alert('Das Startdatum darf nicht in der Vergangenheit liegen.');
      return;
    }

    if (endDate < startDate) {
      alert('Das Enddatum darf nicht vor dem Startdatum liegen.');
      return;
    }

    // Berechnung der Priorität basierend auf den Checkboxen für "Wichtig" und "Dringend"
    const priority = calculatePriority(important, urgent);

    // Erstellen eines Todo-Elements und Hinzufügen zur Liste
    const todoItem = createTodoItem(title, beschreibung, kuerzel, priority, startDate, endDate, progress);
    todoList.appendChild(todoItem);

    // Erstellen eines Todo-Objekts und Hinzufügen zum Array
    const todo = {
      title: title,
      beschreibung: beschreibung,
      kuerzel: kuerzel,
      important: important,
      urgent: urgent,
      startDate: startDate,
      endDate: endDate,
      progress: progress
    };
    todos.push(todo);

    // Zurücksetzen des Formulars nach dem Hinzufügen eines Todo-Elements
    todoForm.reset();
  });

  // Funktion zur Berechnung der Priorität basierend auf den Checkboxen für "Wichtig" und "Dringend"
  function calculatePriority(important, urgent) {
    if (important && urgent) {
      return '1. Dringend und Wichtig';
    } else if (important && !urgent) {
      return '2. Wichtig aber nicht Dringend';
    } else if (!important && urgent) {
      return '3. Dringend aber nicht Wichtig';
    } else {
      return '4. Weder Dringend noch Wichtig';
    }
  }

  // Funktion zur Erstellung eines Todo-Elements
  function createTodoItem(title, beschreibung, kuerzel, priority, startDate, endDate, progress) {
    const todoItem = document.createElement('div');
    todoItem.classList.add('todo-item');

    // Erstellen der einzelnen Elemente für den Todo-Eintrag (Titel, Beschreibung, Kürzel, Priorität usw.)
    const titleElement = document.createElement('h2');
    titleElement.textContent = title;

    const beschreibungElement = document.createElement('p');
    beschreibungElement.textContent = `Beschreibung: ${beschreibung}`;

    const kuerzelElement = document.createElement('p');
    kuerzelElement.textContent = `Kürzel: ${kuerzel}`;

    const priorityElement = document.createElement('p');
    priorityElement.textContent = `Priorität: ${priority}`;

    const startDateElement = document.createElement('p');
    startDateElement.textContent = `Startdatum: ${startDate}`;

    const endDateElement = document.createElement('p');
    endDateElement.textContent = `Enddatum: ${endDate}`;

    const progressElement = document.createElement('p');
    progressElement.textContent = `Fortschritt: ${progress}%`;

    // Erstellen der Löschen- und Bearbeiten-Buttons mit entsprechenden Event-Listenern
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Löschen';
    deleteButton.addEventListener('click', function() {
      // Finden des Index des zu löschenden Todo-Objekts im Array
      const index = todos.findIndex(todo => todo.title === title);
      if (index !== -1) {
        todos.splice(index, 1); // Entfernen des Todo-Objekts aus dem Array
      }
      todoItem.remove(); // Entfernen des Todo-Elements aus der Liste
    });

    const editButton = document.createElement('button');
    editButton.textContent = 'Bearbeiten';
    editButton.addEventListener('click', function() {
      showEditPopup(todoItem); // Anzeigen des Bearbeitungs-Popups für das ausgewählte Todo-Element
    });

    // Hinzufügen der erstellten Elemente zum Todo-Element
    todoItem.appendChild(titleElement);
    todoItem.appendChild(beschreibungElement);
    todoItem.appendChild(kuerzelElement);
    todoItem.appendChild(priorityElement);
    todoItem.appendChild(startDateElement);
    todoItem.appendChild(endDateElement);
    todoItem.appendChild(progressElement);
    todoItem.appendChild(deleteButton);
    todoItem.appendChild(editButton);

    return todoItem;
  }

  // Funktion zum Anzeigen des Bearbeitungs-Popups für das ausgewählte Todo-Element
  function showEditPopup(todoItem) {
    const todo = todos.find(todo => todo.title === todoItem.querySelector('h2').textContent);

    const editContainer = document.createElement('div');
    editContainer.classList.add('edit-container');

    // Erstellen der Eingabefelder und Labels für die Bearbeitung der Todo-Daten
    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Titel:';
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.value = todo.title;

    const beschreibungLabel = document.createElement('label');
    beschreibungLabel.textContent = 'Beschreibung:';
    const beschreibungInput = document.createElement('input');
    beschreibungInput.type = 'text';
    beschreibungInput.value = todo.beschreibung;

    const kuerzelLabel = document.createElement('label');
    kuerzelLabel.textContent = 'Kürzel:';
    const kuerzelInput = document.createElement('input');
    kuerzelInput.type = 'text';
    kuerzelInput.value = todo.kuerzel;

    const importantLabel = document.createElement('label');
    importantLabel.textContent = 'Wichtig:';
    const importantCheckbox = document.createElement('input');
    importantCheckbox.type = 'checkbox';
    importantCheckbox.checked = todo.important;

    const urgentLabel = document.createElement('label');
    urgentLabel.textContent = 'Dringend:';
    const urgentCheckbox = document.createElement('input');
    urgentCheckbox.type = 'checkbox';
    urgentCheckbox.checked = todo.urgent;

    const startDateLabel = document.createElement('label');
    startDateLabel.textContent = 'Startdatum:';
    const startDateInput = document.createElement('input');
    startDateInput.type = 'date';
    startDateInput.value = todo.startDate;
    const today = new Date().toISOString().split('T')[0];
    startDateInput.setAttribute('min', today);
    startDateInput.addEventListener('change', function() {
      if (endDateInput.value !== '' && startDateInput.value > endDateInput.value) {
        alert('Das Startdatum darf nicht nach dem Enddatum liegen.');
        startDateInput.value = todo.startDate;
      }
    });

    const endDateLabel = document.createElement('label');
    endDateLabel.textContent = 'Enddatum:';
    const endDateInput = document.createElement('input');
    endDateInput.type = 'date';
    endDateInput.value = todo.endDate;
    endDateInput.setAttribute('min', today);
    endDateInput.addEventListener('change', function() {
      if (startDateInput.value !== '' && endDateInput.value < startDateInput.value) {
        alert('Das Enddatum darf nicht vor dem Startdatum liegen.');
        endDateInput.value = todo.endDate;
      }
    });

    const progressLabel = document.createElement('label');
    progressLabel.textContent = 'Fortschritt (%):';
    const progressInput = document.createElement('input');
    progressInput.type = 'number';
    progressInput.min = '0';
    progressInput.max = '100';
    progressInput.value = todo.progress;

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Speichern';
    saveButton.addEventListener('click', function() {
      // Aktualisieren der Todo-Daten mit den neuen Werten aus den Eingabefeldern
      todo.title = titleInput.value;
      todo.beschreibung = beschreibungInput.value;
      todo.kuerzel = kuerzelInput.value;
      todo.important = importantCheckbox.checked;
      todo.urgent = urgentCheckbox.checked;
      todo.startDate = startDateInput.value;
      todo.endDate = endDateInput.value;
      todo.progress = progressInput.value;

      renderTodoList(); // Aktualisieren der Todo-Liste

      // Erstellen eines aktualisierten Todo-Elements und Ersetzen des alten Elements in der Liste
      const updatedTodoItem = createTodoItem(
        todo.title,
        todo.beschreibung,
        todo.kuerzel,
        calculatePriority(todo.important, todo.urgent),
        todo.startDate,
        todo.endDate,
        todo.progress
      );
      todoItem.replaceWith(updatedTodoItem);

      editModal.style.display = 'none'; // Schließen des Bearbeitungs-Popups
    });

    const exitButton = document.createElement('button');
    exitButton.textContent = 'Abbrechen';
    exitButton.addEventListener('click', function() {
      editModal.style.display = 'none'; // Schließen des Bearbeitungs-Popups
    });

    // Hinzufügen der Eingabefelder, Labels und Buttons zum Bearbeitungs-Popup
    editContainer.appendChild(titleLabel);
    editContainer.appendChild(titleInput);
    editContainer.appendChild(beschreibungLabel);
    editContainer.appendChild(beschreibungInput);
    editContainer.appendChild(kuerzelLabel);
    editContainer.appendChild(kuerzelInput);
    editContainer.appendChild(importantLabel);
    editContainer.appendChild(importantCheckbox);
    editContainer.appendChild(urgentLabel);
    editContainer.appendChild(urgentCheckbox);
    editContainer.appendChild(startDateLabel);
    editContainer.appendChild(startDateInput);
    editContainer.appendChild(endDateLabel);
    editContainer.appendChild(endDateInput);
    editContainer.appendChild(progressLabel);
    editContainer.appendChild(progressInput);
    editContainer.appendChild(saveButton);
    editContainer.appendChild(exitButton);

    const editModal = document.getElementById('editModal'); // Das Bearbeitungs-Popup-Element
    const editFormContainer = document.getElementById('editFormContainer'); // Der Container für das Bearbeitungs-Popup
    editFormContainer.innerHTML = '';
    editFormContainer.appendChild(editContainer);
    editModal.style.display = 'flex'; // Anzeigen des Bearbeitungs-Popups
  }

  // Funktion zum Rendern der gesamten Todo-Liste
  function renderTodoList() {
    todoList.innerHTML = '';

    for (const todo of todos) {
      // Erstellen eines Todo-Elements für jedes Todo-Objekt und Hinzufügen zur Liste
      const todoItem = createTodoItem(
        todo.title,
        todo.beschreibung,
        todo.kuerzel,
        calculatePriority(todo.important, todo.urgent),
        todo.startDate,
        todo.endDate,
        todo.progress
      );
      todoList.appendChild(todoItem);
    }
  }

  // Funktion zur Durchführung einer Suche nach Todos basierend auf dem eingegebenen Suchbegriff
  function searchTodos(searchTerm) {
    // Filtern der Todos basierend auf dem Suchbegriff
    const filteredTodos = todos.filter(
      todo =>
        todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.beschreibung.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.kuerzel.toLowerCase().includes(searchTerm.toLowerCase())
    );

    renderFilteredTodoList(filteredTodos); // Rendern der gefilterten Todo-Liste
  }

  // Funktion zum Rendern einer gefilterten Todo-Liste
  function renderFilteredTodoList(filteredTodos) {
    todoList.innerHTML = '';

    for (const todo of filteredTodos) {
      // Erstellen eines Todo-Elements für jedes gefilterte Todo-Objekt und Hinzufügen zur Liste
      const todoItem = createTodoItem(
        todo.title,
        todo.beschreibung,
        todo.kuerzel,
        calculatePriority(todo.important, todo.urgent),
        todo.startDate,
        todo.endDate,
        todo.progress
      );
      todoList.appendChild(todoItem);
    }
  }

  const searchInput = document.getElementById('searchInput'); // Das Sucheingabefeld
  searchInput.addEventListener('input', function(event) {
    const searchTerm = event.target.value;
    if (searchTerm.trim() !== '') {
      searchTodos(searchTerm); // Durchführen der Suche bei Eingabe eines Suchbegriffs
    } else {
      renderTodoList(); // Rendern der gesamten Todo-Liste, wenn kein Suchbegriff vorhanden ist
    }
  });

  renderTodoList(); // Initialisieren der Todo-Liste beim Laden der Seite
});
