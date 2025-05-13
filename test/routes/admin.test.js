const { expect } = require("@jest/globals");
const db = require("../../db");
const request = require("supertest");
const cheerio = require("cheerio");
const User = require("../../models/user");

describe("Admin Routes", () => {
  let admin_agent = null;

  beforeAll(async () => {
    await db.connect();
    const app = require("../../app");
    admin_agent = request.agent(app);
    const getRes = await admin_agent.get("/");
    const $ = cheerio.load(getRes.text);
    const csrfToken = $('input[name="_csrf"]').val();

    await admin_agent.post("/login").send({
      _csrf: csrfToken,
      email: "admin@admin.com",
      password: "admin123",
    });
  });

  afterAll(async () => {
    await admin_agent.get("/logout");
    await db.close();
  });

  test("GET / should render admin home page", async () => {
    const res = await admin_agent.get("/admin/");

    expect(res.statusCode).toBe(200);

    const $ = cheerio.load(res.text);
    const anchor = $("a.navbar-brand");
    const icon = anchor.find("i.fa.fa-a.fa-4");
    const text = anchor.text().trim();

    expect(anchor).toHaveLength(1);
    expect(icon).toHaveLength(1);
    expect(text).toBe("Admin Admin");
  });

  test("GET /admin/view-all-employees should return all employees", async () => {
    const res = await admin_agent.get("/admin/view-all-employees");
    expect(res.statusCode).toBe(200);

    const $ = cheerio.load(res.text);
    const title = $("title").text();

    expect(title.trim()).toBe("HRMS|All Employees");

    const employees = $("#example > tbody > tr");
    expect(employees).toHaveLength(4);
  });

  test("GET /admin/employee-profile/:id should return employee profile", async () => {
    let employeeId;
    let employeeName;
   
    const employee = await User.findOne({ type: "accounts_manager" });
    employeeId = employee._id;
    employeeName = employee.name;
  
    const res = await admin_agent.get(`/admin/employee-profile/${employeeId}`);
    expect(res.statusCode).toBe(200);

    const $ = cheerio.load(res.text);
    const title = $("title").text();
    const _employeeName = $("#name").text();

    expect(title.trim()).toBe("HRMS|Employee Profile");
    expect(_employeeName.trim()).toBe(employeeName);
  });
});
