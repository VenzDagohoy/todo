//tanawon an html elements tapos himoon na references sa variable
const container = document.getElementById("todo-list");
const addForm = document.getElementById("add-todo-form");
const titleInput = document.getElementById("todo-title");

//API keys og headers
const API_URL = 'https://apitest.enricodelarosa.tech/todos'; // Ini an web address (URL) nan backend server
const HEADERS = {
    'Content-Type': 'application/json', //Ipahibayo sa server na JSON format an ipada na data
    'Authorization': 'Bearer ${API_TOKEN}' //Token para ma access an API
};

//GET kuhaon an tanan todos gikan sa API 
async function getTodos(){
    const response = await fetch(API_URL, {
        method: 'GET', //mokuha, mobasa nan data
        headers: { 'Authorization': HEADERS.Authorization }
    });
    return await response.json(); //Mag huwaton nan reply sa server tapos econvert dayun sa JSON format
}

//POST maghimo nan bago na todo 
async function createTodo(titleText){
    const response = await fetch(API_URL, {
        method: 'POST', //Mag create, add nan bago na record sa database
        headers: HEADERS,
        //convert an data sa json string before esend
        body: JSON.stringify({ title: titleText }) 
    });
    return await response.json(); //Convert sab sa JSON an reply nan server
}

//PUT eupdate an completed na status nan todo
async function updateTodoStatus(id, isCompleted){
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT', //Mag update nan existing na data
        headers: HEADERS,
        body: JSON.stringify({ completed: isCompleted })
    });
    return await response.json();
}

//DELETE deleton an todo sa database
async function deleteTodo(id){
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE', //mag delete nan existing na data
        headers: { 'Authorization': HEADERS.Authorization }
    });
}

//Function na mag render nan data sa html cards
function displayTodos(todosArray) {
    //eclear niya ang container para dili mag doble an display pag refresh
    container.innerHTML = "";

    todosArray.forEach(todo => { // Mag loop or tagisa isahon niya an mga todo gikan sa list
        const todoCard = document.createElement("div"); //Maghimo bago na div element
        todoCard.classList.add("todo-card"); //Class na todo-card para sa CSS styling

        //echeck kon completed na ba para ma change an style sa text, butangan linya kung true
        const textStyle = todo.completed ? "completed-text" : "";
        //Kon completed na, Undo an text sa button
        //Kung wara pa, Complete an text
        const toggleText = todo.completed ? "Undo" : "Complete";

        //Isud an HTML structure nan card based sa data nan todo
        todoCard.innerHTML = `
            <div class="card-content">
                <h2 class="${textStyle}">${todo.title}</h2>
                <div class="action-row">
                    <button class="btn-toggle" onclick="handleToggle(${todo.id}, ${!todo.completed})">${toggleText}</button>
                    <button class="btn-delete" onclick="handleDelete(${todo.id})">Delete</button>
                </div>
            </div>
        `;
        container.appendChild(todoCard); //Display an card sa webpage container
    });
}

//Magbantay ini kon mag submit an user nan form, an pag click sa Add button
addForm.addEventListener("submit", async (e) => {
    e.preventDefault(); //pugngan niya mag reload an page
    const newTitle = titleInput.value; //Mag kuhaon an text na gi type nan user sa textbox
    
    if(newTitle) { //mag check kon yaoy text sa textbox
        await createTodo(newTitle); //mag tawagon an POST API para save an todo
        titleInput.value = ""; //mag clear an input box
        runCode(); //refresh an listahan nan todo
    }
});

//Window functions para ma access nan inline onclick events sa html na gi generate sa taas
window.handleToggle = async (id, newStatus) => {
    await updateTodoStatus(id, newStatus); //tawgon an PUT API para eupdate an status
    runCode(); //refresh an display sa webpage
};

window.handleDelete = async (id) => { //Function pag click sa Delete button
    await deleteTodo(id); // tawgon an DELETE API para delete an record sa database
    runCode(); //refresh para mawara an gi delete na card
};

//Main function magkuha og mag display sa mga todos
async function runCode(){
    const todoList = await getTodos(); //Tawgon an API para kuhaon an list gikan sa server
    displayTodos(todoList); //Ipasa an list sa display function para morender sa HTML
}

//execute niya an runcode function pag load nan page
runCode();