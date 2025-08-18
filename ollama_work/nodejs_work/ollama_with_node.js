// Get ollama with npm from here:
// https://www.npmjs.com/package/ollama
// Note in order to use this, first you need to have downloaded models from ollama
// for example ollama pull tinyllama
// in the command line

// const ollama = require('ollama').default;

import ollama from 'ollama';

let questions = ["how old is the universe?", 
  "I'm really bad at planning. How can I learn to plan well?", 
  "How can I learn to speak French fluently within 2-3 years?", 
  // Note: there are 3 capitals of South Africa
  'What is the capital city of South Africa?']

// Generate a random index
let randomIndex = Math.floor(Math.random() * questions.length);

// Select the element at the random index
let randomQuestion = questions[randomIndex];
// let indexChosen = 3;
// let randomQuestion = questions[1];
// let randomQuestion = questions[indexChosen];

// let model_name = 'tinyllama'
let model_name = 'gemma3:270m'

console.log('model name is', model_name)
console.log('random question is', randomQuestion)

let response = await ollama.chat({
  model: model_name,
  messages: [{ role: 'user', content: randomQuestion }],
})

console.log(response.message.content)
