import generateText from "../fetch.js";

class Feature {
  constructor(promptTemplate, featureId, resultDisplay) {
    this.promptTemplate = promptTemplate;
    this.featureForm = document.getElementById(featureId);
    this.resultDisplay = document.getElementById(resultDisplay);
  }

  isThereEmptyInputField() {
    const inputFields = this.featureForm.querySelectorAll("input");

    // checking for impity input fields
    for (const field of inputFields) {
      if (field.value.trim() === "") return true;
    }

    // no Empty input field
    return false;
  }

  //   Create Prompt message
  createPrompt() {
    let newPrompt = this.promptTemplate;

    this.featureForm.querySelectorAll("input").forEach((inp, i) => {
      newPrompt = newPrompt.replace(`<INPUT${i + 1}>`, inp.value);
    });

    this.featureForm.querySelectorAll("textarea").forEach((tex, i) => {
      newPrompt = newPrompt.replace(`<TEXTAREA${i + 1}>`, tex.value);
    });

    return newPrompt;
  }

  //   Display result
  removeAndDisplayResult(message) {
    this.resultDisplay.querySelector("p").remove();
    this.resultDisplay.insertAdjacentHTML("beforeEnd", message);
  }

  async generateText(e) {
    try {
      e.preventDefault();

      // check for empiy fields
      if (this.isThereEmptyInputField()) {
        this.removeAndDisplayResult(
          `<p class="alert alert-danger"><i class="bi bi-exclamation-circle"></i> Please Enter The required Data before submit!</p>`
        );
        return;
      }

      //  Display Lodding
      this.removeAndDisplayResult("<p>Loading...</p>");

      // Create Prompt
      const prompt = this.createPrompt();

      // generate text}
      const data = await generateText(prompt);

      // Display the result
      this.removeAndDisplayResult(`<p>${data.data.choices[0].text}</p>`);
    } catch (err) {
      // Display Error Message
      this.removeAndDisplayResult(
        `<p class="alert alert-danger"><i class="bi bi-exclamation-circle"></i> Something went wron. Please Try Agani</p>`
      );
    }
  }
}

export default Feature;
