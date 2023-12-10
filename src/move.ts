import * as fs from 'fs/promises'

import { moveDir } from './move-dir'

export const move = async (sourcePath: string, destinationPath: string): Promise<void> => {
  try {
    await fs.rename(sourcePath, destinationPath)
  } catch (error) {
    const stat = await fs.stat(sourcePath)
    if (stat.isDirectory()) {
      await moveDir(sourcePath, destinationPath)
    } else {
      throw error
    }
  }
}
