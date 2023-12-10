import * as fs from 'fs/promises'

import { copyDir } from './copy-dir'

export const moveDir = async (srcDir: string, destDir: string): Promise<void> => {
  await copyDir(srcDir, destDir)
  await fs.rm(srcDir, { recursive: true })
}
