import Dexie from "https://cdn.jsdelivr.net/npm/dexie@3.0.3/dist/dexie.mjs"

const db = new Dexie("toDoListDB");
const texto = document.querySelector('input')
const btnInsert = document.querySelector('.divInsert button')
const btnDeleteAll = document.querySelector('.header button')
const ul = document.querySelector('ul')

var itensDB = []

db.version(1).stores({
    todo: "++id,list"
})

db.on("populate", async () => {
    await db.todo.bulkPut([
      {
        item: "Learn English",
        status: "checked"
      },
      {
        item: "Learn JS",
        status: ""
      },
    ]);
    loadItens()
});
  
db.open()

btnDeleteAll.onclick = async () => {
  await db.todo.clear()
  await loadItens()
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
  await db.todo.add({
    item: texto.value,
    status: ''
  })
  await loadItens()
}

async function loadItens() {
  ul.innerHTML = "";
  itensDB = await db.todo.toArray()
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
  await db.todo.delete(i);
  await loadItens()
}

await loadItens()