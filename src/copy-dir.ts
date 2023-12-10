import * as fs from 'fs/promises'
import * as path from 'path'

/**
 * Copies a directory along with all its contents to a new location.
 * This function is recursive and will copy all subdirectories and files within the source directory.
 *
 * @param {string} srcDir - The source directory path to be copied.
 * @param {string} destDir - The destination directory path where the source directory will be copied.
 * @returns {Promise<void>} A promise that resolves when the copy operation is complete.
 * @throws {Error} Throws an error if the copy operation fails.
 */
export const copyDir = async (srcDir: string, destDir: string): Promise<void> => {
  await fs.mkdir(destDir, { recursive: true })
  const entries = await fs.readdir(srcDir, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name)
    const destPath = path.join(destDir, entry.name)

    entry.isDirectory() ? await copyDir(srcPath, destPath) : await fs.copyFile(srcPath, destPath)
  }
}
