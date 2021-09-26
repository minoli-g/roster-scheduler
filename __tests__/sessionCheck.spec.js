const ifLoggedIn = require('../middleware/SessionCheck').ifLoggedIn;
const ifNotLoggedIn = require('../middleware/SessionCheck').ifNotLoggedIn;
const isConsultant = require('../middleware/SessionCheck').isConsultant;
const isDoctor = require('../middleware/SessionCheck').isDoctor;
const isAdmin = require('../middleware/SessionCheck').isAdmin;
    

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

describe('isAdmin Middleware', () => {
    
    const res = {
        render: jest.fn(),
        redirect: jest.fn()
    };

    const next = jest.fn();
    


    it("should call next() if instance of admin user in request session", async () => {
        var req = {session:{user:{type:"admin"}}};
        isAdmin(req,res,next);
        expect(next).toHaveBeenCalled();

    });

    it("should redirect to home page if admin user not present", async () => {
        var req = {session:{user: {type:"notAdmin"}}};
        isAdmin(req,res,next);
        expect(res.redirect).toHaveBeenCalledWith('/home');
    })

});

describe('isDoctor Middleware', () => {
    
    const res = {
        render: jest.fn(),
        redirect: jest.fn()
    };

    const next = jest.fn();
    


    it("should call next() if instance of doctor user in request session", async () => {
        var req = {session:{user:{type:"doctor"}}};
        isDoctor(req,res,next);
        expect(next).toHaveBeenCalled();

    });

    it("should redirect to home page if doctor user not present", async () => {
        var req = {session:{user: {type:"notDoctor"}}};
        isDoctor(req,res,next);
        expect(res.redirect).toHaveBeenCalledWith('/home');
    })

});

describe('isConsultant Middleware', () => {
    
    const res = {
        render: jest.fn(),
        redirect: jest.fn()
    };

    const next = jest.fn();
    


    it("should call next() if instance of consultant user in request session", async () => {
        var req = {session:{user:{type:"consultant"}}};
        isConsultant(req,res,next);
        expect(next).toHaveBeenCalled();

    });

    it("should redirect to home page if consultant user not present", async () => {
        var req = {session:{user: {type:"notAdmin"}}};
        isConsultant(req,res,next);
        expect(res.redirect).toHaveBeenCalledWith('/home');
    })

});