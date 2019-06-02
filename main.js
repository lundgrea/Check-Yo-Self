var toDos = JSON.parse(localStorage.getItem('toDosArray')) || [];
var taskList = []
var toDoTitleInput = document.getElementById('nav__section__input-task-title');
var taskInput = document.getElementById('nav__section__input-task-item');
var makeToDoButton = document.getElementById('nav__section__button-make-task-list');
var clearAllButton = document.getElementById('nav__section__button-clear-all');
var addTaskButton = document.getElementById('nav__section__button-add-task-item');
var workingTaskList = document.getElementById('nav__section-task-list')
var userPrompt = document.getElementById('main__p-prompt');
var mainContent = document.getElementById('main');

toDoTitleInput.addEventListener('keyup', enableNavButtons);
taskInput.addEventListener('keyup', enableNavButtons);
addTaskButton.addEventListener('click', createTaskObject);
makeToDoButton.addEventListener('click', handleMakeTaskListButton);
clearAllButton.addEventListener('click', clearButton);
main.addEventListener('click', clickHandler)
window.addEventListener('load', mapLocalStorage(toDos))


function enableNavButtons(){
  makeToDoButton.disabled = false;
  clearAllButton.disabled = false;
  addTaskButton.disabled = false;
  disableNavButtons();
}

function disableNavButtons(){
  if (toDoTitleInput.value === '' || taskInput.value === '') {
    makeToDoButton.disabled = false;
    clearAllButton.disabled = false;
    addTaskButton.disabled = false;
  }
}

function clearTaskInput(){
  taskInput.value = '';
}

function clearButton(){
  event.preventDefault();
  toDoTitleInput.value = '';
  taskInput.value = ''
}

function createTaskObject() {
  event.preventDefault();
  var newTask = {
    id: Date.now(),
    taskContent: taskInput.value,
    completed: false
  };
  appendTaskToList(newTask);
  taskList.push(newTask)
  return newTask
}

function clearFields() {
  toDoTitleInput.value = '';
  taskInput.value = '';
  taskList = [];
  workingTaskList.innerHTML = '';
};

function turnObjectIntoToDos(obj) {
  var toDoUniqueId = obj.id;
  var toDoTitle = obj.title;
  var toDoUrgency = obj.urgent;
  var toDoTasks = obj.tasks;
  var newToDo = new ToDoList({
    id: toDoUniqueId,
    title: toDoTitle,
    urgent: toDoUrgency,
    tasks: toDoTasks
  })
  appendToDoCard(newToDo);
  return newToDo;
};

function handleMakeTaskListButton() {
  event.preventDefault();
  var newToDo = new ToDoList({
    id: Date.now(),
    title: toDoTitleInput.value,
    urgent: false,
    tasks: taskList
  });
  turnObjectIntoToDos(newToDo);
  toDos.push(newToDo);
  newToDo.saveToStorage(toDos);
  clearFields();
  disableNavButtons()
}

function reappearPrompt() {
  if (toDos.length === 0) {
    userPrompt.classList.remove('hidden');
  }
};

function clickHandler(event) {
  deleteToDoList(event);
  updateUrgencyButton(event)
}

function getToDoUniqueId(event) {
  return event.target.closest('.card').getAttribute('data-id');
};

function getToDoIndex(id) {
  return toDos.findIndex(function(arrayObj) {
  return arrayObj.id == parseInt(id);
  })
};


function appendTaskToList(task) {
  var taskId = task.id;
  var newListItem = 
  `<span class="nav__section-task-item" data-id="${task.id}">
            <svg alt="Delete New Task Item" class="nav__section__task-image"></svg>
            <p class="nav_section_task">${task.taskContent}</p>
            </span>`
  workingTaskList.insertAdjacentHTML('afterbegin', newListItem);
  clearTaskInput();
  disableNavButtons();
};

function mapLocalStorage(oldToDos) {
  var newToDos = oldToDos.map(function(object) {
     return turnObjectIntoToDos(object);
  });
  toDos = newToDos;
};

