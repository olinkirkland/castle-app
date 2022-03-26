import * as readline from 'readline';
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

askFood();

function askFood() {
  rl.question('What is your favorite food? ', (answer) => {
    console.log(`Oh, so your favorite food is ${answer}`);
    askColor();
  });
}

function askColor() {
  rl.question('What is your favorite color? ', (answer) => {
    console.log(`Oh, so your favorite color is ${answer}`);
    rl.close();
  });
}
