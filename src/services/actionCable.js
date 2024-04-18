// src/api/actionCable.js

import ActionCable from 'actioncable';


//const API_BASE_URL = process.env.REACT_APP_API_URL_LOCAL;
const API_BASE_URL = process.env.REACT_APP_API_URL_LOCAL;
const WEBSOCKET_BASE_URL = API_BASE_URL.replace(/^http/, 'ws'); // Convertir HTTP a WS para WebSocket

// Función para obtener el token de autenticación.
const getToken = () => localStorage.getItem('token');

// Crea una instancia del consumidor de Action Cable usando la URL de WebSocket,
// incluyendo el token como parte de la URL.
const createCableWithToken = () => {
  const token = getToken();
  return ActionCable.createConsumer(`${WEBSOCKET_BASE_URL}/cable?token=${token}`);
}

// Función genérica para subscribir a un canal
export const subscribeToChannel = (channelParams, onReceivedMessage, onConnected, onDisconnected) => {
  const cable = createCableWithToken();
  const channel = cable.subscriptions.create(channelParams, {
    connected() {
      console.log(`Connected to ${channelParams.channel} channel`);
      if (onConnected) {
        onConnected();
      }
    },
    disconnected() {
      console.log(`Disconnected from ${channelParams.channel} channel`);
      if (onDisconnected) {
        onDisconnected();
      }
    },
    received(data) {
      try {
        if (data) {
          onReceivedMessage(data);
        }
      } catch (error) {
        console.error("Error processing the received response:", error);
      }
    }
  });

  return () => channel.unsubscribe();
};

// Ejemplos de uso específico basado en la función genérica
export const subscribeToPreviewChannel = (workspaceId, onReceivedMessage, onConnected, onDisconnected) => {
  const channelParams = {
    channel: 'WorkspaceChannel',
    workspace_id: workspaceId
  };
  return subscribeToChannel(channelParams, onReceivedMessage, onConnected, onDisconnected);
};

export const subscribeToChatChannel = (workspaceId, onReceivedMessage, onConnected, onDisconnected) => {
  const channelParams = {
    channel: 'ChatChannel',
    workspace_id: workspaceId
  };
  return subscribeToChannel(channelParams, onReceivedMessage, onConnected, onDisconnected);
};
