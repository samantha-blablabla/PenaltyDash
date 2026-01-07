import { UserProfile } from '../types';

const CHANNEL = 'penalty_dash_presence_v1';

export const presenceService = {
  subscribe: (user: UserProfile, onUsersChange: (users: UserProfile[]) => void) => {
    const channel = new BroadcastChannel(CHANNEL);
    const peers = new Map<string, UserProfile>();

    // Helper to broadcast messages
    const broadcast = (type: 'JOIN' | 'HEARTBEAT' | 'LEAVE', payloadUser: UserProfile) => {
      channel.postMessage({ type, user: payloadUser });
    };

    // Add self to list immediately
    peers.set(user.name, user);
    onUsersChange(Array.from(peers.values()));

    // Broadcast entry
    broadcast('JOIN', user);

    // Heartbeat loop to keep status alive and update avatar changes
    const interval = setInterval(() => {
        // We always broadcast the *current* user object passed to subscribe/update
        // However, since `user` in this scope is a closure, we rely on the parent component 
        // to re-subscribe if the user object changes deeply, or we update the reference.
        broadcast('HEARTBEAT', user); 
    }, 3000);

    channel.onmessage = (event) => {
      const { type, user: remoteUser } = event.data;
      if (!remoteUser || !remoteUser.name) return;

      if (type === 'JOIN' || type === 'HEARTBEAT') {
        // Update peer info (avatar might have changed, so we overwrite)
        peers.set(remoteUser.name, remoteUser);
        onUsersChange(Array.from(peers.values()));
        
        // If new joiner, reply with heartbeat so they know about us immediately
        if (type === 'JOIN') {
           broadcast('HEARTBEAT', user);
        }
      } else if (type === 'LEAVE') {
        peers.delete(remoteUser.name);
        onUsersChange(Array.from(peers.values()));
      }
    };

    return {
      unsubscribe: () => {
        clearInterval(interval);
        broadcast('LEAVE', user);
        channel.close();
      },
      // Method to force a broadcast update (e.g. when avatar changes)
      updateUser: (updatedUser: UserProfile) => {
         peers.set(updatedUser.name, updatedUser);
         broadcast('HEARTBEAT', updatedUser);
         onUsersChange(Array.from(peers.values()));
      }
    };
  }
};