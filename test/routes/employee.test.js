const { expect } = require("@jest/globals");
const cheerio = require("cheerio");

describe("Employee Routes", () => {
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
