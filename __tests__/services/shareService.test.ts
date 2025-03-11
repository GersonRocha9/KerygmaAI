import { Share } from 'react-native'
import { shareDevotional } from '../../services/shareService'

describe('shareService', () => {
  let shareSpy: jest.SpyInstance

  beforeEach(() => {
    shareSpy = jest.spyOn(Share, 'share').mockResolvedValue({
      action: 'sharedAction',
      activityType: 'com.apple.share',
    })
  })

  afterEach(() => {
    shareSpy.mockRestore()
  })

  describe('shareDevotional', () => {
    it('deve compartilhar um devocional com título fornecido', async () => {
      const content = 'Conteúdo do devocional para compartilhar.'
      const title = 'Título do Devocional'

      await shareDevotional(content, title)

      expect(shareSpy).toHaveBeenCalledWith({
        message: content,
        title: `Devocional: ${title}`,
      })
    })

    it('deve compartilhar um devocional sem título fornecido', async () => {
      const content = 'Conteúdo do devocional para compartilhar.'

      await shareDevotional(content)

      expect(shareSpy).toHaveBeenCalledWith({
        message: content,
        title: 'Devocional Diário',
      })
    })

    it('não deve compartilhar quando o conteúdo estiver vazio', async () => {
      await shareDevotional('')

      expect(shareSpy).not.toHaveBeenCalled()
    })

    it('deve lidar com erros ao compartilhar', async () => {
      const error = new Error('Erro ao compartilhar')
      shareSpy.mockRejectedValueOnce(error)

      await shareDevotional('Conteúdo')

      expect(shareSpy).toHaveBeenCalled()
    })
  })
})
