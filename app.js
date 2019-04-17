const app = (root) => {
  // DOM elements
  const statusEl = root.querySelector('.Status');
  const messagesEl = root.querySelector('.Messages');
  const messagesFormEl = root.querySelector('.MessagesForm');
  const messagesInputEl = root.querySelector('.MessagesFormInput');

  const socket = new WebSocket('ws://localhost:3000');

  // helpers
  const renderNewMessage = (newMessage) => {
    const newMessageEl = document.createElement('div');
    const newMessageEl.innerText = newMessage;
    messagesEl.append(newMessageEl);
  };

  const renderStatus = (newStatus) => {
    statusEl.innerText = newStatus;
  };

  const showNotification = (notification) => {
    const NotificationSystemEl = document.createElement('div');
    NotificationSystemEl.innerText = notification;
    const NotificationSystemEl.className = 'NotificationSystem';
    root.append(NotificationSystemEl);

    setTimeout(() => {
      NotificationSystemEl.classList.add('isOpen');

      setTimeout(() => {
        root.removeChild(NotificationSystemEl);
      }, 1500);
    }, 0);
  };

  // listeners
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

  socket.onmessage = ({ data: newMessage }) => {
    renderNewMessage(newMessage);
  };

  messagesFormEl.addEventListener('submit', (event) => {
    event.preventDefault();
    socket.send(messagesInputEl.value);
    messagesInputEl.value = '';
  });
};

app(document.getElementById('App'));
