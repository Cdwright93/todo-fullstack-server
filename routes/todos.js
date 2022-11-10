var express = require("express");
const { db } = require("../mongo");
const { uuid } = require("uuidv4");
var router = express.Router();

router.get("/", async function (req, res, next) {
	try {
		const todos = await db().collection("todos").find({}).toArray();
		res.json({
			success: true,
			todos,
		});
	} catch (err) {
		res.json({
			success: false,
			message: err.message,
		});
	}
});

router.get("/:id", async (req, res) => {
	//get one todo by id
	const { id } = req.params;
	const todo = await db().collection("todos").findOne({ _id: id });
	res.json({
		success: true,
		todo,
	});
});

//POST a new todo with a unique id and a completed status of false by default and a date of today by default
router.post("/", async (req, res) => {
	const { title } = req.body;
	const todo = {
		_id: uuid(),
		title,
		completed: false,
		date: new Date(),
	};
	await db().collection("todos").insertOne(todo);
	res.json(todo);
});

//update a todo
router.put("/:id", async (req, res, next) => {
	try {
		const todo = await db()
			.collection("todos")
			.updateOne({ _id: req.params.id }, { $set: req.body });
		res.json(todo);
	} catch (err) {
		console.log(err);
	}
});

//delete a todo
router.delete("/:id", async (req, res, next) => {
	try {
		const todo = await db()
			.collection("todos")
			.deleteOne({ _id: req.params.id });
		res.json({
			success: true,
			message: "Todo deleted",
		});
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
