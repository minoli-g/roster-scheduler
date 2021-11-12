let chai = require("chai");
let chaiHttp = require("chai-http");
const server = require("../app");
let token;
let invalid_token = "eyJhbGciOiJIUzI6IkpXVCJ9.eQBOuosM";
let db = require("../config/db");
let bcrypt = require("bcrypt");
let userData = {
  username: "prathees",
  first_name: "prabakaran",
  last_name: "velupillai",
  password: "prathees",
  type: "doctor",
};
let user_ID = 123456789;
//Assertion Style
chai.should();

chai.use(chaiHttp);

//POST LOGIN
describe("POST /doctor/login", () => {
  before(async () => {
    await db.query(
      "UPDATE `user` SET `username`=?,`first_name` = ?,`last_name`=?, `password`=? WHERE `user_id` = ?;",
      [
        "prathees",
        "prabakaran",
        "velupillai",
        bcrypt.hashSync("prathees", 10),
        user_ID,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
        }
      }
    );
  });
  it("It should POST login", (done) => {
    const login_post = {
      username: userData.username,
      password: userData.password,
    };
    chai
      .request(server)
      .post("/doctor/login")
      .send(login_post)
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.be.a("object");
        response.body.should.have.property("auth").eq(true);
        response.body.should.have.property("result");
        token = response.body.token;
        done();
      });
  });

  it("It should NOT POST a login without the (username, password) property", (done) => {
    const login_post = {};
    chai
      .request(server)
      .post("/doctor/login")
      .send(login_post)
      .end((err, response) => {
        response.should.have.status(403);
        response.body.should.have.property("err");
        done();
      });
  });
});

//GET LOGIN DETAILS
describe("GET /doctor/login", () => {
  it("It should get the current user details with token", (done) => {
    chai
      .request(server)
      .get("/doctor/login")
      .set("x-access-token", token)
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.have.property("result");
        done();
      });
  });

  it("It should get the current user details without token", (done) => {
    chai
      .request(server)
      .get("/doctor/login")
      .set("x-access-token", "")
      .end((err, response) => {
        response.should.have.status(401);
        response.body.should.have.property("err").eq(" Hi, we need a token");
        done();
      });
  });

  it("It should not get the current user details with invalid token", (done) => {
    chai
      .request(server)
      .get("/doctor/login")
      .set("x-access-token", invalid_token)
      .end((err, response) => {
        response.should.have.status(401);
        response.body.should.have.property("auth").eq(false);
        response.body.should.have
          .property("message")
          .eq("You failed to authenticate");

        done();
      });
  });
});

//POST LEAVE DETAILS
describe("POST /doctor/leave", () => {
  it("It should POST leave with token", (done) => {
    const leave_post = {
      userid: user_ID,
      date: "2019-12-23",
    };
    chai
      .request(server)
      .post("/doctor/leave")
      .set("x-access-token", token)
      .send(leave_post)
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.have.property("result");
        done();
      });
  });

  it("It should NOT POST a leave with invalid userID with token", (done) => {
    const leave_post = {};
    chai
      .request(server)
      .post("/doctor/leave")
      .set("x-access-token", token)
      .send(leave_post)
      .end((err, response) => {
        response.should.have.status(500);
        response.body.should.have.property("err").eq("Internel server error");
        done();
      });
  });

  it("It should NOT POST leave without token", (done) => {
    const leave_post = {
      userid: user_ID,
      date: "2019-12-23",
    };
    chai
      .request(server)
      .post("/doctor/leave")
      .set("x-access-token", "")
      .send(leave_post)
      .end((err, response) => {
        response.should.have.status(401);
        response.body.should.have.property("err").eq(" Hi, we need a token");
        done();
      });
  });
});

//POST REPORT DETAILS

