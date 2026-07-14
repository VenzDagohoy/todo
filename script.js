//tanawon niya an html elements tapos himoon na references sa variables
const container = document.getElementById("todo-list");
const addForm = document.getElementById("add-todo-form");
const titleInput = document.getElementById("todo-title");

//API keys og headers
const API_URL = 'https://apitest.enricodelarosa.tech/todos';
const HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': 'insert_token_here'
};

//GET kuhaon an tanan todos gikan sa API 
async function getTodos(){
    const response = await fetch(API_URL, {
        method: 'GET',
        headers: { 'Authorization': HEADERS.Authorization } //No need content-type kay waya na say esend na body
    });
    return await response.json();
}

//POST maghimo nan bago na todo 
async function createTodo(titleText){
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: HEADERS,
        //convert an data sa json string before esend
        body: JSON.stringify({ title: titleText }) 
    });
    return await response.json();
}

//PUT eupdate an completed na status nan todo
async function updateTodoStatus(id, isCompleted){
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: HEADERS,
        //pwede da completed an esend, di na kailangan an title kay status da an pulihan
        body: JSON.stringify({ completed: isCompleted })
    });
    return await response.json();
}

//DELETE deleton an todo sa database
async function deleteTodo(id){
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': HEADERS.Authorization }
    });
}

//Function na mag render nan data sa html cards
function displayTodos(todosArray) {
    //Limpyohan niya ang container daan para dili mag doble an display pag refresh
    container.innerHTML = "";

    todosArray.forEach(todo => {
        const todoCard = document.createElement("div");
        todoCard.classList.add("todo-card");

        //echeck kon completed na ba para ma change an style sa text
        const textStyle = todo.completed ? "completed-text" : "";
        const toggleText = todo.completed ? "Undo" : "Complete";

        todoCard.innerHTML = `
            <div class="card-content">
                <h2 class="${textStyle}">${todo.title}</h2>
                <div class="action-row">
                    <button class="btn-toggle" onclick="handleToggle(${todo.id}, ${!todo.completed})">${toggleText}</button>
                    <button class="btn-delete" onclick="handleDelete(${todo.id})">Delete</button>
                </div>
            </div>
        `;
        container.appendChild(todoCard);
    });
}

//Mamati ini kon esubmit nan user an form
addForm.addEventListener("submit", async (e) => {
    e.preventDefault(); //pugngan niya mag reload an page
    const newTitle = titleInput.value;
    
    if(newTitle) {
        await createTodo(newTitle); //mag tawagon an POST API 
        titleInput.value = ""; //mag clear an input box
        runCode(); //refresh an listahan nan todo
    }
});

//Window functions para ma access nan inline onclick events sa html na gi generate sa taas
window.handleToggle = async (id, newStatus) => {
    await updateTodoStatus(id, newStatus); //tawgon an PUT API
    runCode(); //refresh
};

window.handleDelete = async (id) => {
    await deleteTodo(id); //tawgon an DELETE API
    runCode(); //refresh
};

//Main function magkuha og mag display sa mga todos
async function runCode(){
    const todoList = await getTodos();
    displayTodos(todoList);
}

//execute niya an runcode function pag load nan page
runCode();