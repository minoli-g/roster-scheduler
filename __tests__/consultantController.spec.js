const ConsultantController = require("../controllers/ConsultantController");
const Consultant = require("../models/Consultant");

jest.mock('../models/Consultant');

describe('addDoctor functionality', () => {

    const res = {
        render: jest.fn(),
        redirect: jest.fn()
    };
    //const Consultant = { addDoctor: jest.fn()};

    beforeEach(() => {
        Consultant.mockClear();
    });

    it("Should pass every user ID in req body, along with the wardID, to model's addDoctor()", async() => {
        //expect.assertions(1);
        var req = {body:{'100':'1','102':'1',wardId:"100"}};
        const data = await ConsultantController.addDoctor(req,res);
        expect(Consultant.addDoctor).toHaveBeenCalledWith("100","100");
        expect(Consultant.addDoctor).toHaveBeenCalledWith("100","102");
    });
});