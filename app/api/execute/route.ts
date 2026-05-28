import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { writeFile, unlink, mkdir } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'
import { existsSync } from 'fs'

export const runtime = 'nodejs'
export const maxDuration = 300

interface ExecResult {
  output: string
  error: string
  exitCode: number
  executionTime: number
}

function runCommand(cmd: string, cwd?: string, timeout = 15000): Promise<ExecResult> {
  return new Promise((resolve) => {
    const start = Date.now()
    exec(cmd, { cwd, timeout, maxBuffer: 5 * 1024 * 1024 }, (err, stdout, stderr) => {
      resolve({
        output: stdout || '',
        error: stderr || (err?.message || ''),
        exitCode: err ? (err as any).code || 1 : 0,
        executionTime: Date.now() - start,
      })
    })
  })
}

export async function POST(req: NextRequest) {
  const { code, language } = await req.json()
  if (!code || !language) {
    return NextResponse.json({ error: 'Missing code or language' }, { status: 400 })
  }

  const tmpDir = join(tmpdir(), 'code-compiler')
  if (!existsSync(tmpDir)) await mkdir(tmpDir, { recursive: true })

  try {
    let result: ExecResult

    switch (language) {
      case 'python': {
        const file = join(tmpDir, `code_${Date.now()}.py`)
        await writeFile(file, code)
        result = await runCommand(`python "${file}"`)
        await unlink(file).catch(() => {})
        break
      }

      case 'javascript': {
        const file = join(tmpDir, `code_${Date.now()}.js`)
        await writeFile(file, code)
        result = await runCommand(`node "${file}"`)
        await unlink(file).catch(() => {})
        break
      }

      case 'c': {
        const id = Date.now()
        const src = join(tmpDir, `code_${id}.c`)
        const out = join(tmpDir, `out_${id}.exe`)
        await writeFile(src, code)
        const compileResult = await runCommand(`gcc "${src}" -o "${out}" -lm`)
        if (compileResult.error) {
          result = compileResult
        } else {
          result = await runCommand(`"${out}"`)
        }
        await unlink(src).catch(() => {})
        await unlink(out).catch(() => {})
        break
      }

      case 'cpp': {
        const id = Date.now()
        const src = join(tmpDir, `code_${id}.cpp`)
        const out = join(tmpDir, `out_${id}.exe`)
        await writeFile(src, code)
        const compileResult = await runCommand(`g++ "${src}" -o "${out}" -std=c++17`)
        if (compileResult.error) {
          result = compileResult
        } else {
          result = await runCommand(`"${out}"`)
        }
        await unlink(src).catch(() => {})
        await unlink(out).catch(() => {})
        break
      }

      case 'java': {
        const id = Date.now()
        const src = join(tmpDir, `Main_${id}.java`)
        const javaCode = code.replace(/public\s+class\s+\w+/, `public class Main_${id}`)
        await writeFile(src, javaCode)
        const compileResult = await runCommand(`javac "${src}"`)
        if (compileResult.error) {
          result = compileResult
        } else {
          result = await runCommand(`java -cp "${tmpDir}" Main_${id}`)
        }
        await unlink(src).catch(() => {})
        await unlink(join(tmpDir, `Main_${id}.class`)).catch(() => {})
        break
      }

      default:
        return NextResponse.json({ error: 'Unsupported language' }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({
      output: '',
      error: err.message || 'Unknown error',
      exitCode: 1,
      executionTime: 0,
    })
  }
}
