# CI/CD para KerygmaAI

Este repositório utiliza GitHub Actions e Expo Application Services (EAS) para automatizar testes, builds e entregas da aplicação.

## Fluxo de CI/CD

### Pull Requests para a Branch Main

Quando um PR é aberto ou atualizado para a branch principal:

1. **Testes Automatizados**: Todos os testes Jest são executados automaticamente
2. **Cobertura de Código**: Um relatório de cobertura de código é gerado e publicado
3. **Verificação de Status**: O PR só pode ser aprovado se todos os testes passarem

### Push para a Branch Main

Quando código é integrado à branch principal (após PR aprovado):

1. **Testes**: Executa novamente os testes para garantir integridade
2. **Build Preview**: Gera builds de preview para Android (APK) e iOS
3. **Atualização OTA**: Publica uma atualização OTA através do EAS Update

## Configuração Necessária

Para utilizar o fluxo completo, você precisa configurar:

1. **Secrets no GitHub**:
   - `EXPO_TOKEN`: Token de acesso ao Expo (obtenha em https://expo.dev/settings/access-tokens)

2. **Configuração do Expo**:
   - Certifique-se de que seu app está configurado corretamente no Expo
   - Execute `npx expo login` antes de iniciar os fluxos em ambiente local

## Perfis de Build

No arquivo `eas.json`, configuramos três perfis de build:

- **development**: Builds com cliente de desenvolvimento, para testes locais
- **preview**: Builds internas para teste, enviadas aos testadores
- **production**: Builds para lançamento nas lojas de aplicativos

## Como Funciona

1. **Teste Local**:
   ```bash
   npm test
   ```

2. **Preparação para PR**:
   - Escreva testes para suas novas funcionalidades
   - Certifique-se de que todos os testes estão passando
   - Abra um PR para a branch main

3. **Revisão e Merge**:
   - GitHub Actions executará os testes
   - O status do workflow aparecerá no PR
   - Um revisor pode aprovar e fazer merge quando tudo estiver ok

4. **Entrega**:
   - Após o merge, builds serão gerados automaticamente
   - Uma atualização OTA será publicada automaticamente
   - Testadores poderão acessar a nova versão