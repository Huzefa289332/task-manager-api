const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { userOneID, userOne, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should signup a new user", async () => {
	const response = await request(app)
		.post("/users")
		.send({
			name: "test1",
			email: "test1@test.com",
			password: "12345678",
		})
		.expect(201);

	// Assert that the database was changed correctly
	const user = await User.findById(response.body.user._id);
	expect(user).not.toBeNull();

	//Assertion about the response
	expect(response.body).toMatchObject({
		user: {
			name: "test1",
			email: "test1@test.com",
		},
		token: user.tokens[0].token,
	});

	expect(user.password).not.toBe("12345678");
});

test("Should login existing user", async () => {
	const response = await request(app)
		.post("/users/login")
		.send({
			email: userOne.email,
			password: userOne.password,
		})
		.expect(200);
	const user = await User.findById(userOneID);
	expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should not login nonexistent user", async () => {
	await request(app)
		.post("/users/login")
		.send({
			email: userOne.email,
			password: "123456789",
		})
		.expect(400);
});

test("Should get profile for the user", async () => {
	await request(app)
		.get("/users/me")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200);
});

test("Should not get profile for unauthorized user", async () => {
	await request(app).get("/users/me").send().expect(404);
});

test("Should delete account for user", async () => {
	await request(app)
		.delete("/users/me")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200);
	const user = await User.findById(userOneID);
	expect(user).toBeNull();
});

test("Should not delete account for unauthenticated user", async () => {
	await request(app).delete("/users/me").send().expect(404);
});

test("Should upload avatar", async () => {
	await request(app)
		.post("/users/me/avatar")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.attach("avatar", "tests/fixtures/profile-pic.jpg")
		.expect(200);
	const user = await User.findById(userOneID);
	expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields", async () => {
	await request(app)
		.patch("/users/me")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send({
			name: "test-u",
		})
		.expect(200);
	const user = await User.findById(userOneID);
	expect(user.name).toEqual("test-u");
});

test("Should not update invalid user fields", async () => {
	await request(app)
		.patch("/users/me")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send({
			location: "Karachi",
		})
		.expect(400);
});
