import 'dotenv/config';
import { createServer } from 'http';
import { app } from './app';
import { initializeSocket } from './socket';

const PORT = process.env.PORT || 3001;

const httpServer = createServer(app);

// Initialize Socket.IO
initializeSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`\n🚀 IADES Server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.IO ready`);
  console.log(`🔗 API: http://localhost:${PORT}/api/v1\n`);
});
