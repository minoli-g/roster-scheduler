const date = require('date-and-time');
const { spawn } = require('child_process')


const now = new Date();
const nextMonth = date.addMonths(now,1)
const year =nextMonth.getFullYear();
const month= nextMonth.getMonth()+1;


const getDaysInMonth = function(month,year) {
   return new Date(year, month, 0).getDate();
};

const numOfDays = getDaysInMonth(month,year)


class Roster{
   static async createRoster(minDoc,doclist,leaveDoclist, leaveList,ward_id){
      const childPython = spawn('python',['roster.py', numOfDays,minDoc,doclist,leaveDoclist,leaveList,year,month,ward_id])

      childPython.stdout.on('data', (data) =>{
         console.log(`${data}`);
      });

      childPython.stderr.on('data', (data) =>{
         console.error(`${data}`);
      });

      childPython.on('data', (data) =>{
         console.log(`${data}`);
      });
   }
}


module.exports = Roster;

