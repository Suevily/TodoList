'use strict'

const fs = require('fs')
const Koa = require('koa')
const path = require('path')
const serve = require('koa-static')
const router = require('koa-router')()
const bodyparser = require('koa-bodyparser')

const loggerMiddleware = require('./logger')

//Define an object to storage todos
let todolist = {nextID:1}
//Get the path of the file storaging data
const filepath = path.join(path.resolve('.'), 'data.json')

//Read data from file
try {
	//Check whether data.js has existed, if not, create it
	if (!fs.existsSync(filepath)) {
		fs.openSync(filepath, 'a')
		fs.writeFileSync(filepath, JSON.stringify(todolist, null, ' '))
	}
	todolist = JSON.parse(fs.readFileSync(filepath, 'utf-8'))
} catch (err) {
	console.log(err)
}

const app = new Koa()
app.use(loggerMiddleware)
app.use(serve(__dirname + '/public'))
app.use(bodyparser())
app.use(router.routes())

app.listen(3000)

//List all todos
router.get('/api/todos', async (ctx, next) => {
	if (ctx.query.search)
		return await searchTodos(ctx, next)
	ctx.body = JSON.stringify(todolist, null, ' ')
})

//Update a todo matching the given id with new contents
router.post('/api/todo/:id', async (ctx, next) => {
	const id = ctx.params.id
	//Here receives a single object only with properties that need updating
	const postdata = ctx.request.body 

	if (todolist.hasOwnProperty(id) && todolist[id]) {
		for (let key in postdata) {
			todolist[id][key] = postdata[key]
		}
		await updateToFile()
		ctx.body = JSON.stringify({id:id}, null, ' ')
	} else { //The given id does not exist
		ctx.body = 'failure'
		ctx.status = 400
	}
})

//Create new todos
router.put('/api/todos', async (ctx, next) => {
	//Here receives an array of objects
	const postdata = ctx.request.body 
	let ids = []

	let id = todolist.nextID
	for (let i in postdata) {
		todolist[id] = postdata[i]
		ids.push(id++)
	}
	todolist.nextID = id;

	await updateToFile()
	ctx.body = JSON.stringify(ids, null, ' ')
})

//Delete a todo matching the given id
router.del('/api/todo/:id', async (ctx, next) => {
	const id = ctx.params.id

	if (todolist.hasOwnProperty(id) && todolist[id]) {
		delete todolist[id]
		await updateToFile()
		ctx.body = JSON.stringify({id:id}, null, ' ')
	} else { //The given id does not exist
		ctx.status = 400
		ctx.body = 'failure'
	}
})

//Function to search todos with the specific content
async function searchTodos(ctx, next) {
	//Get search content from request
	const content = ctx.query.search
	//Define an object to storage the matched todos
	let matchedTodos = {}

	for (let i in todolist) {
		if (todolist.hasOwnProperty(i) && todolist[i] && i !== 'nextID') {
			if (todolist[i].todo.includes(content)) {
				matchedTodos[i] = todolist[i]
			}
		}
	}
	ctx.body = JSON.stringify(matchedTodos, null, ' ')
}

//Function to update data to file
async function updateToFile() {
	try {
		fs.writeFileSync(filepath, JSON.stringify(todolist, null, ' '))
	} catch (err) {
		console.log(err)
	}
}
