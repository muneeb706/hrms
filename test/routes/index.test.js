const { expect } = require("@jest/globals");
const cheerio = require("cheerio");

describe("Authentication", function () {
  let csrfToken;

  beforeAll(async () => {
    const getRes = await agent.get("/");
    const $ = cheerio.load(getRes.text);
    csrfToken = $('input[name="_csrf"]').val();
  });

  afterAll(async () => {
    const res = await agent.get("/logout");
    expect(res.statusCode).toEqual(302);
    expect(res.headers.location).toEqual('/');
  });

  test("GET / should render login page if not authenticated", async () => {
    const res = await agent.get("/");
    expect(res.statusCode).toBe(200);
  });

  describe("POST /login", () => {
    test("should redirect to /check-type on success", async () => {
      const res = await agent.post("/login").send({
        _csrf: csrfToken,
        email: "admin@admin.com",
        password: "admin123",
      });
      expect(res.statusCode).toEqual(302);
      expect(res.headers.location).toEqual("/check-type");
    });

    test("should redirect to / on failure", async () => {
      const res = await agent
        .post("/login")
        .send({_csrf: csrfToken, email: "admin@test.com", password: "test" });
      expect(res.statusCode).toEqual(302);
      expect(res.headers.location).toEqual("/");
    });
  });
});