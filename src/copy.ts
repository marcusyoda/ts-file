import * as fs from 'fs/promises'

import { copyDir } from './copy-dir'

/**
 * Copies a file or directory from one location to another.
 * If the source is a directory, it copies the entire directory and its contents.
 * If the source is a file, it copies the file.
 *
 * @param {string} sourcePath - The path of the source file or directory.
 * @param {string} destinationPath - The path to the destination where the file or directory is to be copied.
 * @returns {Promise<void>} A promise that resolves when the copy operation is complete.
 * @throws {Error} Throws an error if the copy operation fails.
 */
export const copy = async (sourcePath: string, destinationPath: string): Promise<void> => {
  const stat = await fs.stat(sourcePath)
  if (stat.isDirectory()) {
    await copyDir(sourcePath, destinationPath)
  } else {
    await fs.copyFile(sourcePath, destinationPath)
  }
}
