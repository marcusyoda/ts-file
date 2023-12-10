import * as fs from 'fs/promises'
import * as path from 'path'

/**
 * Validates the existence and match of a file or directory between source and destination paths.
 * If the source path is a directory, it recursively validates all contained files and subdirectories.
 * If it is a file, it checks for the file's existence at the destination path.
 *
 * @param {string} srcPath - The path of the source file or directory.
 * @param {string} destPath - The path of the destination file or directory.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the file or directory exists and matches
 *                             in the destination path, `false` otherwise.
 */
export const validateFileOrDirExistence = async (srcPath: string, destPath: string): Promise<boolean> => {
  const srcStat = await fs.stat(srcPath)

  if (srcStat.isDirectory()) {
    return copyValidate(srcPath, destPath)
  } else {
    try {
      await fs.access(destPath, fs.constants.F_OK)
      return true
    } catch {
      return false
    }
  }
}

/**
 * Validates that all files and directories in the source directory exist and match in the destination directory.
 * This function checks each entry in the source directory and validates its existence in the destination directory.
 * It is used to ensure that a copy operation has successfully duplicated the source directory's contents.
 *
 * @param {string} srcDir - The path of the source directory.
 * @param {string} destDir - The path of the destination directory.
 * @returns {Promise<boolean>} A promise that resolves to `true` if all entries in the source directory exist and match
 *                             in the destination directory, `false` otherwise.
 */
export const copyValidate = async (srcDir: string, destDir: string): Promise<boolean> => {
  const srcEntries = await fs.readdir(srcDir, { withFileTypes: true })
  const destEntries = await fs.readdir(destDir, { withFileTypes: true })
  const destNames = destEntries.map(entry => entry.name)

  for (const srcEntry of srcEntries) {
    const srcPath = path.join(srcDir, srcEntry.name)
    const destPath = path.join(destDir, srcEntry.name)

    if (!destNames.includes(srcEntry.name) || !(await validateFileOrDirExistence(srcPath, destPath))) {
      return false
    }
  }

  return true
}
