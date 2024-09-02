// let Todos = [];
let filterValue = "";
let filtersValue = "";

const todoInput = document.querySelector(".input__todos")
const todoForm = document.querySelector(".todo__form")
const todoContainer = document.querySelector(".todos__container")
const filterInput = document.querySelector(".filter")
const filtersInput = document.querySelector(".filters")
const backdrop = document.querySelector(".backdrop");
const closeModalBtn = document.querySelector(".close-modal")
const editInput = document.querySelector(".edit__input")
const applyEdit = document.querySelector(".apply__btn")
const modal = document.querySelector(".modal");
const form = document.querySelector(".form")
const searchInput = document.querySelector(".search__todos")
const cancelModal = document.querySelector(".cancel__btn")


searchInput.addEventListener("input", filterTodo)

document.addEventListener("DOMContentLoaded", (e) => {
    const todos = getTodos();
    if(todos.length == 0){
        todoContainer.innerHTML = `<span class="todo__empty">
                <img src="/images/Detective-check-footprint 1.svg" alt="...">
            </span>`;
    }else updateTodos(todos);
});
todoForm.addEventListener("submit",addNewTodo);

filterInput.addEventListener("change",(e) => {
    filterValue = e.target.value;
    filterTodos();
});

filtersInput.addEventListener("change",(e) => {
    filtersValue = e.target.value;
    filterTodos();
    filtersTodos();
});
closeModalBtn.addEventListener("click",closeModal)
applyEdit.addEventListener("click", changeTodoTitle)
form.addEventListener("submit", changeTodoTitle)
modal.addEventListener("click", (e) => e.stopPropagation());
backdrop.addEventListener("click",closeModal)
cancelModal.addEventListener("click", closeModal)

function closeModal(){
    backdrop.classList.add("hidden")
}
function filterTodo(e){
    const searchValue = e.target.value
    const todos = getTodos()
    const Todo = todos.filter((t) => t.title.toLowerCase().includes(searchValue.toLowerCase()))
    updateTodos(Todo)
}
function addNewTodo(e){
    e.preventDefault();
    if(!todoInput.value) return null;
    const newTodo = {
        id: Date.now(),
        createdAt: new Date().toLocaleDateString(),
        createdTime: new Date().toLocaleTimeString(),
        title: todoInput.value,
        isCompleted: false,
    }
    // Todos.push(newTodo)
    const Todos = saveTodos(newTodo)
    updateTodos(Todos)
    todoInput.value = "";
}
function updateTodos(todos){
    let result = "";
    todos.forEach((item) => {
        result += `<div class="todos__items">
                <div class="todo" data-id=${item.id}>
                    <div class="todo__title ${item.isCompleted && "completed"}">${item.title}</div>
                    <div class="todo__options">
                        <button class="todo__edit" data-id=${item.id}>
                            <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                        </button>
                        <button class="todo__check" data-id=${item.id}>
                            <i class="fa fa-check-square"></i>
                        </button>
                        <button class="todo__trash" data-id=${item.id}>
                            <i class="fa fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="todo__time-date">
                    <span class="todo-time ${item.isCompleted && "completed"}">${item.createdAt}</span>
                    <span class="${item.isCompleted && "completed"}">${item.createdTime}</span>
                </div>
            </div>`
    });
    todoContainer.innerHTML = result;

    const editBtns = [...document.querySelectorAll(".todo__edit")];
    editBtns.forEach((btn) => btn.addEventListener("click", editTodo));

    const removeBtns = [...document.querySelectorAll(".todo__trash")];
    removeBtns.forEach((btn) => btn.addEventListener("click", removeTodo));

    const checkBtns = [...document.querySelectorAll(".todo__check")];
    checkBtns.forEach((btn) => btn.addEventListener("click", checkTodo));
}
function filterTodos(){
    const Todos = getTodos();
    switch (filterValue) {
        case "all": {
          updateTodos(Todos);
          break;
        }
        case "completed": {
          const filteredTodos = Todos.filter((t) => t.isCompleted);
          updateTodos(filteredTodos);
          break;
        }
        case "incompleted": {
          const filteredTodos = Todos.filter((t) => !t.isCompleted);
          updateTodos(filteredTodos);
          break;
        }
        default:
          updateTodos(Todos);
      }
}
function filtersTodos(){
    const Todos = getTodos();
    switch (filtersValue) {
        case "latest": {
            const sortedTodos = Todos.sort((a, b) => b.id - a.id ) 
          updateTodos(sortedTodos);
          break;
        }
        case "earliest": {
            const sortedTodos = Todos.sort((a, b) => a.id - b.id ) 
            updateTodos(sortedTodos);
          break;
        }
        default:
          updateTodos(Todos);
      }
}

let editedNoteId;

function editTodo(e){
    backdrop.classList.remove("hidden");
    const todos = getTodos();
    const Todo = todos.find((t) => t.id == e.target.dataset.id)
    editedNoteId = Todo.id;
    editInput.value = Todo.title;
}

function changeTodoTitle(){
    const todos = getTodos();
    const Todo = todos.find((t) => t.id == editedNoteId)
    Todo.title = editInput.value;
    updateTodos(todos)
    localStorage.setItem("Todo", JSON.stringify(todos))
    closeModal()
}

function removeTodo(e){
    let Todos = getTodos();
    const todoId = Number(e.target.dataset.id)
    const todo = Todos.find((t) =>  t.id === todoId)
    Todos = Todos.filter((t)=> t.id !== todo.id)
    localStorage.setItem("Todo", JSON.stringify(Todos))
    if(Todos.length == 0){
        console.log("ok");
        todoContainer.innerHTML = `<span class="todo__empty">
                <img src="/images/Detective-check-footprint 1.svg" alt="...">
            </span>`;
    }else filterTodos();
}
function checkTodo(e){
    const Todos = getTodos();
    const todoId = Number(e.target.dataset.id)
    const todo = Todos.find((t) =>  t.id === todoId)
    todo.isCompleted = !todo.isCompleted;
    localStorage.setItem("Todo", JSON.stringify(Todos));
    filterTodos();
}
const darkModeBtn = document.querySelector(".dark__toggle")
darkModeBtn.addEventListener("click",darkMode)

function darkMode(){
    if(!document.body.classList.contains("dark__mode")){
        document.body.classList.add("dark__mode")
        darkModeBtn.innerHTML = `<i class="fa fa-moon-o" aria-hidden="true"></i>`
    }else{
        document.body.classList.remove("dark__mode")
        darkModeBtn.innerHTML = `<i class="fa fa-sun-o" aria-hidden="true"></i>`
    }
}
function getTodos(){
    const Todo = JSON.parse(localStorage.getItem("Todo")) || [];
    return Todo;
}
function saveTodos(todo){
    const savedTodo = getTodos();
    savedTodo.push(todo)
    localStorage.setItem("Todo", JSON.stringify(savedTodo))
    return savedTodo;
}