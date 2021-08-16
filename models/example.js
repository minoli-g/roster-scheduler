const mysql_conn = require ('../config/db');

class example{
    static access_data(result_fn){
        //access data and return a result

        mysql_conn.query('show tables', function (err, rows, fields) {
            if (err) throw err
            let names = rows.map(row => row.Tables_in_roster);
            console.log(rows);
            //console.log(names);
           result_fn(names);
          });

       // return 'yesw';
    }
}

module.exports=example;