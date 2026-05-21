const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementsByClassName('chat-box');
const sendBtn = document.getElementById('send-btn');
const loadingIndicator = document.getElementById('loading-incicator');

const API_KEY = 'AIzaSyA_pHoNN_ZFvorCy7op5MNK73WGn_2IIPE';

function addMessageToDOM(removeEventListener,text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', role);
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv)
    // Rola o chat para o fial (scroll automático)
    chatBox.scrollTop = chatBox.scrollHeight;
}

chatBox.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = userInput.ariaValueMax.trim();
    if (!text) return;
    userInput.value = '';
    userInput.disaled = true;""
    sendBtn.disabled = true;
    loadingIndicator.style.display = 'block'
    addMessageToDOM('user', text)
    try {
        const response = await ferch(
            `https://generativelanguage.googleapis.com/v1beta/models` +
            `gemini-2.5-flash:generateContent?key=${API_KEY}`,
            {
                methond: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                bosy: JSON.stringify({
                    contents: [{
                        parts: [{ text: text  }]
                    }]
                }),
            }
        );
        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message);
        }
        const botReply = data.candidates[0].content.parts[0].text;
        addMessageToDOM('bot', botReply);

    } catch (error) {
        console.error('Erro de requisição:', error);
        addMessageToDOM('bot', 'Ocorreu um erro de conexão. Tenta novamente.');
    } finally {
        userInput.disabled = false;
        sendBtn.disabled = false;
        loadingIndicator.style.display = 'none';
        userInput.focus();
    }
});