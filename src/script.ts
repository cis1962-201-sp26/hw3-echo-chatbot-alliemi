const STORAGE_KEY = 'echo-chatbot-messages';
const MAX_MESSAGE_LENGTH = 2000;

type Message = { role: string; content: string };

let currentChat: { messages: Message[] } = { messages: [] };
let chatVersion = 0;

/**
 * Persists the current chat to localStorage
 */
function persistChat(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentChat.messages));
}

/**
 * Simulates a bot response to a user message
 * @param userMessage
 */
function simulateBotResponse(userMessage: Message['content']): void {
    const responseVersion = chatVersion;
    setTimeout(() => {
        if (responseVersion !== chatVersion) return;
        const botReply = `Echo: ${userMessage}`;
        sendMessage('Echo', botReply);
    }, 500);
}

/**
 * Sends a message in the current chat
 * @param role - The role of the message sender
 * @param message
 */
function sendMessage(role: string, message: string): void {
    const trimmed = message.trim();
    if (trimmed.length === 0) return;

    const content =
        trimmed.length > MAX_MESSAGE_LENGTH
            ? `${trimmed.slice(0, MAX_MESSAGE_LENGTH)}...`
            : trimmed;

    currentChat.messages.push({ role, content });
    renderMessages(currentChat.messages);
    persistChat();
}

/**
 * Renders the messages in the chat
 * @param messages - The messages to render
 */
function renderMessages(messages: Message[]): void {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    container.innerHTML = '';
    for (const msg of messages) {
        const div = document.createElement('div');
        div.className = `message message--${msg.role.toLowerCase()}`;
        div.textContent = msg.content;
        container.appendChild(div);
    }
    container.scrollTop = container.scrollHeight;
}

/**
 * Creates a new chat
 */
function createNewChat(): void {
    chatVersion += 1;
    currentChat = { messages: [] };
    localStorage.removeItem(STORAGE_KEY);
    persistChat();
    renderMessages(currentChat.messages);
}

/**
 * Initializes the app
 */
function initializeApp(): void {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            const messages = JSON.parse(stored) as Message[];
            currentChat = { messages: Array.isArray(messages) ? messages : [] };
        } catch {
            currentChat = { messages: [] };
        }
    } else {
        currentChat = { messages: [] };
        persistChat();
    }
    renderMessages(currentChat.messages);
}

function updateSendButtonState(): void {
    const input = document.getElementById('chat-input') as HTMLInputElement | null;
    const sendBtn = document.getElementById('send-btn') as HTMLButtonElement | null;
    if (input && sendBtn) {
        sendBtn.disabled = input.value.trim().length === 0;
    }
}

const newChatBtn = document.getElementById('new-chat-btn');
if (newChatBtn) {
    newChatBtn.addEventListener('click', createNewChat);
}

const chatForm = document.getElementById('chat-form');
if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('chat-input') as HTMLInputElement | null;
        if (!input) return;

        const text = input.value.trim();
        if (text.length === 0) return;

        sendMessage('User', text);
        input.value = '';
        updateSendButtonState();
        simulateBotResponse(text);
    });
}

const chatInput = document.getElementById('chat-input');
if (chatInput) {
    chatInput.addEventListener('input', updateSendButtonState);
    chatInput.addEventListener('keyup', updateSendButtonState);
}

initializeApp();
updateSendButtonState();
