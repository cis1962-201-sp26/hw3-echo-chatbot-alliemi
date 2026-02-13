var STORAGE_KEY = 'echo-chatbot-messages';
var MAX_MESSAGE_LENGTH = 2000;
var currentChat = { messages: [] };
var chatVersion = 0;
/**
 * Persists the current chat to localStorage
 */
function persistChat() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentChat.messages));
}
/**
 * Simulates a bot response to a user message
 * @param userMessage - The user's message
 */
function simulateBotResponse(userMessage) {
    var responseVersion = chatVersion;
    setTimeout(function () {
        // Ignore stale delayed replies from chats that were reset.
        if (responseVersion !== chatVersion)
            return;
        var botReply = "Echo: ".concat(userMessage);
        sendMessage('Echo', botReply);
    }, 500);
}
/**
 * Sends a message in the current chat
 * @param role - The role of the message sender ('User' or 'Echo')
 * @param message - The message content
 */
function sendMessage(role, message) {
    var trimmed = message.trim();
    if (trimmed.length === 0)
        return;
    var content = trimmed.length > MAX_MESSAGE_LENGTH
        ? "".concat(trimmed.slice(0, MAX_MESSAGE_LENGTH), "...")
        : trimmed;
    currentChat.messages.push({ role: role, content: content });
    renderMessages(currentChat.messages);
    persistChat();
}
/**
 * Renders the messages in the chat
 * @param messages - The messages to render
 */
function renderMessages(messages) {
    var container = document.getElementById('chat-messages');
    if (!container)
        return;
    container.innerHTML = '';
    for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
        var msg = messages_1[_i];
        var div = document.createElement('div');
        div.className = "message message--".concat(msg.role.toLowerCase());
        div.textContent = msg.content;
        container.appendChild(div);
    }
    container.scrollTop = container.scrollHeight;
}
/**
 * Creates a new chat
 * - If no chat exists, create a new chat object and store it in local storage
 * - If a chat exists, delete the old chat object and create a new one
 * - Always render the chat after creating a new chat
 */
function createNewChat() {
    chatVersion += 1;
    currentChat = { messages: [] };
    localStorage.removeItem(STORAGE_KEY);
    persistChat();
    renderMessages(currentChat.messages);
}
/**
 * Initializes the app
 * - Fetch the chat object from local storage
 * - Renders the chat messages from the saved chat
 * - If no chat exists, create a new chat
 */
function initializeApp() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            var messages = JSON.parse(stored);
            currentChat = { messages: Array.isArray(messages) ? messages : [] };
        }
        catch (_a) {
            currentChat = { messages: [] };
        }
    }
    else {
        currentChat = { messages: [] };
        persistChat();
    }
    renderMessages(currentChat.messages);
}
function updateSendButtonState() {
    var input = document.getElementById('chat-input');
    var sendBtn = document.getElementById('send-btn');
    if (input && sendBtn) {
        sendBtn.disabled = input.value.trim().length === 0;
    }
}
var newChatBtn = document.getElementById('new-chat-btn');
if (newChatBtn) {
    newChatBtn.addEventListener('click', createNewChat);
}
var chatForm = document.getElementById('chat-form');
if (chatForm) {
    chatForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = document.getElementById('chat-input');
        if (!input)
            return;
        var text = input.value.trim();
        if (text.length === 0)
            return;
        sendMessage('User', text);
        input.value = '';
        updateSendButtonState();
        simulateBotResponse(text);
    });
}
var chatInput = document.getElementById('chat-input');
if (chatInput) {
    chatInput.addEventListener('input', updateSendButtonState);
    chatInput.addEventListener('keyup', updateSendButtonState);
}
initializeApp();
updateSendButtonState();
export {};
