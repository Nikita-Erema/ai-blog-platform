import OpenAI from 'openai';

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (openaiClient) {
    return openaiClient;
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'Missing OPENAI_API_KEY environment variable. Please set OPENAI_API_KEY in your .env.local file. See SETUP.md for instructions.'
    );
  }

  openaiClient = new OpenAI({
    apiKey,
  });
  return openaiClient;
}

// Ленивая инициализация через Proxy - проверка переменных только при использовании
// Это позволяет приложению запускаться даже без настроенных переменных окружения
// Ошибка возникнет только при попытке использовать OpenAI
export const openai = new Proxy({} as OpenAI, {
  get(_target, prop, receiver) {
    const client = getOpenAIClient();
    const value = Reflect.get(client, prop, receiver);
    // Если это функция, привязываем контекст
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});

