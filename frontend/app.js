const BACKEND_URL = window.BACKEND_URL || location.origin;
const chatEl = document.getElementById('chat');
const form = document.getElementById('form');
const input = document.getElementById('input');
const loader = document.getElementById('loader');
const sendBtn = document.getElementById('sendBtn');

function appendBubble(text, cls = 'bot'){
  const div = document.createElement('div');
  div.className = 'bubble ' + cls;
  div.textContent = text;
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
  return div;
}

function setLoading(on){
  loader.classList.toggle('hidden', !on);
  sendBtn.disabled = on;
}

async function sendMessage(){
  const message = input.value.trim();
  if(!message) return false;

  appendBubble(message, 'user');
  const botBubble = appendBubble('', 'bot');
  input.value = '';

  setLoading(true);

  try{
    const controller = new AbortController();
    const res = await fetch(BACKEND_URL + '/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
      signal: controller.signal
    });

    if(!res.ok){
      const err = await res.json();
      botBubble.textContent = 'Error: ' + (err.error || res.statusText);
      setLoading(false);
      return false;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let partial = '';

    while(!done){
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if(value){
        const chunk = decoder.decode(value, { stream: true });
        partial += chunk;
        const lines = partial.split('\n');
        partial = lines.pop();
        for(const line of lines){
          if(!line.trim()) continue;
          try{
            const obj = JSON.parse(line);
            if(obj.token) {
              botBubble.textContent += obj.token;
              chatEl.scrollTop = chatEl.scrollHeight;
            } else if(obj.done) {
              // finished
            } else if(obj.error) {
              botBubble.textContent = 'Error: ' + obj.error;
            }
          } catch(e){}
        }
      }
    }

    if(partial){
      try{
        const obj = JSON.parse(partial);
        if(obj.token) botBubble.textContent += obj.token;
      }catch(e){}
    }

  }catch(e){
    appendBubble('Request failed: ' + e.message, 'bot');
  }finally{
    setLoading(false);
  }

  return false;
}

input.addEventListener('keydown', (e) => {
  if(e.key === 'Enter' && !e.shiftKey){
    e.preventDefault();
    sendMessage();
  }
});

appendBubble('Hi — I am your streaming ChatGPT demo. Ask me anything!', 'bot');
