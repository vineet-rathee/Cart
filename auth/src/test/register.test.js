const request = require("supertest");
const app = require("../app");
const User = require("../models/user.model");

jest.mock("../models/user.model", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

describe("POST /register", () => {
  beforeAll(() => {
    process.env.JWT = "test-secret";
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("registers a new user successfully", async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      _id: "user_123",
      name: "Test User",
      email: "test@example.com",
      role: "CUSTOMER",
    });

    const payload = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };

    const response = await request(app)
      .post("/register")
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("!! user registered successfully !!");
    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(User.create).toHaveBeenCalledWith({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      role: undefined,
    });
  });

  it("returns 400 when required fields are missing", async () => {
    const response = await request(app)
      .post("/register")
      .send({
        name: "Test User",
        email: "test@example.com",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("!! provide all deatils to register !!");
    expect(User.findOne).not.toHaveBeenCalled();
    expect(User.create).not.toHaveBeenCalled();
  });

  it("returns 409 when the email already exists", async () => {
    User.findOne.mockResolvedValue({
      _id: "existing_user_123",
      email: "test@example.com",
    });

    const response = await request(app)
      .post("/register")
      .send({ name: "Another User",
        email: "test@example.com",
        password: "password123",
      });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("user already eists with given email");
    expect(User.create).not.toHaveBeenCalled();
  });
});