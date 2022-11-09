import Dexie from "https://cdn.jsdelivr.net/npm/dexie@3.0.3/dist/dexie.mjs"

const db = new Dexie("toDoListDB");
const texto = document.querySelector('input')
const btnInsert = document.querySelector('.divInsert button')
const btnDeleteAll = document.querySelector('.header button')
const ul = document.querySelector('ul')

var itensDB = []

db.version(1).stores({todo: "_id"})

db.open()

ul.addEventListener('click', async function (e) {
  if(e.target.classList.contains('bx-trash')){
    removeItem(e.target.getAttribute("id"))
  }
  if(e.target.classList.contains('checkbox-edit')){
    done(e.target.checked, e.target.getAttribute("id"))
  }
});

btnDeleteAll.onclick = () => {
   db.todo.clear().then(loadItens)
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
  db.todo.add({
    _id: String(Date.now()),
    item: texto.value,
    status: ''
  }).then(loadItens)
}

async function loadItens() {
  ul.innerHTML = "";
  itensDB = await db.todo.toArray()
  itensDB.forEach((item) => {
    insertItemTela(item.item, item.status, item._id)
  })
}

function insertItemTela(text, status, id) {
  const li = document.createElement('li')
  
  li.innerHTML = `
    <div class="divLi">
      <input class="checkbox-edit "type="checkbox" ${status} id=${id} />
      <span id=${id}>${text}</span>
      <button id=${id}><i id=${id} class='bx bx-trash'></i></button>
    </div>
    `
  ul.appendChild(li)

  if (status) {
    document.querySelector(`div.divLi span[id="${id}"]`).classList.add('line-through')
  } else {
    document.querySelector(`div.divLi span[id="${id}"]`).classList.remove('line-through')
  }

  texto.value = ''
}

async function done(chk, id) {
  itensDB = await db.todo.toArray()
  let item = itensDB.filter(item => item._id == id)[0]
  if(chk){
    item.status = 'checked'
  }else{
    item.status = ''
  }
  
  db.todo.put(item,id).then(loadItens)
}

function removeItem(id) {
  db.todo.where('_id').equals(id).delete().then(loadItens)
}

await loadItens()