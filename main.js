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
var navSection = document.getElementById('nav')

toDoTitleInput.addEventListener('keyup', enableNavButtons);
taskInput.addEventListener('keyup', enableNavButtons);
addTaskButton.addEventListener('click', createTaskObject);
makeToDoButton.addEventListener('click', handleMakeTaskListButton);
clearAllButton.addEventListener('click', clearButton);
main.addEventListener('click', clickHandler);
navSection.addEventListener('click', removeTaskFromWorkingList);
window.addEventListener('load', mapLocalStorage(toDos));

function enableNavButtons() {
  makeToDoButton.disabled = false;
  clearAllButton.disabled = false;
  addTaskButton.disabled = false
  disableNavButtons()
}

function disableNavButtons() {
  ifTitleFull();
  ifTaskArrayEmpty()
}

function ifTaskArrayEmpty() {
  if (taskList.length > 0)
    makeToDoButton.disabled = false;
}

function ifTitleFull() {
  if (toDoTitleInput.value === ''  || taskInput.value === '') {
    makeToDoButton.disabled = true;
    clearAllButton.disabled = false;
    addTaskButton.disabled = true;
  } else if (toDoTitleInput.value !== '' && taskInput.value !== '') {
    makeToDoButton.disabled = true;
    clearAllButton.disabled = false;
    addTaskButton.disabled = false;
    ifTaskArrayEmpty()
  }
}

function removeTaskFromWorkingList(event) {
  if (event.target.closest('.nav__section__task-image')) {
    var taskId = getSpecificTaskId(event);
    var taskIndex = getSpecificIndexId(taskId)
    event.target.closest('.nav__section-task-item').remove();
    taskList.splice(taskIndex, 1)
    disableNavButtons();
  }
}

function getSpecificTaskId(event) {
  return event.target.closest('.nav__section-task-item').getAttribute('data-id')
}

function getSpecificIndexId(id) {
  return taskList.findIndex(function(arrayObj) {
  return arrayObj.id == parseInt(id)
  })
};


function clearTaskInput() {
  taskInput.value = '';
}

