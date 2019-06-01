var toDoTitleInput = document.getElementById('nav__section__input-task-title');
var taskInput = document.getElementById('nav__section__input-task-item');
var workingTaskList = document.getElementById('nav__section-task-list')
var addTaskButton = document.getElementById('nav__section__button-add-task-item');
var makeToDoButton = document.getElementById('nav__section__button-make-task-list'); 
var clearAll = document.getElementById('nav__section__button-clear-all');
var card = document.getElementById('article');
var mainContent = document.getElementById('main');
var userPrompt = document.getElementById('main__p-prompt');

var toDos = JSON.parse(localStorage.getItem('toDosArray')) || [];

toDoTitleInput.addEventListener('keyup', enableMakeTaskListButton);
addTaskButton.addEventListener('click', addTaskButtonHandler);
makeToDoButton.addEventListener('click', handleMakeTaskListButton);
toDoTitleInput.addEventListener('focusout', initializeObject)
window.addEventListener('load', mapLocalStorage(toDos))

function enableMakeTaskListButton() {
  makeToDoButton.disabled = false;
  disableMakeTaskListButton();
}

function disableMakeTaskListButton() {
  if (toDoTitleInput.value === '') {
    makeToDoButton.disabled = true;
  }
}

function mapLocalStorage(oldToDos) {
  var newToDos = oldToDos.map(function(object) {
     return turnObjectIntoToDos(object);
  });
  toDos = newToDos;
};


function turnObjectIntoToDos(obj) {
  var toDoUniqueId = obj.id;
  var toDoTitle = obj.title;
  var toDoUrgency = obj.urgent;
  var toDoCompleted = obj.completed;
  var toDoTasks = obj.tasks;
  var newToDo = new ToDoList({
    id: toDoUniqueId,
    title: toDoTitle,
    urgent: toDoUrgency,
    completed: toDoCompleted,
    tasks: toDoTasks
  })
  appendToDoCard(newToDo);
  return newToDo;
};


function handleMakeTaskListButton(){
  event.preventDefault();
  var newToDo = new ToDoList({
    id: Date.now(),
    title: toDoTitleInput.value,
    urgent: false,
    completed: false,
    tasks: 1
  });
  turnObjectIntoToDos(newToDo);
  toDos.push(newToDo);
  newToDo.saveToStorage(toDos);
  clearFields();
  disableMakeTaskListButton()
}

function reappearPrompt() {
  if (toDos.length === 0) {
    userPrompt.classList.remove('hidden');
  }
};

function appendToDoCard(toDo) {
  userPrompt.classList.add('hidden');
  mainContent.insertAdjacentHTML('afterbegin', `<article class="main__article">
        <header class="main__article__header">
          <h3 id="todo-title-output">${toDo.title}</h3>
        </header>
        <section>
          <span class="main__article__header-span" data-id="${toDo.id}">
            <svg alt="Completed Checkmark Area" class="main__article__section__image-checkbox"></svg>
            <p>${toDo.tasks}</p>
          </span>
        </section>
        <footer>
          <div class="main__article__footer__images main__article__footer__images-urgent">
            <svg alt="Urgent Button" id="main__article__footer__image-urgent"></svg>
            <h4>URGENT</h4>
          </div>
          <div class="main__article__footer__images main__article__footer__images-delete">
            <svg alt="Delete Button" id="main__article__footer__image-delete"></svg>
            <h4>DELETE</h4>
          </div>
        </footer>
      </article>`);
};

function clearFields() {
  toDoTitleInput.value = '';
};

function initializeObject(){
  event.preventDefault();
  var toDoInitializer = {
    title: toDoTitleInput.value,
    tasks: []
  }
  return toDoInitializer 
}

function addTaskButtonHandler(event) {
  event.preventDefault();




  
  var newTask = taskInput.value;
  createTaskObject(newTask);
}

function createTaskObject(taskInput) {
  event.preventDefault();
  var newTaskArray = []
  var newTask = {
    id: Date.now(),
    taskContent: taskInput,
    completed: false
  };
  appendTaskToList(newTask, newTaskArray)
  return newTask;
  console.log(newTask)
}

function appendTaskToList(task, taskArray) {
  workingTaskList.insertAdjacentHTML('afterbegin', `<span class="nav__section-task-item">
            <svg alt="Delete New Task Item" class="nav__section__task-image"></svg>
            <p class="nav_section_task">${task.taskContent}</p>
            </span>`);
  taskArray.push(task);
  return taskArray
};

// function getUniqueId(event) {
//   return event.target.closest('.card').getAttribute('data-id');
// };

// function getCardIndex(id) {
//   return ideas.findIndex(function(arrayObj) {
//   return arrayObj.id == parseInt(id);
//   })
// };


// function deleteToDoList(event) {
//   if (event.target.closest('#white-x-img')) {
//     var cardId = getUniqueId(event);
//     var cardIndex = getCardIndex(cardId);
//     event.target.closest('.card').remove();
//     ideas[cardIndex].deleteFromStorage(cardIndex);
//     reappearPrompt();
//   }
// };
