class ToDoList {
  constructor(obj) {
    this.id = obj.id
    this.title = obj.title
    this.urgent = obj.urgent || false;
    this.tasks = obj.tasks || []
  }

  saveToStorage(toDos) {
    var allToDos = JSON.stringify(toDos);
    localStorage.setItem('toDosArray', allToDos);
  }

  deleteFromStorage(index) {
    toDos.splice(index, 1);
    this.saveToStorage(toDos);
  }

  updateToDo() {
    this.urgent = !this.urgent;
    this.saveToStorage(toDos);
    return this.urgent;
  }

  updateTask() {
    
  }
}

