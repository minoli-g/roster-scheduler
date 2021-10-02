let chai = require('chai');
let chaiHttp = require('chai-http');
const server = require('../app');
let token;
let invalid_token="eyJhbGciOiJIUzI6IkpXVCJ9.eQBOuosM"
//Assertion Style
chai.should();

chai.use(chaiHttp);

//POST LOGIN
describe("POST /api/login", () => {
    it("It should POST login", (done) => {
        const login_post = {
            username: "vasanth",
            password: "vasanth"
          };
        chai.request(server)                
            .post("/api/login")
            .send(login_post)
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('auth').eq(true);
                response.body.should.have.property('result');
                response.body.should.have.property('cookie');
                token = response.body.token;
            done();
            });
    });

    it("It should NOT POST a login without the (username, password) property", (done) => {
        const login_post = {

        };
        chai.request(server)                
            .post("/api/login")
            .send(login_post)
            .end((err, response) => {
                response.should.have.status(403);
                response.body.should.have.property('err')      
                done();
            });
    });

});


//GET LOGIN DETAILS
describe("GET /api/login",()=>{
    it("It should get the current user details with token",(done)=>{
        chai.request(server)
        .get("/api/login")
        .set('x-access-token',token)
        .end((err, response)=>{
            response.should.have.status(200);
            response.body.should.have.property('result');
            done();
        })
    })


    it("It should get the current user details without token",(done)=>{
        chai.request(server)
        .get("/api/login")
        .set('x-access-token', "")
        .end((err, response)=>{
            response.should.have.status(401);
            response.body.should.have.property('err').eq(" Hi, we need a token");
            done();
        })
    })
       
    it("It should get the current user details with invalid token",(done)=>{
        chai.request(server)
        .get("/api/login")
        .set('x-access-token', invalid_token)
        .end((err, response)=>{
            response.should.have.status(401);
            response.body.should.have.property('auth').eq(false);
            response.body.should.have.property('message').eq("You failed to authenticate");

            done();
        })
    })

})


//POST LEAVE DETAILS
describe("POST /api/leave", () => {
    it("It should POST leave with token", (done) => {
        const leave_post = {
            userid: 96,
            date: "2019-12-23"
          };
        chai.request(server)                
            .post("/api/leave")
            .set('x-access-token',token)
            .send(leave_post)
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.have.property('result');
            done();
            });
    });

    it("It should NOT POST a leave with invalid userID with token", (done) => {
        const leave_post = {

        };
        chai.request(server)                
            .post("/api/leave")
            .set('x-access-token',token)
            .send(leave_post)
            .end((err, response) => {
                response.should.have.status(500);
                response.body.should.have.property('err').eq("Internel server error"); 
                done();
            });
        })


    it("It should NOT POST leave without token", (done) => {
        const leave_post = {
            userid: 96,
            date: "2019-12-23"
        };
        chai.request(server)                
            .post("/api/leave")
            .set('x-access-token','')
            .send(leave_post)
            .end((err, response) => {
                response.should.have.status(401);
                response.body.should.have.property('err').eq(" Hi, we need a token");
                done();
            });
    });
})


    //POST REPORT DETAILS

    describe("POST /api/report", () => {
        it("It should POST report with token", (done) => {
            const report_post = {
                userid: 96,
                msg: "hi i am vasanth",
                date: "2019-12-23"
              }
            chai.request(server)                
                .post("/api/report")
                .set('x-access-token',token)
                .send(report_post)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.have.property('result');
                done();
                });
        });
    
        it("It should NOT POST a report with invalid userID", (done) => {
            const report_post = {
    
            };
            chai.request(server)                
                .post("/api/report")
                .set('x-access-token',token)
                .send(report_post)
                .end((err, response) => {
                    response.should.have.status(500);
                    response.body.should.have.property('err').eq("Internel server error"); 
                    done();
                });
        });
    
    
        it("It should NOT POST report without token", (done) => {
            const report_post = {
                userid: 96,
                msg: "hi i am vasanth",
                date: "2019-12-23"
              }
            chai.request(server)                
                .post("/api/report")
                .set('x-access-token','')
                .send(report_post)
                .end((err, response) => {
                    response.should.have.status(401);
                    response.body.should.have.property('err').eq(" Hi, we need a token");
                    done();
                });
        });
    });


    //POST PREFERENCES DETAILS
    describe("POST /api/preslot", () => {
        it("It should POST preferences with token", (done) => {
            const pref_post = {
                userid: 96,
                datelist: ["2019-12-23","2019-12-24","2019-12-25","2019-12-26","2019-12-27"]
            }
            chai.request(server)                
                .post("/api/preslot")
                .set('x-access-token',token)
                .send(pref_post)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.have.property('message').eq("Updated successfully");
                done();
                });
        });

    
        it("It should NOT POST a preferences with invalid userID", (done) => {
            const pref_post = {
    
            };
            chai.request(server)                
                .post("/api/preslot")
                .set('x-access-token',token)
                .send(pref_post)
                .end((err, response) => {
                    response.should.have.status(403);
                    response.body.should.have.property('err');
                    done();
                });
        });

        it("It should NOT POST preferences without token", (done) => {
            const pref_post = {
                userid: 96,
                datelist: ["2019-12-23","2019-12-24","2019-12-25","2019-12-26","2019-12-27"]
            }
            chai.request(server)                
                .post("/api/preslot")
                .set('x-access-token',"")
                .send(pref_post)
                .end((err, response) => {
                    response.should.have.status(401);
                    response.body.should.have.property('err').eq(" Hi, we need a token");
                done();
                });
        });
    
    
        
    });

    // GET LEAVE DETAILS
    describe("GET /api/viewleave", () => {
    it("It should GET leave details with token", (done) => {
        chai.request(server)                
            .get("/api/viewleave")
            .set('x-access-token',token)
            .end((err, response) => {
                if (response.status===404) {
                    response.body.should.have.property('err').eq("Not found");
                }
                else{
                    response.should.have.status(200);
                    response.body.should.have.property('result');
                }
            done();
            });
    });

    it("It SHOULD NOT get the leave details without token",(done)=>{
        chai.request(server)
        .get("/api/viewleave")
        .set('x-access-token', "")
        .end((err, response)=>{
            response.should.have.status(401);
            response.body.should.have.property('err').eq(" Hi, we need a token");
            done();
        })
    })
})

//GET REPOPRT DETAILS

describe("GET /api/viewreport", () => {
    it("It should GET report details with token", (done) => {
        chai.request(server)                
            .get("/api/viewreport")
            .set('x-access-token',token)
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.have.property('result');
            done();
            });
    });

    it("It SHOULD NOT get the report details without token",(done)=>{
        chai.request(server)
        .get("/api/viewreport")
        .set('x-access-token', "")
        .end((err, response)=>{
            response.should.have.status(401);
            response.body.should.have.property('err').eq(" Hi, we need a token");
            done();
        })
    })
})

// USER PROFILE



