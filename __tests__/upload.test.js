const request = require("supertest");
const app = require("../server");
const path = require("path");

describe("Validação de tipos de arquivos no upload", () => {
  it("deve rejeitar arquivo .exe (application/x-msdownload)", async () => {
    const res = await request(app)
      .post("/files/upload")
      .field("contentType", "article")
      .attach("file", path.join(__dirname, "uploads", "test.exe"), "test.exe");

    expect(res.statusCode).toBe(400);
    expect(res.text).toMatch(/não permitido/i);
  });

  it("deve rejeitar arquivo .svg (image/svg+xml)", async () => {
    const res = await request(app)
      .post("/files/upload")
      .field("contentType", "article")
      .attach("file", path.join(__dirname, "uploads", "test.svg"), "test.svg");

    expect(res.statusCode).toBe(400);
    expect(res.text).toMatch(/não permitido/i);
  });

  it("deve aceitar arquivo .png (image/png)", async () => {
    const res = await request(app)
      .post("/files/upload")
      .field("contentType", "article")
      .attach("file", path.join(__dirname, "uploads", "test.png"), "test.png");

    expect(res.statusCode).toBe(200);
  });
});
