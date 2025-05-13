const { expect, beforeAll, afterAll } = require("@jest/globals");
const cheerio = require("cheerio");

describe("Project Manager Routes", () => {
  let pm_agent = null;

  beforeAll(async () => {
    const request = require("supertest");
    pm_agent = request.agent(global.app);
    const getRes = await pm_agent.get("/");
    const $ = cheerio.load(getRes.text);
    const csrfToken = $('input[name="_csrf"]').val();
    
    await pm_agent.post("/login").send({
        _csrf: csrfToken,
        email: "pm@pm.com",
        password: "pm1234",
    });
    
  });

  afterAll(async () => {
    await pm_agent.get("/logout");
  });

  test("GET / should render project manager home page", async () => {
    const res = await pm_agent.get("/manager/");

    expect(res.statusCode).toBe(200);

    const $ = cheerio.load(res.text);
    const anchor = $("a.navbar-brand");
    const icon = anchor.find("i.fa.fa-a.fa-4");
    const text = anchor.text().trim();

    expect(anchor).toHaveLength(1);
    expect(icon).toHaveLength(1);
    expect(text).toBe("Project manager");
  });
});