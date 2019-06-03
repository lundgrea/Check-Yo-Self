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
window.addEventListener('load', mapLocalStorage(toDos))

// function enableNavButtons() {
//   makeToDoButton.disabled = false;
//   clearAllButton.disabled = false;
//   addTaskButton.disabled = false
//   disableNavButtons();
// }

// function disableNavButtons() {
//   if (toDoTitleInput.value === '' || taskInput.value === '') {
//     makeToDoButton.disabled = true;
//     clearAllButton.disabled = true;
//     addTaskButton.disabled = true;
//     // toggleMakeToDoButton()
//   }
// }

// function toggleMakeToDoButton(){
//   if (taskList.length === 0) {
//     makeToDoButton.disabled = false;
//   }
// }


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
    clearAllButton.disabled = true;
    addTaskButton.disabled = true;
  } else if (toDoTitleInput.value !== '' && taskInput.value !== '') {
    makeToDoButton.disabled = true;
    clearAllButton.disabled = true;
    addTaskButton.disabled = false;
    ifTaskArrayEmpty()
  }
}

 // } else if (taskList.length > 0)
 //    makeToDoButton.disabled = false;
  // } else if (toDoTitleInput.value !== '' && taskList.length === 0) {
  //   makeToDoButton.disabled = false
  // }

// function ifFieldsClear() {
//   if (taskInput.value !== '') { 
//     addTaskButton.disabled = false;
//     makeToDoButton.disabled = true;
//     clearAllButton.disabled = true;
//   }
// }

// function ifTaskListExists(){
//   if (taskList.length = 0 && toDoInput.value !== '') {
//   makeToDoButton.disabled = true;
//   } 
// }


//   } else if ()
//   if (toDoTitleInput.value === '' || taskInput.value === '') {
//     makeToDoButton.disabled = false;
//     clearAllButton.disabled = true;
//     addTaskButton.disabled = true;
//   } else if (toDoTitleInput.value === '' || taskList.length === 0) {
//     makeToDoButton.disabled = false;
//   }
// }



// function tryThisEnabler(){
//   if (toDoTitleInput.value === '' || taskInput.value === '') {
//     makeToDoButton.disabled = true;
//     clearAllButton.disabled = true;
//     addTaskButton.disabled = true;
// } else if (toDoTitleInput.value ==='' || taskList.length === 0) {
//     makeToDoButton.disabled = true
// } else if {

// }


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
  var completedStatus = listedTasks.tasks[i].completed ? 'checkbox-active.svg' : 'checkbox.svg';
    currentItemList +=
      `<span class="main__article__header-span" data-id="${listedTasks.tasks[i].id}">
      <img alt="Completed Checkmark Area" class="main__article__section__image-checkbox" src="images/${completedStatus}">
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
    var toDoIndex = getToDoUniqueId(event);
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

function getTaskUniqueId(event) {
  return event.target.closest('.main__article__header-span').getAttribute('data-id');
}

function getTaskIndex(id, obj) {
  return obj.tasks.findIndex(function(arrayObj) {
  return arrayObj.id == parseInt(id);
  })
};


function updateCompletedButton(event) {
  console.log(event.target)
  if (event.target.closest('.main__article__section__image-checkbox')) {
    var toDoId = getToDoUniqueId(event);
    var toDoIndex = getToDoIndex(toDoId);
    var toDoObject = toDos[toDoIndex]
    var taskId = getTaskUniqueId(event);
    var taskIndex = getTaskIndex(taskId, toDoObject);
    toDos[toDoIndex].updateTask(toDos, taskIndex);
    var check = toDoObject.tasks[taskIndex].completed ? 'images/checkbox-active.svg' : 'images/checkbox.svg'
    event.target.setAttribute('src', check);
    updateCompletedStyle(event, toDoIndex, taskIndex);
    // var toItalics = toDoObject.tasks[taskIndex].taskContent
    // event.target.closest(p).classList.add('italics');
  }
}



function updateCompletedStyle (event, toDoIndex, taskIndex){

}





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