describe("POST /doctor/report", () => {
  it("It should POST report with token", (done) => {
    const report_post = {
      userid: user_ID,
      msg: "hi i am vasanth",
      date: "2019-12-23",
    };
    chai
      .request(server)
      .post("/doctor/report")
      .set("x-access-token", token)
      .send(report_post)
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.have.property("result");
        done();
      });
  });

  it("It should NOT POST a report with invalid userID", (done) => {
    const report_post = {};
    chai
      .request(server)
      .post("/doctor/report")
      .set("x-access-token", token)
      .send(report_post)
      .end((err, response) => {
        response.should.have.status(500);
        response.body.should.have.property("err").eq("Internel server error");
        done();
      });
  });

  it("It should NOT POST report without token", (done) => {
    const report_post = {
      userid: user_ID,
      msg: "hi i am vasanth",
      date: "2019-12-23",
    };
    chai
      .request(server)
      .post("/doctor/report")
      .set("x-access-token", "")
      .send(report_post)
      .end((err, response) => {
        response.should.have.status(401);
        response.body.should.have.property("err").eq(" Hi, we need a token");
        done();
      });
  });
});

//POST PREFERENCES DETAILS
describe("POST /doctor/preslot", () => {
  it("It should POST preferences with token", (done) => {
    const pref_post = {
      userid: user_ID,
      datelist: [
        "2019-12-23",
        "2019-12-24",
        "2019-12-25",
        "2019-12-26",
        "2019-12-27",
      ],
    };
    chai
      .request(server)
      .post("/doctor/preslot")
      .set("x-access-token", token)
      .send(pref_post)
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.have
          .property("message")
          .eq("Updated successfully");
        done();
      });
  });

  it("It should NOT POST a preferences with invalid userID", (done) => {
    const pref_post = {};
    chai
      .request(server)
      .post("/doctor/preslot")
      .set("x-access-token", token)
      .send(pref_post)
      .end((err, response) => {
        response.should.have.status(403);
        response.body.should.have.property("err");
        done();
      });
  });

  it("It should NOT POST preferences without token", (done) => {
    const pref_post = {
      userid: user_ID,
      datelist: [
        "2019-12-23",
        "2019-12-24",
        "2019-12-25",
        "2019-12-26",
        "2019-12-27",
      ],
    };
    chai
      .request(server)
      .post("/doctor/preslot")
      .set("x-access-token", "")
      .send(pref_post)
      .end((err, response) => {
        response.should.have.status(401);
        response.body.should.have.property("err").eq(" Hi, we need a token");
        done();
      });
  });
});

// GET LEAVE DETAILS
describe("GET /doctor/viewleave", () => {
  it("It should GET leave details with token", (done) => {
    chai
      .request(server)
      .get("/doctor/viewleave")
      .set("x-access-token", token)
      .query({ id: user_ID })
      .end((err, response) => {
        if (response.status === 404) {
          response.body.should.have.property("err").eq("Not found");
        } else {
          response.should.have.status(200);
          response.body.should.have.property("result");
        }
        done();
      });
  });

  it("It SHOULD NOT get the leave details without token", (done) => {
    chai
      .request(server)
      .get("/doctor/viewleave")
      .set("x-access-token", "")
      .end((err, response) => {
        response.should.have.status(401);
        response.body.should.have.property("err").eq(" Hi, we need a token");
        done();
      });
  });
});

//GET REPOPRT DETAILS

describe("GET /doctor/viewreport", () => {
  it("It should GET report details with token", (done) => {
    chai
      .request(server)
      .get("/doctor/viewreport")
      .set("x-access-token", token)
      .query({ id: user_ID })
      .end((err, response) => {
        if (response.status === 404) {
          response.body.should.have.property("err").eq("Not found");
        } else {
          response.should.have.status(200);
          response.body.should.have.property("result");
        }
        done();
      });
  });

  it("It SHOULD NOT get the report details without token", (done) => {
    chai
      .request(server)
      .get("/doctor/viewreport")
      .set("x-access-token", "")
      .end((err, response) => {
        response.should.have.status(401);
        response.body.should.have.property("err").eq(" Hi, we need a token");
        done();
      });
  });
});

