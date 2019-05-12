const app = (root) => {
  // DOM elements
  const chatEl = root.querySelector('.Chat');
  const statusEl = root.querySelector('.Status');
  const messagesEl = root.querySelector('.Messages');
  const signInFormEl = root.querySelector('.SignIn');
  const signInInputEl = root.querySelector('.SignInInput');
  const messagesFormEl = root.querySelector('.MessagesForm');
  const messagesInputEl = root.querySelector('.MessagesFormInput');
  const messagesContainerEl = root.querySelector('.MessagesContainer');

  const token = +new Date();

  const state = {
    username: 'Anonimus',
  };

  // helpers
  const renderNewMessage = (messageData) => {
    const { message, username, token: messageUserToken } = messageData;
    const isMyMessage = messageUserToken === token;

    const newMessageEl = document.createElement('div');
    const newMessageUsernameEl = document.createElement('span');
    newMessageUsernameEl.innerText = isMyMessage ? 'Me: ' : `${username}: `;

    newMessageEl.className = isMyMessage ? 'MessagesMessage MyMessage' : 'MessagesMessage';
    newMessageEl.innerText = message;

    newMessageEl.prepend(newMessageUsernameEl);

    messagesEl.append(newMessageEl);
    messagesContainerEl.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  const renderStatus = (newStatus) => {
    statusEl.innerText = `${newStatus} : ${state.username}`;
  };

  const showNotification = (notification) => {
    const NotificationSystemEl = document.createElement('div');
    NotificationSystemEl.innerText = notification;
    NotificationSystemEl.className = 'NotificationSystem';
    root.append(NotificationSystemEl);

    setTimeout(() => {
      NotificationSystemEl.classList.add('animated');
      setTimeout(() => {
        root.removeChild(NotificationSystemEl);
      }, 1500);
    }, 0);
  };

  const runChat = () => {
    const host = location.origin.replace(/^http/, 'ws');
    const socket = new WebSocket(host);

    signInFormEl.classList.remove('Visible');
    chatEl.classList.add('Visible');

    socket.onopen = () => {
      renderStatus('ONLINE');
      showNotification('You are connected successfully');
    };

    socket.onclose = (event) => {
      renderStatus('OFFLINE');

      if (!event.wasClean) {
        showNotification('Network error, try to reload app');
        return;
      }

      showNotification('You are disconnected successfully');
    };

    socket.onerror = (error) => {
      showNotification(`Something went wrong: ${error.message}`);
    };

    socket.onmessage = ({ data }) => {
      renderNewMessage(JSON.parse(data));
    };

    messagesFormEl.addEventListener('submit', (event) => {
      event.preventDefault();
      const { value } = messagesInputEl;

      if (!value) return;

      const data = {
        token,
        username: state.username,
        message: messagesInputEl.value,
      };

      socket.send(JSON.stringify(data));
      messagesInputEl.value = '';
      messagesInputEl.focus();
    });
  };

  // listeners
  signInFormEl.addEventListener('submit', (event) => {
    event.preventDefault();
    const { value } = signInInputEl;

    if (!value) return;

    state.username = value;
    runChat();
  });
};

app(document.getElementById('App'));
