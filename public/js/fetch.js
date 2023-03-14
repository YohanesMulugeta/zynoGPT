// const API_KEY = "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";
// const API_ENDPOINT = "https://api.openai.com/v1/completions";
//this function is responsible for API request with openAI backend-with endpoint of completions
async function generateText(prompt) {
  try {
    const { data } = await axios({
      method: "post",
      url: "/api/v1/ai/generateText",
      data: { prompt: prompt },
    });
    // const response = await fetch(API_ENDPOINT, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${API_KEY}`,
    //   },
    //   body: JSON.stringify({
    //     prompt: prompt,
    //     max_tokens: 200,
    //     model: "text-davinci-003",
    //     // n: 1,
    //     //stop: '\n',
    //     temperature: 0,
    //   }),
    // });
    // const dataone = await response.json();
    // const { choices } = dataone;
    console.log(data);
    return data;
  } catch (err) {
    console.log(err.response.data);
  }
}

export default generateText;
