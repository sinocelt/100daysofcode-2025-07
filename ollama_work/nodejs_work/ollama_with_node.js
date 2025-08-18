// Get ollama with npm from here:
// https://www.npmjs.com/package/ollama
// Note in order to use this, first you need to have downloaded models from ollama
// for example ollama pull tinyllama
// in the command line

// const ollama = require('ollama').default;

import ollama from 'ollama';

// optional for writing to file
import { writeFile } from 'node:fs/promises'; 

let questions = ["how old is the universe?", 
  "I'm really bad at planning. How can I learn to plan well?", 
  "How can I learn to speak French fluently within 2-3 years?", 
  // Note: there are 3 capitals of South Africa
  'What is the capital city of South Africa?']

// Generate a random index
let randomIndex = Math.floor(Math.random() * questions.length);

// Select the element at the random index
let randomQuestion = questions[randomIndex];

// let model_name = 'tinyllama'
let model_name = 'gemma3:270m'

console.log('model name is', model_name)
console.log('random question is', randomQuestion)

let response = await ollama.chat({
  model: model_name,
  messages: [{ role: 'user', content: randomQuestion }],
})

let llm_output = response.message.content;

console.log(llm_output)

// optionally write llm output to a file
let output_file_name = 'node_with_ollama_example_output.md'

try {
  await writeFile(output_file_name, llm_output);
  console.log('File written successfully.');
} catch (err) {
  console.error('Error writing file:', err);
}