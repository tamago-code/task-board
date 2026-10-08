import { useEffect, useState, type FormEvent } from 'react'

type Task = {
  id: number
  title: string
  done: boolean
}

export const STORAGE_KEY = 'task-board.tasks'

const isTask = (value: unknown): value is Task => {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.id === 'number' &&
    typeof v.title === 'string' &&
    typeof v.done === 'boolean'
  )
}

// 保存データが壊れている・ストレージが使えない場合は空から始める
const loadTasks = (): Task[] => {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter(isTask) : []
  } catch {
    return []
  }
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks)
  const [input, setInput] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      // 容量超過やプライベートモードでは保存を諦め、画面上の操作は続けられるようにする
    }
  }, [tasks])

  const addTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const title = input.trim()
    if (!title) return
    setTasks((prev) => [
      ...prev,
      { id: Math.max(0, ...prev.map((t) => t.id)) + 1, title, done: false },
    ])
    setInput('')
  }

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    )
  }

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <main className="board">
      <h1>タスクボード</h1>

      <form className="add-form" onSubmit={addTask}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="新しいタスクを入力"
          aria-label="新しいタスク"
        />
        <button type="submit">追加</button>
      </form>

      {tasks.length === 0 ? (
        <p className="empty">タスクはありません</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={task.done ? 'task done' : 'task'}>
              <label>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                />
                <span>{task.title}</span>
              </label>
              <button
                type="button"
                className="delete"
                onClick={() => deleteTask(task.id)}
                aria-label={`「${task.title}」を削除`}
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default App
