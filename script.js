const API_KEY = "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";
const API_URL = "https://api.openai.com/v1/chat/completions";

const sendBtn = document.querySelector("#send-btn");
const userText = document.querySelector("textarea");
const chatbox = document.querySelector(".chatbox");

// Function to create a chat message element
function createChatLi(message, className) {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    const chatContent = className === "outgoing" ? `<p>${message}</p>` : `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    userText.value = "";
    return chatLi;
}

// Function to handle user input and update the chatbox
async function inputHandler() {
    const userinput = userText.value.trim();
    if (!userinput) return;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userinput, "outgoing"));

    // Show a "thinking" message
    const thinkingMessage = createChatLi("...thinking 🤔", "incoming");
    chatbox.appendChild(thinkingMessage);

    // Generate response and update the "thinking" message
    try {
        const response = await generateResponse(userinput);

        // Update the thinking message with the actual response
        if (response) {
            thinkingMessage.querySelector('p').textContent = response;
        } else {
            thinkingMessage.querySelector('p').textContent = "Sorry, I couldn't get a response.";
        }
    } catch (err) {
        console.error('Error:', err);
        thinkingMessage.querySelector('p').textContent = "Error: Couldn't get a response.";
    }
}

// Function to call the API and get the response
async function generateResponse(question) {
    const apiKey = 'AIzaSyCbSO9sd3K0Qch_QbilHGArn4fWdZhdmRg'; // Replace with your actual API key
    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + apiKey, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: question
                            }
                        ]
                    }
                ]
            })
        });

        const data = await response.json();
        const receivedResponse = data?.candidates[0]?.content?.parts[0]?.text || "No response received.";
        return receivedResponse;
    } catch (error) {
        console.error('Error:', error);
        return "Error: Couldn't fetch response.";
    }
}

sendBtn.addEventListener("click", inputHandler);
chatbox;

//Ad event listener ti the textarea for enter key
userText.addEventListener("keydown" , function(event){
  if(event.key === "Enter"){
    event.preventDefault(
      inputHandler()
    )
  }
})