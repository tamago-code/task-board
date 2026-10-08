import { useState, type FormEvent } from 'react'

type Task = {
  id: number
  title: string
  done: boolean
}

let nextId = 1

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [input, setInput] = useState('')

  const addTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const title = input.trim()
    if (!title) return
    const task = { id: nextId++, title, done: false }
    setTasks((prev) => [...prev, task])
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
