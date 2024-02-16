const { expect } = require("@jest/globals");
const db = require("../../db");
const cheerio = require("cheerio");
const User = require("../../models/user");

describe("Admin Routes", () => {
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
    await db.connect().then(async () => {
      const employee = await User.findOne({ type: "accounts_manager" });
      employeeId = employee._id;
      employeeName = employee.name;
      db.close();
    });

    const res = await admin_agent.get(`/admin/employee-profile/${employeeId}`);
    expect(res.statusCode).toBe(200);

    const $ = cheerio.load(res.text);
    const title = $("title").text();
    const _employeeName = $("#name").text();

    expect(title.trim()).toBe("HRMS|Employee Profile");
    expect(_employeeName.trim()).toBe(employeeName);
  });
});
