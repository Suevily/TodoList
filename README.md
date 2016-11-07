# API

## TodoList

* `GET` `/api/todos` list all todos

```javascript
	//response
	[
		{
			todo: String,
			date: String, /*(yyyy-MM-dd hh:mm)*/
			done: Boolean,
			id: Number
		}
	]
```

* `GET` `/api/todos?search=` search specific todos by giving specific content

```javascript
	//response
	[
		{
			todo: String,
			date: String, /*(yyyy-MM-dd hh:mm)*/
			done: Boolean,
			id: Number
		}
	]
```

* `POST` `/api/todo/:id` update a specific todo

```javascript
	//request (here receives an object only with properties that need updating)
	{ //example:
		todo: String,
		date: String, /*(yyyy-MM-dd hh:mm)*/
		done: Boolean
	}

	//response
	{
		id:Number //return id pointing to item that has been successfully updated
	}
	//return 'failure' if failed to update the item which means that the given id does not exist
```

* `PUT` `/api/todos` create new todos

```javascript
	//request (here received an array of objects)
	[
		{
			todo: String,
			date: String, /*(yyyy-MM-dd hh:mm)*/
			done: Boolean
		}
	]

	//response
	[Number] //return an array containing ids pointing to items that have been successfully created
```

* `DELETE` `/api/todo/:id` delete a specific todo

```javascript
	//response
	{
		id:Number //return id pointing to item that has been successfully deleted
	}
	//return 'failure' if failed to update the item which means that the given id does not exist
```
