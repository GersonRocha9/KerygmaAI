import i18n from '@/i18n';

// Fazendo o mock do AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(() => Promise.resolve()),
}));

// Mockando i18next e react-i18next
jest.mock('i18next', () => ({
  use: jest.fn().mockReturnThis(),
  init: jest.fn().mockResolvedValue(undefined),
  changeLanguage: jest.fn(),
  language: 'en',
  t: jest.fn(key => key),
}));

jest.mock('react-i18next', () => ({
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
  useTranslation: () => ({
    t: jest.fn(key => key),
  }),
}));

// Mocks para os locales
jest.mock('expo-localization', () => ({
  locale: 'en-US',
}));

describe('i18n module', () => {
  it('deve exportar a instância i18n', () => {
    expect(i18n).toBeDefined();
  });

  it('deve ter os métodos essenciais', () => {
    expect(i18n.changeLanguage).toBeDefined();
    expect(i18n.language).toBeDefined();
  });
}); 