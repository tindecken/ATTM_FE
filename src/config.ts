interface Config {
  baseURL: string,
  socketServer: string,
}
const config: Config = {
  baseURL: process.env.API_URL || '',
  socketServer: 'http://localhost:5000/monitoring',
  // baseURL: process.env.API_URL,
};
export default config;
