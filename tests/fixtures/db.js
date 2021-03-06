const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");

const userOneID = new mongoose.Types.ObjectId();
const userOne = {
	_id: userOneID,
	name: "test-One",
	email: "test_one@test.com",
	password: "12345678",
	tokens: [
		{
			token: jwt.sign({ _id: userOneID }, process.env.JWT_SECRET),
		},
	],
};

const userTwoID = new mongoose.Types.ObjectId();
const userTwo = {
	_id: userTwoID,
	name: "test-two",
	email: "test_two@test.com",
	password: "123456789",
	tokens: [
		{
			token: jwt.sign({ _id: userTwoID }, process.env.JWT_SECRET),
		},
	],
};

const taskOne = {
	_id: new mongoose.Types.ObjectId(),
	description: "First task",
	completed: false,
	owner: userOne._id,
};
const taskTwo = {
	_id: new mongoose.Types.ObjectId(),
	description: "Second task",
	completed: true,
	owner: userOne._id,
};

const taskThree = {
	_id: new mongoose.Types.ObjectId(),
	description: "Third task",
	completed: true,
	owner: userTwo._id,
};

const setupDatabase = async () => {
	await User.deleteMany();
	await Task.deleteMany();
	await new User(userOne).save();
	await new User(userTwo).save();
	await new Task(taskOne).save();
	await new Task(taskTwo).save();
	await new Task(taskThree).save();
};

module.exports = {
	userOneID,
	userTwoID,
	userOne,
	userTwo,
	taskOne,
	taskTwo,
	taskThree,
	setupDatabase,
};