//GET ALL DOCTORS
describe("GET /doctor/doctors", () => {
  it("It should GET all doctors with token", (done) => {
    chai
      .request(server)
      .get("/doctor/doctors")
      .set("x-access-token", token)
      .end((err, response) => {
        if (response.status === 404) {
          response.body.should.have.property("err").eq("Not found");
        } else {
          response.should.have.status(200);
          response.body.should.have.property("result");
        }
        done();
      });
  });

  it("It SHOULD NOT get the doctors without token", (done) => {
    chai
      .request(server)
      .get("/doctor/doctors")
      .set("x-access-token", "")
      .end((err, response) => {
        response.should.have.status(401);
        response.body.should.have.property("err").eq(" Hi, we need a token");
        done();
      });
  });
});

//GET DOCTOR
describe("GET /doctor/doctor", () => {
  it("It should GET doctor with token", (done) => {
    chai
      .request(server)
      .get("/doctor/doctor")
      .set("x-access-token", token)
      .query({ id: user_ID })
      .end((err, response) => {
        if (response.status === 404) {
          response.body.should.have.property("err").eq("Not found");
        } else {
          response.should.have.status(200);
          response.body.should.have.property("result");
        }
        done();
      });
  });

  it("It SHOULD NOT get the doctor without token", (done) => {
    chai
      .request(server)
      .get("/doctor/doctor")
      .set("x-access-token", "")
      .end((err, response) => {
        response.should.have.status(401);
        response.body.should.have.property("err").eq(" Hi, we need a token");
        done();
      });
  });
});

//GET ALL WARDS
describe("GET /doctor/wards", () => {
  it("It should GET all wards with token", (done) => {
    chai
      .request(server)
      .get("/doctor/wards")
      .set("x-access-token", token)
      .end((err, response) => {
        if (response.status === 404) {
          response.body.should.have.property("err").eq("Not found");
        } else {
          response.should.have.status(200);
          response.body.should.have.property("result");
        }
        done();
      });
  });

  it("It SHOULD NOT get the wards without token", (done) => {
    chai
      .request(server)
      .get("/doctor/wards")
      .set("x-access-token", "")
      .end((err, response) => {
        response.should.have.status(401);
        response.body.should.have.property("err").eq(" Hi, we need a token");
        done();
      });
  });
});

//GET ROSTER
describe("GET /doctor/roster", () => {
  it("It should GET roster with token", (done) => {
    chai
      .request(server)
      .get("/doctor/roster")
      .set("x-access-token", token)
      .end((err, response) => {
        if (response.status === 404) {
          response.body.should.have.property("err").eq("Not found");
        } else {
          response.should.have.status(200);
          response.body.should.have.property("result");
        }
        done();
      });
  });

  it("It SHOULD NOT get the roster without token", (done) => {
    chai
      .request(server)
      .get("/doctor/roster")
      .set("x-access-token", "")
      .end((err, response) => {
        response.should.have.status(401);
        response.body.should.have.property("err").eq(" Hi, we need a token");
        done();
      });
  });
});

