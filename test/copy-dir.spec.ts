import * as fs from 'fs/promises'

import { copyDir } from '../src'

jest.mock('fs/promises', () => ({
  mkdir: jest.fn(),
  readdir: jest.fn(),
  copyFile: jest.fn(),
}))

describe('copyDir', () => {
  const mockCopyFile = fs.copyFile as jest.Mock
  const mockMkDir = fs.mkdir as jest.Mock
  const mockReadDir = fs.readdir as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('success', () => {
    it('should recursively copy all contents of a directory', async () => {
      mockReadDir.mockResolvedValue([{ name: 'file.txt', isDirectory: () => false }])
      mockMkDir.mockResolvedValue(undefined)
      mockCopyFile.mockResolvedValue(undefined)

      await copyDir('/path/to/src', '/path/to/dest')

      expect(fs.mkdir).toHaveBeenCalledWith('/path/to/dest', { recursive: true })
      expect(fs.readdir).toHaveBeenCalledWith('/path/to/src', { withFileTypes: true })
      expect(fs.copyFile).toHaveBeenCalledWith('/path/to/src/file.txt', '/path/to/dest/file.txt')
    })

    it('should copy subdirectories and their contents', async () => {
      mockReadDir.mockResolvedValueOnce([{ name: 'subdir', isDirectory: () => true }]).mockResolvedValueOnce([{ name: 'file.txt', isDirectory: () => false }])

      await copyDir('/path/to/src', '/path/to/dest')

      expect(fs.mkdir).toHaveBeenCalledWith('/path/to/dest/subdir', { recursive: true })
      expect(fs.copyFile).toHaveBeenCalledWith('/path/to/src/subdir/file.txt', '/path/to/dest/subdir/file.txt')
    })

    it('should handle empty directories', async () => {
      mockReadDir.mockResolvedValue([])

      await copyDir('/path/to/emptyDir', '/path/to/destEmptyDir')

      expect(fs.mkdir).toHaveBeenCalledWith('/path/to/destEmptyDir', { recursive: true })
      expect(fs.readdir).toHaveBeenCalledWith('/path/to/emptyDir', { withFileTypes: true })
      expect(fs.copyFile).not.toHaveBeenCalled()
    })
  })

  describe('error', () => {
    it('should throw an error if the source directory does not exist', async () => {
      mockReadDir.mockRejectedValue(new Error('Source directory not found'))

      await expect(copyDir('/path/to/nonexistent', '/path/to/dest')).rejects.toThrow('Source directory not found')
    })
  })

  describe('extreme', () => {
    it('should copy multiple files and directories', async () => {
      mockReadDir
        .mockResolvedValueOnce([
          { name: 'file1.txt', isDirectory: () => false },
          { name: 'file2.txt', isDirectory: () => false },
          { name: 'subdir', isDirectory: () => true },
        ])
        .mockResolvedValueOnce([{ name: 'file3.txt', isDirectory: () => false }])

      await copyDir('/path/to/src', '/path/to/dest')

      expect(fs.copyFile).toHaveBeenCalledWith('/path/to/src/file1.txt', '/path/to/dest/file1.txt')
      expect(fs.copyFile).toHaveBeenCalledWith('/path/to/src/file2.txt', '/path/to/dest/file2.txt')
      expect(fs.copyFile).toHaveBeenCalledWith('/path/to/src/subdir/file3.txt', '/path/to/dest/subdir/file3.txt')
    })
  })
})
