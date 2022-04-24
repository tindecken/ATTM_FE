interface Config {
  baseURL: string;
  socketServer: string;
}
const config: Config = {
  baseURL: process.env.API_URL || '',
  socketServer: process.env.SocketServer || '',
};
export default config;
