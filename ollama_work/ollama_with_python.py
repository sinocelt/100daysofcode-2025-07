import ollama

# optional for having date in output file
from datetime import datetime

# optional for opening output file at end
import subprocess

# Generate a response from the 'tinyllama' model


# change model as needed
model = 'gemma3:270m'
# model = 'tinyllama'

# prompt = "how can one start a successful online business from scratch, run 100% remotely?"

# optionally read in prompt from a text file. If you do, make sure you edit the file custom_prompt.txt
with open("custom_prompt.txt", "r") as file:
    prompt = file.read()


# print(prompt)

print('model name is', model)


ollama_full_result = ollama.generate(model=model, prompt=prompt)

# ollama_llm_output = ollama_full_result.response

ollama_llm_output = ollama_full_result['response']

#ollama_full_result['response']

# print(result['response'])

# simple way to write output to a file
with open("llm_output.md", "w") as file:
    file.write(ollama_llm_output)


# more complicated way, but more useful output name

# write output to a file
# Get current date and time in the format YYYY_MM_DD_HH_MM_SS
current_datetime = datetime.now().strftime("%Y_%m_%d_%H_%M_%S")

output_file_name = f'{model}_{current_datetime}_output.md'
# # replace /, :, and - with _
replacements = str.maketrans({":": "_", "/": "_", "-": "_"})
output_file_name = output_file_name.translate(replacements)

with open(output_file_name, "w") as file:
    file.write(ollama_llm_output)


# and open file of it

# optionally open the file when it is done. Change pluma to whatever text editor you use
subprocess.Popen(["pluma", output_file_name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


# later work on .chat() with it so it can remember previous prompts and outputs

