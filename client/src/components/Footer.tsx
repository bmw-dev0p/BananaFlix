import { useState } from "react";
import "./Footer.css"; // Import the CSS for the chat popup

const Footer = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "https://bananaflix-fdyk.onrender.com";

  const [message, setMessage] = useState(""); // State to hold the current message input by the user
  const [chatHistory, setChatHistory] = useState<string[]>([]); // State to store the chat history
  const [loading, setLoading] = useState(false); // State to indicate if the bot is currently responding
  const [isOpen, setIsOpen] = useState(false); // State to toggle the visibility of the chat popup

  // Function to send message to bot and receive response
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission from refreshing the page
    if (message.trim()) { // Check if the message is not just whitespace
      setChatHistory((prev) => [...prev, `User: ${message}`]); // Add the user's message to chat history
      setLoading(true); // Set loading state to true while waiting for the bot's response

      try {
        // Send the user's message to the server
        const response = await fetch(`${apiUrl}/api/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }), // Send the message as JSON
        });

        if (!response.ok) { // Check if the response is not OK
          throw new Error(`HTTP error! status: ${response.status}`); // Throw an error if the response is not OK
        }

        const data = await response.json(); // Parse the JSON response
        console.log(`bot response received: ${data}`); // Check the response data
        const botMessage = data.response || "Bot: No response received."; // Assign the bot's message or a default message

        setChatHistory((prev) => [...prev, `Bot: ${botMessage}`]); // Add the bot's message to chat history
      } catch (error) {
        console.error("Error fetching data from API:", error); // Log any errors
        setChatHistory((prev) => [...prev, "Bot: Error connecting to server."]); // Add an error message to chat history
      } finally {
        setLoading(false); // Reset loading state
        setMessage(""); // Clear the message input field
      }
    }
  };

  return (
    <div className="chat-footer">
      {/* Button to open the chat popup */}
      <button className="open-btn" onClick={() => {
        console.log("Chat button clicked!"); // check for click
        setIsOpen(true)
      }}>
        Chat with BananaBot! 🤖
      </button>

      {/* Chat popup */}
      {isOpen && (
        <div className="popup-container" id="chatbot">
          <form className="form-container" onSubmit={handleSendMessage}>
            <h1 className="chat-h1">🍌BananaBot🍌 </h1>

            <div className="chat-history">
              {/* maps over the chatHistory array to render each chat message */}
              {chatHistory.map((chat, index) => {
                // Separate the speaker (User/Bot) and the message
                const [speaker, ...messageParts] = chat.split(": ");
                const message = messageParts.join(": ");
                return (
                  <div key={index}>
                    {/* enabled bold text (User/Bot) and regular text (message) for readability */}
                    <strong>{speaker}:</strong> {message}
                  </div>
                );
              })}
              {loading && <div><strong>Bot:</strong> Typing...</div>}
            </div>


            <label htmlFor="msg">
              <b>Message</b>
            </label>
            <textarea
              className="user-input"
              placeholder="Type your a-peeling message here..." // Placeholder text for the textarea
              value={message} // Bind the textarea value to the message state
              onChange={(e) => setMessage(e.target.value)} // Update message state on input change
              name="msg"
              required // Make the textarea required
            />

            <button type="submit" className="submit-btn">
              Send
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setIsOpen(false)} // Close the chat popup
            >
              Close
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Footer;
