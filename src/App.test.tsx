import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App.tsx'

afterEach(cleanup)

const addTask = async (title: string) => {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('新しいタスク'), title)
  await user.click(screen.getByRole('button', { name: '追加' }))
  return user
}

describe('App', () => {
  it('テキスト入力でタスクを追加できる', async () => {
    render(<App />)
    await addTask('牛乳を買う')

    expect(screen.getByText('牛乳を買う')).toBeTruthy()
    expect(
      (screen.getByLabelText('新しいタスク') as HTMLInputElement).value,
    ).toBe('')
  })

  it('空白だけの入力では追加しない', async () => {
    render(<App />)
    await addTask('   ')

    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('チェックボックスで完了・未完了を切り替え、完了済みに done クラスが付く', async () => {
    render(<App />)
    const user = await addTask('洗濯')
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement
    const item = screen.getByRole('listitem')

    await user.click(checkbox)
    expect(checkbox.checked).toBe(true)
    expect(item.classList.contains('done')).toBe(true)

    await user.click(checkbox)
    expect(checkbox.checked).toBe(false)
    expect(item.classList.contains('done')).toBe(false)
  })

  it('タスクを削除できる', async () => {
    render(<App />)
    const user = await addTask('掃除')
    await addTask('料理')

    await user.click(screen.getByRole('button', { name: '「掃除」を削除' }))

    expect(screen.queryByText('掃除')).toBeNull()
    expect(screen.getByText('料理')).toBeTruthy()
  })
})
