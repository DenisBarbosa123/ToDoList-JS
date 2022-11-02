import Dexie from "https://cdn.jsdelivr.net/npm/dexie@3.0.3/dist/dexie.mjs"

const db = new Dexie("toDoListDB");
const texto = document.querySelector('input')
const btnInsert = document.querySelector('.divInsert button')
const btnDeleteAll = document.querySelector('.header button')
const ul = document.querySelector('ul')

var itensDB = []
var itensRetrieved = []

db.version(1).stores({
    todo: "++id,list"
})

db.on("populate", async () => {
    await db.todo.bulkPut([
      [{
        item: "Learn JS",
        status: ""
      },
      {
        item: "Learn English",
        status: "checked"
      }]
    ]);
    await loadItens()
})
  
db.open()

btnDeleteAll.onclick = () => {
  itensDB = []
  updateDB()
}

texto.addEventListener('keypress', e => {
  if (e.key == 'Enter' && texto.value != '') {
    setItemDB()
  }
})

btnInsert.onclick = () => {
  if (texto.value != '') {
    setItemDB()
  }
}

async function setItemDB() {
  console.log("set itens")  
  console.log(itensDB)
  itensDB.push({ 'item': texto.value, 'status': '' })
  await updateDB()
}

async function updateDB() {  
  await db.todo.delete(1)
  await db.todo.add(itensDB)
  await loadItens()
}

async function loadItens() {
  ul.innerHTML = "";
  itensRetrieved = await db.todo.toArray()
  itensDB = itensRetrieved[0]?? []
  console.log("Load itens")
  console.log(itensDB)
  itensDB.forEach((item, i) => {
    insertItemTela(item.item, item.status, i)
  })
}

function insertItemTela(text, status, i) {
  const li = document.createElement('li')
  
  li.innerHTML = `
    <div class="divLi">
      <input type="checkbox" ${status} data-i=${i} onchange="done(this, ${i});" />
      <span data-si=${i}>${text}</span>
      <button onclick="removeItem(${i})" data-i=${i}><i class='bx bx-trash'></i></button>
    </div>
    `
  ul.appendChild(li)

  if (status) {
    document.querySelector(`[data-si="${i}"]`).classList.add('line-through')
  } else {
    document.querySelector(`[data-si="${i}"]`).classList.remove('line-through')
  }

  texto.value = ''
}

async function done(chk, i) {
  if (chk.checked) {
    itensDB[i].status = 'checked' 
  } else {
    itensDB[i].status = '' 
  }

  await updateDB()
}

async function removeItem(i) {
  itensDB.splice(i, 1)
  await updateDB()
}

await loadItens()