function clearButton() {
  event.preventDefault();
  toDoTitleInput.value = '';
  taskInput.value = ''
  workingTaskList.innerHTML = ''
  makeToDoButton.disabled = true;
  clearAllButton.disabled = true;
  addTaskButton.disabled = true;
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
  ifTaskArrayEmpty()
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
  updateCompletedButton(event)
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
            <img src="images/delete-list-item.svg" alt="Delete New Task Item" class="nav__section__task-image">
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
  var cardUrgency = toDo.urgent ? 'main__article card urgent__card' : 'main__article card';
  var urgencyStatus = toDo.urgent ? 'images/urgent-active.svg' : 'images/urgent.svg'
  var newCard = 
  `<article class="${cardUrgency}" data-id="${toDo.id}">
        <header class="main__article__header">
          <h2 id="todo-title-output">${toDo.title}</h2>
        </header>
        <section>
         ${populateTaskList(toDo)}
        </section>
        <footer>
           <div class="main__article__footer__images main__article__footer__images-urgent">
            <svg src="${cardUrgency}" alt="Urgent Button" id="main__article__footer__image-urgent"></svg>
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

function populateTaskList(listedTasks) {
  var currentItemList = '';
  for (var i =0; i < listedTasks.tasks.length; i++) {
  var completedStatus = listedTasks.tasks[i].completed ? 'checkbox-active.svg' : 'checkbox.svg';
  var completedParagraphStyle = listedTasks.tasks[i].completed ? 'main__article__task-completed' : 'main__article__task-not-completed';
    currentItemList +=
      `<span class="main__article__header-span" data-id="${listedTasks.tasks[i].id}">
      <img alt="Completed Checkmark Area" class="main__article__section__image-checkbox" src="images/${completedStatus}">
      <p class="${completedParagraphStyle}">${listedTasks.tasks[i].taskContent}</p>
      </span>`
  }
 return currentItemList;
}


function deleteToDoList(event) {
  if (event.target.closest('#main__article__footer__image-delete')) {
    var toDoId = getToDoUniqueId(event);
    var toDoIndex = getToDoIndex(toDoId);
    var cardToEnsureComplete = toDos[toDoIndex].tasks 
    var filteredTasks = cardToEnsureComplete.filter(task => task.completed === true) 
    if (filteredTasks.length === cardToEnsureComplete.length) {
      event.target.closest('.card').remove();
      toDos[toDoIndex].deleteFromStorage(toDoIndex);
      reappearPrompt();
    } else { 
    alert('Please complete all tasks prior to deleting to do.')
    }
  }
}

function updateUrgencyButton(event) {
  if (event.target.closest('#main__article__footer__image-urgent')) {
    var toDoId = getToDoUniqueId(event);
    var toDoIndex = getToDoIndex(toDoId);
    toDos[toDoIndex].updateToDo(toDos, toDoIndex);
    var urgent = toDos[toDoIndex].urgent ? 'images/urgent-active.svg' : 'images/urgent.svg';
    event.target.setAttribute('src', urgent)
    updateUrgentStyle(event, toDoIndex);
  }
}

function updateUrgentStyle(event, index) {
  var updateCard = event.target.closest('.card');
  console.log()
  updateCard.classList.toggle('urgent__card');
};
//   var urgent = 'images/urgent-active.svg';
//   var notUrgent = 'images/urgent.svg';
//   var thisUrgent = event.target.closest('#main__article__footer__image-urgent')


//   if (toDos[index].urgent === true) {
//     thisUrgent.setAttribute('src', urgent)
//     console.log('inside true', thisUrgent)
//   } else {
//     thisUrgent.setAttribute('src', notUrgent)
//     console.log('inside false', thisUrgent)


// }}
  




    // thisUrgent.classList.add('main__article__footer__image-urgent')
    // thisUrgent.classList.remove('main__article-urgent')


//       .setAttribute()

//     completedItem.classList.toggle('main__article__task-completed');  

//     completedItem.classList.toggle('main__article__task-completed');

 // var urgentToDo = toDos[toDoIndex].urgent ? 'images/urgent-active.svg' : 'images/urgent.svg'
    // event.target.setAttribute('src', urgentToDo)

// }
// }


    // var active = 'images/urgent-active.svg'
    // var inactive = 'images/urgent.svg'

    // var check = toDoObject.urgent ? active : inactive
    // if (check === true) {
    //   event.target.setAttribute('src', active)
    // } else if (check !== true)
    //   event.target.setAttribute('src', inactive)
    // event.target.setAttribute('src', check)
  


  // updateUrgentStyle(event)

// var urgentStatus = 'images/urgent-active.svg';
    // var nonUrgent = document.querySelector(`.card[data-id="${toDoId}"] #main__article__footer__image-urgent`);
    // nonUrgent.src = urgentStatus;
// function updateUrgentStyle (event, toDoIndex, taskIndex){
//  var urgentTask = event.target
//  console.log(urgentTask)
//  urgentTask.classList.toggle('new')
// }
//     if (toDos[toDoIndex].urgent === false) {
//       var clearUrgentStatus = 'images/urgent.svg';
//       nonUrgent.src = clearUrgentStatus;
//     } else {
//       nonUrgent.src = urgentStatus;
//     }
//   }
// }

function getTaskUniqueId(event) {
  return event.target.closest('.main__article__header-span').getAttribute('data-id');
}

function getTaskIndex(id, obj) {
  return obj.tasks.findIndex(function(arrayObj) {
  return arrayObj.id == parseInt(id);
  })
};

function updateCompletedButton(event) {
  if (event.target.closest('.main__article__section__image-checkbox')) {
    var toDoId = getToDoUniqueId(event);
    var toDoIndex = getToDoIndex(toDoId);
    var toDoObject = toDos[toDoIndex]
    var taskId = getTaskUniqueId(event);
    var taskIndex = getTaskIndex(taskId, toDoObject);
    toDos[toDoIndex].updateTask(toDos, taskIndex);
    var check = toDoObject.tasks[taskIndex].completed ? 'images/checkbox-active.svg' : 'images/checkbox.svg'
    event.target.setAttribute('src', check);
    updateCompletedStyle(event);
  }
}

function updateCompletedStyle (event){
  var completedItem = event.target.nextElementSibling;
  completedItem.classList.toggle('main__article__task-completed');
  completedItem.classList.toggle('main__article__task-not-completed');
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

