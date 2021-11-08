const ConsultantController = require("../controllers/ConsultantController");
const Consultant = require("../models/Consultant");

jest.mock('../models/Consultant');

const { body, validationResult } = require('express-validator');
jest.mock('express-validator');

//--- Setting constant response, user session mocks & beforeEach for every test ---

const res = {
    render: jest.fn(),
    redirect: jest.fn()
};

const beforeEach = () => {
    Consultant.mockClear();
};

const user_session = {
    user: { id: 100 }
};

describe('addDoctor functionality', () => {

    beforeEach();

    it("Should pass every user ID in req body, along with the wardID, to model's addDoctor()", async() => {
        //expect.assertions(1);
        var req = {body:{'100':'1','102':'1',wardId:"100"}};
        const data = await ConsultantController.addDoctor(req,res);
        expect(Consultant.addDoctor).toHaveBeenCalledWith("100","100");
        expect(Consultant.addDoctor).toHaveBeenCalledWith("100","102");
    });
});

describe('createWard functionality', () => {

    beforeEach();

    const emptyResult = { isEmpty: jest.fn().mockReturnValue(true)};
    const resultWithError = { isEmpty: jest.fn().mockReturnValue(false), errors:[{msg:"Error"}]};    
    var req = {body:{wardname:'Test', startmonth:'2021-01'}, session: user_session};

    it("If no errors, should call createWard function of model", async() => {

        Consultant.getWardID.mockReturnValueOnce(false);
        validationResult.mockReturnValueOnce(emptyResult);

        const data = await ConsultantController.createWard(req,res);
        expect(Consultant.createWard).toHaveBeenCalledWith('Test',100,0,2021);

    });

    it("If validation error, should render create page with error message", async() => {

        Consultant.getWardID.mockReturnValueOnce(false);
        validationResult.mockReturnValueOnce(resultWithError);

        const data = await ConsultantController.createWard(req,res);
        expect(res.render).toHaveBeenCalledWith('consultant/create',{message: "Error"});
    });

    it("If ward name not unique, should render create page with that information", async() => {

        Consultant.getWardID.mockReturnValueOnce(true);
        validationResult.mockReturnValueOnce(emptyResult);

        const data = await ConsultantController.createWard(req,res);
        expect(res.render).toHaveBeenCalledWith('consultant/create',{message: "That name's taken"});
    });


})