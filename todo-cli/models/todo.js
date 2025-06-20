'use strict';
const { Model, Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static async addTask(params) {
      return await Todo.create(params);
    }

    static async showList() {
      console.log("My Todo list\n");

      console.log("Overdue");
      const overdueItems = await Todo.overdue();
      console.log(this.toDisplayableList(overdueItems));
      console.log("\n");

      console.log("Due Today");
      const todayItems = await Todo.dueToday();
      console.log(this.toDisplayableList(todayItems));
      console.log("\n");

      console.log("Due Later");
      const laterItems = await Todo.dueLater();
      console.log(this.toDisplayableList(laterItems));
    }

    static async overdue() {
      const today = new Date().toISOString().split("T")[0];
      return await Todo.findAll({
        where: {
          dueDate: { [Op.lt]: today },
          completed: false,
        },
        order: [['id', 'ASC']],
      });
    }

    static async dueToday() {
      const today = new Date().toISOString().split("T")[0];
      return await Todo.findAll({
        where: {
          dueDate: today,
        },
        order: [['id', 'ASC']],
      });
    }

    static async dueLater() {
      const today = new Date().toISOString().split("T")[0];
      return await Todo.findAll({
        where: {
          dueDate: { [Op.gt]: today },
          completed: false,
        },
        order: [['id', 'ASC']],
      });
    }

    static async markAsComplete(id) {
      const todo = await Todo.findByPk(id);
      if (todo) {
        todo.completed = true;
        await todo.save();
      }
    }

    static toDisplayableList(list) {
      const today = new Date().toISOString().split("T")[0];
      return list
        .map((todo) => {
          const checkbox = todo.completed ? "[x]" : "[ ]";
          const datePart = todo.dueDate === today ? "" : ` ${todo.dueDate}`;
          return `${todo.id}. ${checkbox} ${todo.title}${datePart}`;
        })
        .join("\n");
    }

    displayableString() {
      const checkbox = this.completed ? "[x]" : "[ ]";
      const today = new Date().toISOString().split("T")[0];
      const datePart = this.dueDate === today ? "" : ` ${this.dueDate}`;
      return `${this.id}. ${checkbox} ${this.title}${datePart}`;
    }
  }

  Todo.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      completed: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: 'Todo',
    }
  );

  return Todo;
};