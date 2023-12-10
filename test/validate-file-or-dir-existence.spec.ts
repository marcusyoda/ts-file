import * as fs from 'fs/promises'
import { validateFileOrDirExistence } from '../src'

jest.mock('fs/promises')

describe('validateFileOrDirExistence', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return true for existing file', async () => {
    const mockStat = fs.stat as jest.Mock
    mockStat.mockResolvedValue({ isDirectory: () => false })

    const mockAccess = fs.access as jest.Mock
    mockAccess.mockResolvedValue(undefined)

    const result = await validateFileOrDirExistence('/src/file.txt', '/dest/file.txt')

    expect(result).toBe(true)
  })

  it('should return false for non-existing file', async () => {
    const mockStat = fs.stat as jest.Mock
    mockStat.mockResolvedValue({ isDirectory: () => false })

    const mockAccess = fs.access as jest.Mock
    mockAccess.mockRejectedValue(new Error('File not found'))

    const result = await validateFileOrDirExistence('/src/file.txt', '/dest/file.txt')

    expect(result).toBe(false)
  })
})
