const adminController = require('../controllers/AdminController')
const Admin = require('../models/AdminModel');

jest.mock('../models/AdminModel');

describe('addDoctor functionality', () => {

    const res = {
        render: jest.fn(),
        redirect: jest.fn()
    };

    beforeEach(() => {
        Admin.mockClear();
    });

    it("Should pass every user ID in req body, along with the wardID, to model's addDoctor()", async() => {
        //expect.assertions(1);
        var req = {body:{'100':'1','102':'2','103':'3', wardId:"100"}};
        const data = await adminController.addDoctor(req,res);
        expect(Admin.addDoctorToWard).toHaveBeenCalledWith("100","100");
        expect(Admin.addDoctorToWard).toHaveBeenCalledWith("100","102");
        expect(Admin.addDoctorToWard).toHaveBeenCalledWith("100","103");
    });
});



// describe('removeDoctor functionality', () => {

//     const res = {
//         render: jest.fn(),
//         redirect: jest.fn()
//     };

//     beforeEach(() => {
//         Admin.mockClear();
//     });

//     it("Should pass the user ID in req body to model's removeDoctor()", async() => {
//         //expect.assertions(1);
//         var req = {body:{'100':'1','102':'2',doctorID:"1"}};
//         const data = await adminController.removeDoctor(req,res);
//         //expect(Admin.removeDoctorFromWard).toHaveBeenCalledWith("100");
//         expect(Admin.removeDoctorFromWard).toHaveBeenCalledWith("1");
//     });
// });