from ortools.sat.python import cp_model
import sys
import ast
import datetime
from calendar import Calendar, monthrange
import json
import mysql.connector


def main(num_days, num_minDoctor, all_doctors,leave_doctors, leave_dates_list, year, month):
    # Data.

    num_shifts = 3
    num_days = num_days
    num_minDoctor = num_minDoctor

    all_doctors = all_doctors
    leave_doctors = leave_doctors
    num_doctors = len(all_doctors)
    all_shifts = range(num_shifts)
    all_days = range(num_days)

    leave_dates =leave_dates_list
    doctor_leaves = {i: j for i, j in zip(leave_doctors, leave_dates)}

    def getWeekends(year, month):
        weekends = []
        c = Calendar()
        now = datetime.datetime.now()

        for d in [x for x in c.itermonthdates(year, month) if x.month == month]:
            if (d.strftime("%A") == "Saturday" or d.strftime("%A") == "Sunday"):
                weekends.append(d.day)

        return weekends

    year = year
    month = month
    weekend_list = getWeekends(year, month)



    # Creates the model.
    model = cp_model.CpModel()

    # Creates shift variables.
    # shifts[(n, d, s)]: doctor 'n' works shift 's' on day 'd'.
    shifts = {}
    for n in all_doctors:
        for d in all_days:
            for s in all_shifts:
                shifts[(n, d, s)] = model.NewBoolVar('shift_n%id%is%i' % (n, d, s))

    # Each shift is assigned number of minimum doctors required for the ward.
    for d in all_days:
        for s in all_shifts:
            model.Add(sum(shifts[(n, d, s)] for n in all_doctors) == num_minDoctor)

    # Each doctor works at most one shift per day.
    for n in all_doctors:
        for d in all_days:
            model.Add(sum(shifts[(n, d, s)] for s in all_shifts) <= 1)

    # Free day after doing a Night shift and No consecutive Night shifts
    for n in all_doctors:
        for d in all_days:
            if d == 0:
                continue
            else:
                model.Add((shifts[(n, d - 1, 2)] + shifts[(n, d, 0)] + shifts[(n, d, 1)] + shifts[(n, d, 2)]) < 2)

    # Selected Dates are off
    for n, leaves in doctor_leaves.items():
        # for d in leaves:
        model.Add(sum(shifts[(n, leaves-1, s)] for s in all_shifts) == 0)

    # Two Weekends are off
    for n in all_doctors:
        model.Add((sum(shifts[(n, d-1, 0)] for d in weekend_list)+ sum(shifts[(n, d-1, 1)] for d in weekend_list)+sum(shifts[(n, d-1, 2)] for d in weekend_list)) < len(weekend_list)-2)

    # To distribute the shifts evenly among doctors
    min_shifts_per_doctor = (num_shifts * num_days * num_minDoctor) // num_doctors
    if num_shifts * num_days % num_doctors == 0:
        max_shifts_per_doctor = min_shifts_per_doctor
    else:
        max_shifts_per_doctor = min_shifts_per_doctor + 1

    for n in all_doctors:
        model.Add((sum(shifts[(n, d, 0)] for d in all_days)+ sum(shifts[(n, d, 1)] for d in all_days)+sum(shifts[(n, d, 2)] for d in all_days)) >= min_shifts_per_doctor)
        model.Add((sum(shifts[(n, d, 0)] for d in all_days)+ sum(shifts[(n, d, 1)] for d in all_days)+sum(shifts[(n, d, 2)] for d in all_days)) <= max_shifts_per_doctor)

    # To distribute the night shifts evenly among doctors
    min_night_shifts_per_doctor = (num_days * num_minDoctor) // num_doctors
    if num_shifts * num_days % num_doctors == 0:
        max_night_shifts_per_doctor = min_night_shifts_per_doctor
    else:
        max_night_shifts_per_doctor = min_night_shifts_per_doctor + 1

    for n in all_doctors:
        model.Add((sum(shifts[(n, d, 2)] for d in all_days) <= max_night_shifts_per_doctor))
        model.Add((sum(shifts[(n, d, 2)] for d in all_days) >= min_night_shifts_per_doctor))

    # Creates the solver and solve.
    solver = cp_model.CpSolver()
    solver.parameters.linearization_level = 0
    status = solver.Solve(model)

    if status == cp_model.INFEASIBLE:
        return "INFEASIBLE"
        # print("INFEASIBLE")
        quit()
    elif status == cp_model.MODEL_INVALID:
        # print("MODEL_INVALID")
        quit()
    else:

        # Enumerate all solutions.
        solver.parameters.enumerate_all_solutions = True

        class DoctorsPartialSolutionPrinter(cp_model.CpSolverSolutionCallback):
            """Print intermediate solutions."""

            def __init__(self, shifts, num_doctors, num_days, num_shifts, limit, docs):
                cp_model.CpSolverSolutionCallback.__init__(self)
                self._shifts = shifts
                self._num_doctors = num_doctors
                self._num_days = num_days
                self._num_shifts = num_shifts
                self._solution_count = 0
                self._solution_limit = limit
                self._docs =docs

            def on_solution_callback(self):
                self._solution_count += 1
                final_shifts =[]
                final_night_shifts = []

                temp1 = []
                temp5 = []

                for i in range(self._num_doctors):
                    final_shifts.append([])
                    final_night_shifts.append([])
                for d in range(self._num_days):
                    temp1.append('Day %i' % (d+1))
                    temp2 = ["Morning", "Evening", "Night"]
                    temp3= [[],[],[]]

                    for n in range(self._num_doctors):
                        is_working = False
                        for s in range(self._num_shifts):
                            if self.Value(self._shifts[(self._docs[n], d, s)]):
                                is_working = True
                                # print('  Doctor %i works shift %i' % (self._docs[n], s))
                                temp3[s].append(self._docs[n])

                                final_shifts[n].append(d)
                                if s==2:
                                    final_night_shifts[n].append(d)

                    temp4 = {i: j for i, j in zip(temp2, temp3)}
                    temp5.append(temp4)

                final_roster = {i: j for i, j in zip(temp1, temp5)}

                roster_json = json.dumps(final_roster)

                if self._solution_count >= self._solution_limit:
                    # print('Stop search after %i solutions' % self._solution_limit)
                    ff = []
                    fx = []
                    for i in final_shifts:
                        i.sort()
                        ff.append(len(i))
                    for j in final_night_shifts:
                        fx.append(len(j))

                    self.StopSearch()

                return roster_json

            def solution_count(self):
                return self._solution_count

        # Display the first solution.
        solution_limit = 1
        solution_printer = DoctorsPartialSolutionPrinter(shifts, num_doctors, num_days, num_shifts, solution_limit,all_doctors)

        solver.Solve(model, solution_printer)
        return solution_printer.on_solution_callback()


num_days = int(sys.argv[1])
num_minDoctor = int(sys.argv[2])
all_doctors = list(ast.literal_eval(sys.argv[3]))
leave_doctors = list(ast.literal_eval(sys.argv[4]))
leave_dates_list = list(ast.literal_eval(sys.argv[5]))
year = int(sys.argv[6])
month = int(sys.argv[7])
ward_id = int(sys.argv[8])

print(main(num_days,num_minDoctor,all_doctors,leave_doctors,leave_dates_list,year,month))


roster = main(num_days,num_minDoctor,all_doctors,leave_doctors,leave_dates_list,year,month)

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="chamod1998@CSE",
  database="roster"
)

mycursor = mydb.cursor()

sql = "INSERT INTO roster (ward_id, year, month, roster) VALUES (%s, %s, %s, %s)"
val = (ward_id,year,month,roster)

mycursor.execute(sql,val)

mydb.commit()