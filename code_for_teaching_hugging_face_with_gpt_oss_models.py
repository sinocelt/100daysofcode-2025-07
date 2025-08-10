
# By Justin Barry
## https://watsontechworld.com

# https://huggingface.co/openai/gpt-oss-20b
# https://huggingface.co/openai/gpt-oss-120b

# This document will give examples of using the Hugging Face API with the gpt-oss new models from OpenAI.<br/>
# You can modify to use other models on Hugging Face as well. Make sure you get an API key. You can get a free API key to use for a few tries.

import os
from openai import OpenAI
from datetime import datetime

# Step 1: make a Hugging Face account at huggingface.co
# Step 2: Get an API key from Hugging Face

# Get a key from huggingface at:<br/>
# https://huggingface.co/settings/tokens


# Copy the API key

# option 1: set the key here in Python
# huggingface_key = 'hf_YOUR_HUGGINGFACE_API_KEY'

# option 2: set the key as an environment variable in a terminal and access it here
# If you choose this, put something like this in a terminal (modify with your actual key):
# export HF_TOKEN="hf_YOUR_HUGGINGFACE_API_KEY"
# to get from computer as an environment variable

huggingface_key = os.environ["HF_TOKEN"]

# Get the code for Hugging Face for a given model
# Click on:
# Deploy -> Inference Providers
# Then choose the model name and provider you want.

# Choose the model name on Hugging Face (it needs to match exactly)

# Below uses novita as the provider. Change the model as you like.

model="openai/gpt-oss-20b:novita"
# model="openai/gpt-oss-120b:novita"


#prompt = """Teach me how to start a successful email list for free from scratch. I will post videos on YouTube and other platforms
#I will also have a website. I will eventually have a landing page for the email list. Help give me the best tips for successfully starting
#and email list from scratch and make it realistic for getting over 100 subscribers over a year and give a plan.
#"""

# optionally read in prompt from a text file. If you do, make sure you edit the file custom_prompt.txt
with open("custom_prompt.txt", "r") as file:
    prompt = file.read()


# print(prompt)

client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key=huggingface_key,
)

completion = client.chat.completions.create(
    model=model,
    messages=[
        {
            "role": "user",
            # "content": "What is the capital of France? And what is the capital of the largest country by population in Africa"
            "content": prompt
        }
    ],
)

# actually get the output
llm_output = completion.choices[0].message.content

print(llm_output)


# simple way to write output to a file
with open("llm_output.md", "w") as file:
    file.write(llm_output)

# write output to a file
# I add the model and current datetime. Modify this as you like


# more complicated way, but more useful output name

# write output to a file
# Get current date and time in the format YYYY_MM_DD_HH_MM_SS
# current_datetime = datetime.now().strftime("%Y_%m_%d_%H_%M_%S")

# output_file_name = f'{model}_{current_datetime}_output.md'
# # replace /, :, and - with _
# replacements = str.maketrans({":": "_", "/": "_", "-": "_"})
# output_file_name = output_file_name.translate(replacements)

# with open(output_file_name, "w") as file:
#     file.write(llm_output)
