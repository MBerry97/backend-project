const app = require("../app");
const request = require("supertest");
const connection = require("../connection");

// beforeEach(() => {
//   return connection.seed.run();
// });

afterAll(() => {
  return connection.destroy();
});

describe("/api", () => {
  it("GET request to invalid paths produce a 404", () => {
    return request(app).get("/api/jopikz").expect(404);
  });
  describe("/topics", () => {
    it("GET /topics should return with a 200", () => {
      return request(app).get("/api/topics/").expect(200);
    });
    it("GET /topics should return an object with a topics key which the value is an array", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          const values = Object.values(res.body.topics);
          console.log(values);
          expect(Object.keys(res.body)[0]).toBe("topics");
          expect(Array.isArray(res.body.topics)).toBe(true);
        });
    });
    it("GET /topics array should contain objects with the keys slug and description", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          expect(res.body.topics[0].slug).toEqual("mitch");
          expect(res.body.topics[0].description).toEqual(
            "The man, the Mitch, the legend"
          );
        });
    });
  });
  describe("/users/:username", () => {
    it("GET /users/:username should return with a 200 status code", () => {
      return request(app).get("/api/users/icellusedkars").expect(200);
    });
    it("GET /users/:username returns an object", () => {
      return request(app)
        .get("/api/users/icellusedkars")
        .expect(200)
        .then((res) => {
          expect(typeof res.body).toBe("object");
        });
    });
    it("GET /users/:username returns an object with a key of user", () => {
      return request(app)
        .get("/api/users/icellusedkars")
        .expect(200)
        .then((res) => {
          const keysOfRes = Object.keys(res.body);
          expect(keysOfRes).toEqual(expect.arrayContaining(["user"]));
        });
    });
    it("GET /user/:username returns the values as an array containing an object of the correct user", () => {
      return request(app)
        .get("/api/users/icellusedkars")
        .expect(200)
        .then((res) => {
          const keysOfRes = Object.keys(res.body.user[0]);
          expect(Array.isArray(res.body.user)).toBe(true);
          expect(res.body.user[0].username).toBe("icellusedkars");
          expect(keysOfRes).toEqual(
            expect.arrayContaining(["username", "avatar_url", "name"])
          );
        });
    });
    it("GET request to invalid URL return a 404", () => {
      return request(app)
        .get("/api/userrrr/isellkkars")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("path not found");
        });
    });
    it("GET request to valid path but the user does not exists returns a 404", () => {
      return request(app)
        .get("/api/users/notAcorrectUser")
        .expect(404)
        .then((res) => {
          console.log(res.body);
          expect(res.body.msg).toBe("this user does not exist");
        });
    });
  });
  describe.only("/articles/:article_id", () => {
    it("GET /articles/:article_id Returns a 200 status code when path is valid", () => {
      return request(app).get("/api/articles/1").expect(200);
    });
    it("GET /articles/:article_id return an object with the key of article", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((res) => {
          console.log(res.body);
          expect(res.body).toHaveProperty("article");
        });
    });
    it("GET /articles/:article_id returns an object with the key of article which is an array containing an object of the correct keys", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((res) => {
          console.log(res.body);
          const keysOfArticle = Object.keys(res.body.article[0]);
          console.log(keysOfArticle);
          expect(Array.isArray(res.body.article)).toBe(true);
          expect(keysOfArticle).toEqual(
            expect.arrayContaining([
              "article_id",
              "title",
              "body",
              "votes",
              "topic",
              "author",
              "created_at",
            ])
          );
        });
    });
    it("GET request to a invalid path returns a 404", () => {
      return request(app).get("/api/artiklez/2").expect(404);
    });
    it("GET request to valid path but invalid article returns 404", () => {
      return request(app)
        .get("/api/articles/100")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("this article does not exist");
        });
    });
  });
});