function appendToDoCard(toDo) {
  userPrompt.classList.add('hidden');
  var urgentStatus = toDo.urgent ? 'urgent-active.svg' : 'urgent.svg'; 
  var newCard = 
  `<article class="main__article card" data-id="${toDo.id}">
        <header class="main__article__header">
          <h2 id="todo-title-output">${toDo.title}</h2>
        </header>
        <section>
         ${populateTaskList(toDo)}
        </section>
        <footer>
           <div class="main__article__footer__images main__article__footer__images-urgent">
            <svg alt="Urgent Button" id="main__article__footer__image-urgent"></svg>
            <h3>URGENT</h3>
          </div>
          <div class="main__article__footer__images main__article__footer__images-delete">
            <svg alt="Delete Button" id="main__article__footer__image-delete"></svg>
            <h3>DELETE</h3>
          </div>
        </footer>
      </article>`
  mainContent.insertAdjacentHTML('afterbegin', newCard);
};

function populateTaskList(listedTasks){
  var currentItemList = '';
  for (var i =0; i < listedTasks.tasks.length; i++) {
    currentItemList +=
      `<span class="main__article__header-span">
      <svg alt="Completed Checkmark Area" class="main__article__section__image-checkbox"></svg>
      <p>${listedTasks.tasks[i].taskContent}</p>
      </span>`
  }
 return currentItemList;
}


function deleteToDoList(event) {
  if (event.target.closest('#main__article__footer__image-delete')) {
    var toDoId = getToDoUniqueId(event);
    var toDoIndex = getToDoIndex(toDoId);
    event.target.closest('.card').remove();
    toDos[toDoIndex].deleteFromStorage(toDoIndex);
    reappearPrompt();
  }
};



function updateUrgencyButton(event) {
  if (event.target.closest('#main__article__footer__image-urgent')) {
    var toDoId = getToDoUniqueId(event);
    var toDoIndex = getToDoIndex(toDoId);
    var urgentStatus = 'images/urgent-active.svg';
    var nonUrgent = document.querySelector(`.card[data-id="${toDoId}"] #main__article__footer__image-urgent`);
    nonUrgent.src = urgentStatus;
    toDos[toDoIndex].updateToDo();
    if (toDos[toDoIndex].urgent === false) {
      var clearUrgentStatus = 'images/urgent.svg';
      nonUrgent.src = clearUrgentStatus;
    } else {
      nonUrgent.src = urgentStatus;
    }
  }
}


 function updateStarBtn(event) {
  if (event.target.closest('#white-star-img')) {  
    var cardId = getUniqueId(event);
    var cardIndex = getCardIndex(cardId);
    var yellowStar = 'images/star-active.svg'; 
    var oldStar = document.querySelector(`.card[data-id="${cardId}"] #white-star-img`);
    oldStar.src = yellowStar;
    ideas[cardIndex].updateStar();
  if (ideas[cardIndex].star === false) {
    var whiteStar = 'images/star.svg';
    oldStar.src = whiteStar;
  } else {
    oldStar.src = yellowStar;
    }
  }
};







// function enableMakeTaskListButton() {
//   makeToDoButton.disabled = false;
//   disableMakeTaskListButton();
// }

// function disableMakeTaskListButton() {
//   if (toDoTitleInput.value === '') {
//     makeToDoButton.disabled = true;
//   }
// }



// function initializeObject(){
//   event.preventDefault();
//   titleInput = toDoTitleInput.value
//   var toDoInitializer = {
//     title: titleInput,
//     tasks: []
//   }
//   var initializedToDo = toDoInitializer
//   console.log('initializedObject for your eyes', initializedToDo)
//   taskList = initializedToDo
//   return taskList
// }

// function addTaskButtonHandler(event) {
//   createTaskObject();
//   taskInput.value = '';

// }



// function pushTaskIntoTaskList(createdTaskObject){
//   taskList.push(createdTaskObject)
// }
// function updateInitializedObject(newTaskForToDo){
// taskList.push(newTaskForToDo)
//   var updatedToDoInitializer() = {
//     title: toDoToBeInitialized.title, 
//     tasks: toDoToBeInitialized.value.push(newTaskForToDo)
//   }
//   return updatedToDoInitializer
// }


// toDoTitleInput.addEventListener('keyup', enableMakeTaskListButton);






