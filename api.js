const dotenv = require("dotenv");
dotenv.config();

const { Configuration, OpenAIApi } = require("openai");
const readline = require("readline");

const openAi = new OpenAIApi(
  new Configuration({
    apiKey: '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',
  })
);

const userInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generateResponse = async () => {
  try {
    const response = await openAi.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: 'Suggest meal plan for diabetes' }],
    });

    console.log(response.data.choices[0].message.content);
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.log('Rate limit exceeded. Retrying after 5 seconds...');
      await delay(5000);
      await generateResponse();
    } else {
      console.error('An error occurred:', error);
    }
  }
};

generateResponse();
