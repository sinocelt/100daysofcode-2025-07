from datetime import date, datetime, time

now = datetime.now()

# version 1, ask for date to enter
start_date = input('Enter date you want to start (defaults to now if you dont enter anything): \nGive start date in form of year-month-date like 2025-08-24: ')

# print(start_date)

if not start_date:
    # print('empty')
    start_date = now
else:
    start_date = datetime.strptime(start_date, '%Y-%m-%d')
# 👷 figure out how to deal with errors in date input



# NOTE strptime
# vs strftime

# strptime is for string to date4
# also it is usually datetime.strptime

# strftime is for date to string
# this usually is the_datetime.strftime
print('start date is', start_date)


# 👷 LOGIC TO MAKE SURE END DATE IS AFTER start_date?

# version 1, ask for date to enter
# figure out how to force the date format
# note datetime assumes that it starts at 00:00 if I don't give it an explicit time
end_date_as_string = input('\nEnter end you want to calculate distance from start_date.\nGive end date in form of year-month-date like 2025-08-24: ')
end_date = datetime.strptime(end_date_as_string, '%Y-%m-%d')

# https://docs.python.org/3/library/datetime.html#date-objects for reference

# version 2. Later read in from file or command line parameters


# NOTE datetime includes minutes and seconds

# date just has year, month, day

# convert them to date objects
time_difference_between_dates = end_date.date() - start_date.date()
time_difference_in_days = time_difference_between_dates.days

# OR JUST KEEP the original one so I don't need to convert?
# end_date_as_string = end_date.strftime('%Y-%m-%d')

# IS THERE A BETTER WAY???
start_date_as_string = start_date.strftime('%Y-%m-%d')

print('\n\n')

print(f'difference in days between {start_date_as_string} and {end_date_as_string} is', time_difference_in_days, 'days')

# Note I think it doesn't count the first date. If I want to count the first date and difference, add 1
# If counting day itself
time_difference_in_days_including_first_day = time_difference_in_days + 1
print(f'difference in days between {start_date_as_string} and {end_date_as_string} including first day is', time_difference_in_days_including_first_day, 'days')


# The .days property of timedelta truncates (floors) to the integer number of days → 6.




#####

# maybe integrate ollama or LLM apis to ask qustions
# eventually be able to read in from csv and/or have a database?








