const ifLoggedIn = require('../middleware/SessionCheck').ifLoggedIn;
const ifNotLoggedIn = require('../middleware/SessionCheck').ifNotLoggedIn;
    

describe('ifLoggedIn Middleware', () => {
    
    const res = {
        render: jest.fn(),
        redirect: jest.fn()
    };

    const next = jest.fn();
    


    it("should call next() if user exists in request session", async () => {
        var req = {session:{ user: {id: 100}}};
        ifLoggedIn(req,res,next);
        expect(next).toHaveBeenCalled();

    });

    it("should redirect to root page if no user exists in request session", async () => {
        var req = {session:{}};
        ifLoggedIn(req,res,next);
        expect(res.redirect).toHaveBeenCalledWith('/');
    })

});

describe('ifNotLoggedIn Middleware', () => {
    
    const res = {
        render: jest.fn(),
        redirect: jest.fn()
    };

    const next = jest.fn();
    


    it("should call next() if no user exists in request session", async () => {
        var req = {session:{}};
        ifNotLoggedIn(req,res,next);
        expect(next).toHaveBeenCalled();

    });

    it("should redirect to home page if user exists in request session", async () => {
        var req = {session:{user: {id:100}}};
        ifNotLoggedIn(req,res,next);
        expect(res.redirect).toHaveBeenCalledWith('/home');
    })

});