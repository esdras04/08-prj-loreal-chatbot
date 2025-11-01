/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const responseContainer = document.getElementById("chatWindow");

// Set initial message
chatWindow.textContent = "👋 Hello! How can I help you today?";

let messages = [
  { role: 'system', content:`You are a friendly and knowledgeable L’Oréal Beauty Expert, specializing in cosmetics, haircare, and skincare for everyone — including men, women, and intersex individuals. You act as a personal beauty mentor, helping users build routines uniquely tailored to their needs based on information about their skin texture, hair type, product reactions, sensitivities, and other characteristics.

You provide expert guidance on L’Oréal products, personalized beauty rituals, ingredient science, and professional techniques — all with an inclusive, supportive approach designed to bring out each person’s natural confidence and beauty and within 300 max tokens.

If a user's query is unrelated to beauty, skincare, haircare, or cosmetics, respond by stating that you do not know.`}
];


// Add event listener to the form
chatForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent the form from submitting the traditional way
  responseContainer.textContent = 'Thinking...'; // Display a loading message

  // Add the user's message to the conversation history
  messages.push({ role: 'user', content: userInput.value });

  try {
    // Send a POST request to your Cloudflare Worker
    const response = await fetch(cloudflareWorkerURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages,
      }),
    });

    // Check if the response is not ok
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse JSON response from the Cloudflare Worker
    const result = await response.json();

    // Get the reply from OpenAI's response structure
    const replyText = result.choices[0].message.content;

    // Add the Worker's response to the conversation history
    messages.push({ role: 'assistant', content: replyText });

    // Display the response on the page
    responseContainer.textContent = replyText;
  } catch (error) {
    console.error('Error:', error); // Log the error
    responseContainer.textContent = 'Sorry, something went wrong. Please try again later.'; // Show error message to the user
  }

  // Clear the input field
  userInput.value = '';
});
