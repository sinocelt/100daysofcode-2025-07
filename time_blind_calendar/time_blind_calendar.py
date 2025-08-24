import datetime
from datetime import date, datetime, time

# datetime.datetime.now()
#datetime.datetime(2025, 8, 23, 21, 57, 44, 657774)

now = datetime.datetime.now()

# version 1, ask for date to enter
start_date = input('Enter date you want to start (defaults to now if you dont enter anything)')

# version 1, ask for date to enter
end_date = input('Enter date you want to calculate')


# version 2. Later read in from file or command line parameters



#####

# maybe integrate ollama or LLM apis to ask qustions
# eventually be able to read in from csv and/or have a database?