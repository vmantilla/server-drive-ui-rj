// src/api/actionCable.js

import ActionCable from 'actioncable';

//const apiUrl = process.env.REACT_APP_API_URL_LOCAL;
const apiUrl = process.env.REACT_APP_API_URL_LOCAL;

const API_BASE_URL = apiUrl;
const WEBSOCKET_BASE_URL = API_BASE_URL.replace(/^http/, 'ws');

// Función para obtener el token de autenticación.
const getToken = () => localStorage.getItem('token');

// Crea una instancia del consumidor de Action Cable usando la URL de WebSocket,
// incluyendo el token como parte de la URL.
const createCableWithToken = () => {
  const token = getToken();
  return ActionCable.createConsumer(`${WEBSOCKET_BASE_URL}/cable?token=${token}`);
}

export const subscribeToPreviewChannel = (workspaceId, onReceivedMessage) => {
  const cable = createCableWithToken();
  const channel = cable.subscriptions.create({
    channel: 'WorkspaceChannel',
    workspace_id: workspaceId 
  }, {
    connected() {
      console.log("Conectado al canal de preview.");
    },

    disconnected() {
      console.log("Desconectado del canal de preview.");
    },

    received(data) {
      try {
        if(data) {
          onReceivedMessage(data);
        }
      } catch (error) {
        console.error("Error procesando la respuesta recibida:", error);
      }
    }
  });

  return () => channel.unsubscribe();
};

export const subscribeToChatChannel = (workspaceId, onReceivedMessage) => {
  const cable = createCableWithToken();
  const channel = cable.subscriptions.create({
    channel: 'ChatChannel',
    workspace_id: workspaceId
  }, {
    connected() {
      console.log("Connected to chat room:", workspaceId);
    },
    disconnected() {
      console.log("Disconnected from chat room:", workspaceId);
    },
    received(data) {
      console.log("Received data:", data);
      onReceivedMessage(data);
    }
  });

  return () => channel.unsubscribe();
};