// USER PROFILE
describe("POST /doctor/edit", () => {
  it("It should POST profile details with token", (done) => {
    const profile_post = {
      username: "sathu",
      fname: "thayaparan",
      lname: "moorthy",
      userid: user_ID,
    };
    chai
      .request(server)
      .post("/doctor/edit")
      .set("x-access-token", token)
      .send(profile_post)
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.have.property("auth").eq(true);
        response.body.should.have.property("result");
        done();
      });
  });

  it("It should not POST profile details with token and without username,firstname, lastname", (done) => {
    const profile_post = {
      userid: user_ID,
    };
    chai
      .request(server)
      .post("/doctor/edit")
      .set("x-access-token", token)
      .send(profile_post)
      .end((err, response) => {
        response.should.have.status(400);
        response.body.should.have.property("err");
        done();
      });
  });
  it("It should not POST profile details with token and without any details", (done) => {
    const profile_post = {};
    chai
      .request(server)
      .post("/doctor/edit")
      .set("x-access-token", token)
      .send(profile_post)
      .end((err, response) => {
        response.should.have.status(403);
        response.body.should.have.property("err");
        done();
      });
  });

  it("It SHOULD NOT post details without token", (done) => {
    chai
      .request(server)
      .post("/doctor/edit")
      .set("x-access-token", "")
      .end((err, response) => {
        response.should.have.status(401);
        response.body.should.have.property("err").eq(" Hi, we need a token");
        done();
      });
  });
});
//POST PASSWORD CHANGE DETAILS

describe("POST /doctor/password", () => {
  it("It should POST password details with token", (done) => {
    const password_post = {
      curpass: "prathees",
      conpass: "sathu",
      userid: user_ID,
    };
    chai
      .request(server)
      .post("/doctor/password")
      .set("x-access-token", token)
      .send(password_post)
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.have
          .property("message")
          .eq("Password updated successfully");
        done();
      });
  });

  it("It should not POST password details with token and wrong current password", (done) => {
    const password_post = {
      curpass: "sharma",
      conpass: "prathees",
      userid: user_ID,
    };
    chai
      .request(server)
      .post("/doctor/password")
      .set("x-access-token", token)
      .send(password_post)
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.have.property("err").eq("Wrong current password");
        done();
      });
  });
  it("It should not POST password details with empty details", (done) => {
    const password_post = {};
    chai
      .request(server)
      .post("/doctor/edit")
      .set("x-access-token", token)
      .send(password_post)
      .end((err, response) => {
        response.should.have.status(403);
        response.body.should.have.property("err");
        done();
      });
  });

  it("It SHOULD NOT post details without token", (done) => {
    chai
      .request(server)
      .post("/doctor/edit")
      .set("x-access-token", "")
      .end((err, response) => {
        response.should.have.status(401);
        response.body.should.have.property("err").eq(" Hi, we need a token");
        done();
      });
  });
});

//GET ALL WORKING_HOURS
describe("GET /doctor/hours", () => {
  it("It should GET doctor with token", (done) => {
    chai
      .request(server)
      .get("/doctor/doctor")
      .set("x-access-token", token)
      .query({ id: user_ID })
      .end((err, response) => {
        if (response.status === 404) {
          response.body.should.have.property("err").eq("Not found");
        } else {
          response.should.have.status(200);
          response.body.should.have.property("result");
        }
        done();
      });
  });

  it("It SHOULD NOT get the doctor without token", (done) => {
    chai
      .request(server)
      .get("/doctor/doctor")
      .set("x-access-token", "")
      .end((err, response) => {
        response.should.have.status(401);
        response.body.should.have.property("err").eq(" Hi, we need a token");
        done();
      });
  });
});

//GET PREFERENCES
describe("GET /doctor/selectedSlots", () => {
  it("It should GET preferences with token", (done) => {
    chai
      .request(server)
      .get("/doctor/selectedSlots")
      .set("x-access-token", token)
      .query({ wardid: 1, year: 2015, month: 08 })
      .end((err, response) => {
        if (response.status === 404) {
          response.body.should.have.property("err").eq("Not found");
        } else {
          response.should.have.status(200);
          response.body.should.have.property("result");
        }
        done();
      });
  });

  it("It SHOULD NOT get the preferences without token", (done) => {
    chai
      .request(server)
      .get("/doctor/selectedSlots")
      .set("x-access-token", "")
      .end((err, response) => {
        response.should.have.status(401);
        response.body.should.have.property("err").eq(" Hi, we need a token");
        done();
      });
  });
});
