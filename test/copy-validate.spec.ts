import * as fs from 'fs/promises'
import * as path from 'path'

import { copyValidate } from '../src'

jest.mock('fs/promises')
jest.mock('path', () => ({
  join: jest.fn(),
}))

describe('copyValidate', () => {
  const mockReadDir = fs.readdir as jest.Mock
  const mockStat = fs.stat as jest.Mock
  const mockAccess = fs.access as jest.Mock
  const mockJoin = path.join as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('success', () => {
    it('should handle recursive directories', async () => {
      mockReadDir
        .mockResolvedValueOnce([
          { name: 'subdir', isDirectory: () => true },
          { name: 'file.txt', isDirectory: () => false },
        ])
        .mockResolvedValueOnce([{ name: 'innerFile.txt', isDirectory: () => false }])

      mockStat.mockResolvedValueOnce({ isDirectory: () => true }).mockResolvedValue({ isDirectory: () => false })

      mockAccess.mockResolvedValue(undefined)

      const result = await copyValidate('/src', '/dest')

      expect(result).toBe(true)
    })

    it('should return true when all entries match', async () => {
      mockReadDir.mockResolvedValue([{ name: 'file.txt', isDirectory: () => false }])
      mockStat.mockResolvedValue({ isDirectory: () => false })
      mockAccess.mockResolvedValue(undefined)
      mockJoin.mockImplementation((...args) => args.join('/'))

      const result = await copyValidate('/src', '/dest')

      expect(result).toBe(true)
    })

    it('should return false when an entry does not match', async () => {
      mockReadDir.mockResolvedValue([{ name: 'file.txt', isDirectory: () => false }])
      mockStat.mockResolvedValue({ isDirectory: () => false })
      mockAccess.mockRejectedValue(new Error('File not found'))
      mockJoin.mockImplementation((...args) => args.join('/'))

      const result = await copyValidate('/src', '/dest')

      expect(result).toBe(false)
    })
  })
})
