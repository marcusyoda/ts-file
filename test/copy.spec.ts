import * as fs from 'fs/promises'
import { copy } from '../src'
import { copyDir } from '../src/copy-dir'

jest.mock('fs/promises')
jest.mock('../src/copy-dir')

describe('copy', () => {
  const mockStat = fs.stat as jest.Mock
  const mockCopyFile = fs.copyFile as jest.Mock
  const mockCopyDir = copyDir as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('success', () => {
    it('should copy a file when source is a file', async () => {
      mockStat.mockResolvedValue({ isDirectory: () => false })
      mockCopyFile.mockResolvedValue(undefined)

      await copy('/path/to/file.txt', '/path/to/dest/file.txt')

      expect(mockCopyFile).toHaveBeenCalledWith('/path/to/file.txt', '/path/to/dest/file.txt')
    })

    it('should copy a directory when source is a directory', async () => {
      mockStat.mockResolvedValue({ isDirectory: () => true })
      mockCopyDir.mockResolvedValue(undefined)

      await copy('/path/to/srcDir', '/path/to/destDir')

      expect(mockCopyDir).toHaveBeenCalledWith('/path/to/srcDir', '/path/to/destDir')
    })

    it('should handle relative paths for copying files', async () => {
      mockStat.mockResolvedValue({ isDirectory: () => false })
      mockCopyFile.mockResolvedValue(undefined)

      await copy('relative/path/to/file.txt', 'relative/path/to/dest/file.txt')

      expect(mockCopyFile).toHaveBeenCalledWith(expect.any(String), expect.any(String))
    })
  })

  describe('error', () => {
    it('should throw an error if the source path does not exist', async () => {
      mockStat.mockRejectedValue(new Error('Source path not found'))

      await expect(copy('/path/to/nonexistent', '/path/to/dest')).rejects.toThrow('Source path not found')
    })

    it('should throw an error if file copy fails', async () => {
      mockStat.mockResolvedValue({ isDirectory: () => false })
      mockCopyFile.mockRejectedValue(new Error('Failed to copy file'))

      await expect(copy('/path/to/file.txt', '/path/to/dest/file.txt')).rejects.toThrow('Failed to copy file')
    })

    it('should throw an error if destination directory is not writable', async () => {
      mockStat.mockResolvedValue({ isDirectory: () => false })
      mockCopyFile.mockRejectedValue(new Error('Destination directory is not writable'))

      await expect(copy('/path/to/file.txt', '/path/to/protected/dest/file.txt')).rejects.toThrow('Destination directory is not writable')
    })
  })
})
