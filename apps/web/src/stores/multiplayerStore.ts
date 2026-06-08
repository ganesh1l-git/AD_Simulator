import { create } from 'zustand';

interface Player {
  id: string;
  name: string;
  role: 'ATTACKER' | 'DEFENDER' | 'SPECTATOR';
  isReady: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
}

interface MultiplayerState {
  roomCode: string | null;
  players: Player[];
  messages: ChatMessage[];
  gameStatus: 'LOBBY' | 'IN_GAME' | 'RESULTS';
  currentRole: 'ATTACKER' | 'DEFENDER' | 'SPECTATOR' | null;
  
  // Actions
  createRoom: (code: string, creatorName: string) => void;
  joinRoom: (code: string, joinerName: string) => void;
  leaveRoom: () => void;
  setReadyStatus: (isReady: boolean) => void;
  assignRole: (role: 'ATTACKER' | 'DEFENDER' | 'SPECTATOR') => void;
  sendChatMessage: (text: string) => void;
  updateRoomState: (players: Player[], status: MultiplayerState['gameStatus']) => void;
  receiveChatMessage: (msg: ChatMessage) => void;
}

export const useMultiplayerStore = create<MultiplayerState>((set, get) => ({
  roomCode: null,
  players: [],
  messages: [],
  gameStatus: 'LOBBY',
  currentRole: null,

  createRoom: (code, creatorName) => {
    const creator: Player = {
      id: 'local-player',
      name: creatorName,
      role: 'DEFENDER',
      isReady: false
    };
    set({
      roomCode: code,
      players: [creator],
      messages: [],
      gameStatus: 'LOBBY',
      currentRole: 'DEFENDER'
    });
  },

  joinRoom: (code, joinerName) => {
    const localPlayer: Player = {
      id: 'local-player',
      name: joinerName,
      role: 'ATTACKER',
      isReady: false
    };
    const opponent: Player = {
      id: 'opp-1',
      name: 'Host Commander',
      role: 'DEFENDER',
      isReady: true
    };
    set({
      roomCode: code,
      players: [opponent, localPlayer],
      messages: [],
      gameStatus: 'LOBBY',
      currentRole: 'ATTACKER'
    });
  },

  leaveRoom: () => {
    set({
      roomCode: null,
      players: [],
      messages: [],
      gameStatus: 'LOBBY',
      currentRole: null
    });
  },

  setReadyStatus: (isReady) => {
    set((state) => ({
      players: state.players.map(p => p.id === 'local-player' ? { ...p, isReady } : p)
    }));
  },

  assignRole: (role) => {
    set((state) => ({
      currentRole: role,
      players: state.players.map(p => p.id === 'local-player' ? { ...p, role } : p)
    }));
  },

  sendChatMessage: (text) => {
    const localPlayer = get().players.find(p => p.id === 'local-player');
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: localPlayer?.name || 'Local Commander',
      text,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    set((state) => ({
      messages: [...state.messages, newMsg]
    }));
  },

  updateRoomState: (players, status) => set({ players, gameStatus: status }),
  
  receiveChatMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] }))
}));
