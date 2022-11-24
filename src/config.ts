interface Config {
  baseURL: string;
  socketServer: string;
  screenWidth: number;
  screenHeight: number;
}
const config: Config = {
  baseURL: process.env.API_URL || '',
  socketServer: process.env.SocketServer || '',
  screenWidth: 3440,
  screenHeight: 1440,
};
export default config;
