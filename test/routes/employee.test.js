const { expect } = require("@jest/globals");
const cheerio = require("cheerio");
const db = require("../../db");
const request = require("supertest");

describe("Employee Routes", () => {
  let employee_agent = null;

  beforeAll(async () => {
    await db.connect();
    const app = require("../../app");
    employee_agent = request.agent(app);
    const getRes = await employee_agent.get("/");
    const $ = cheerio.load(getRes.text);
    const csrfToken = $('input[name="_csrf"]').val();

    await employee_agent.post("/login").send({
      _csrf: csrfToken,
      email: "employee1@employee.com",
      password: "123456",
    });
  });

  afterAll(async () => {
    await employee_agent.get("/logout");
    await db.close();
  });

  test("GET / should render employee home page", async () => {
    const res = await employee_agent.get("/employee/");

    expect(res.statusCode).toBe(200);

    const $ = cheerio.load(res.text);
    const anchor = $("a.navbar-brand");
    const icon = anchor.find("i.fa.fa-a.fa-4");
    const text = anchor.text().trim();

    expect(anchor).toHaveLength(1);
    expect(icon).toHaveLength(1);
    expect(text).toBe("Employee One");
  });
});
