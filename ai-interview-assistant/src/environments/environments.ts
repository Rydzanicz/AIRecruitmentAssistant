export const environment = {
  production: false,
  openai: {
    apiKey: '', // Zostanie ustawiony przez użytkownika
    baseUrl: 'https://api.openai.com/v1'
  },
  speechToText: {
    provider: 'browser', // 'google', 'assemblyai', 'deepgram'
    apiKey: ''
  }
};
