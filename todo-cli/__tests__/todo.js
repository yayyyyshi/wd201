const todoList = require("../todo");

const formattedDate = (d) => d.toISOString().split("T")[0];

describe("Todo test suite", () => {
  let todos;
  const today = formattedDate(new Date());
  const yesterday = formattedDate(new Date(Date.now() - 86400000));
  const tomorrow = formattedDate(new Date(Date.now() + 86400000));

  beforeEach(() => {
    todos = todoList();
  });

  test("Should add a new todo", () => {
    todos.add({ title: "Test todo", dueDate: today, completed: false });
    expect(todos.all.length).toBe(1);
  });

  test("Should mark a todo as complete", () => {
    todos.add({ title: "Complete me", dueDate: today, completed: false });
    todos.markAsComplete(0);
    expect(todos.all[0].completed).toBe(true);
  });

  test("Should retrieve overdue items", () => {
    todos.add({ title: "Overdue todo", dueDate: yesterday, completed: false });
    const overdues = todos.overdue();
    expect(overdues.length).toBe(1);
    expect(overdues[0].dueDate).toBe(yesterday);
  });

  test("Should retrieve due today items", () => {
    todos.add({ title: "Due today", dueDate: today, completed: false });
    const dueToday = todos.dueToday();
    expect(dueToday.length).toBe(1);
    expect(dueToday[0].dueDate).toBe(today);
  });

  test("Should retrieve due later items", () => {
    todos.add({ title: "Due later", dueDate: tomorrow, completed: false });
    const dueLater = todos.dueLater();
    expect(dueLater.length).toBe(1);
    expect(dueLater[0].dueDate).toBe(tomorrow);
  });
});