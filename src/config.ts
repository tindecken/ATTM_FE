interface Config {
  baseURL: string
}
const config: Config = {
  baseURL: process.env.API_URL || '',
  // baseURL: process.env.API_URL,
};
export default config;
