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

// Click handler for entire DIV container
ul.addEventListener('click', async function (e) {
  if(e.target.classList.contains('bx-trash')){
    await removeItem(e.target.getAttribute("data-i"))
  }
  if(e.target.classList.contains('checkbox-edit')){
    await done(e.target.checked, e.target.getAttribute("data-i"))
  }
});


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
  itensDB.forEach((item, i) => {
    insertItemTela(item.item, item.status, i)
  })
}

function insertItemTela(text, status, i) {
  const li = document.createElement('li')
  
  li.innerHTML = `
    <div class="divLi">
      <input class="checkbox-edit "type="checkbox" ${status} data-i=${i+1} />
      <span data-si=${i+1}>${text}</span>
      <button data-i=${i+1}><i data-i=${i+1} class='bx bx-trash'></i></button>
    </div>
    `
  ul.appendChild(li)

  if (status) {
    document.querySelector(`[data-si="${i+1}"]`).classList.add('line-through')
  } else {
    document.querySelector(`[data-si="${i+1}"]`).classList.remove('line-through')
  }

  texto.value = ''
}

async function done(chk, i) {
  itensDB = await db.todo.toArray()
  let item = itensDB.filter(item => item.id == i)[0]
  if(chk){
    item.status = 'checked'
  }else{
    item.status = ''
  }
  
  await db.todo.put(item,i);
  await loadItens()
}

async function removeItem(i) {
  console.log(i)
  await db.todo.delete(i)
  await loadItens()
}

await loadItens()