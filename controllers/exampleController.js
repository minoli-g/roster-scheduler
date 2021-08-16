const example = require('../models/example');

class exampleController{
    static page(req,res){
        //const a = example.access_data();
        //res.send(a);

        example.access_data(function(result){
            res.send(result);
        })
    }
}

module.exports=exampleController;