'use client';

import { createContext, useContext, useState, ReactNode, useRef } from 'react';

export interface Task {
	id: string;
	title: string;
	date: string; // YYYY-MM-DD format
	completed: boolean;
}

interface TasksState {
	[date: string]: Task[];
}

interface TasksContextType {
	tasks: TasksState;
	addTask: (date: string, title: string) => void;
	removeTask: (taskId: string) => void;
	updateTaskCompletion: (taskId: string, completed: boolean) => void;
	updateTaskTitle: (taskId: string, title: string) => void;
	moveTask: (taskId: string, newDate: string) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

// Helper to generate unique IDs
const generateId = () =>
	`task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export function TasksProvider({ children }: { children: ReactNode }) {
	// Sample initial tasks
	const initialTasks = useRef<TasksState>({
		'2025-05-01': [
			{
				id: 'task_1',
				title: 'test',
				date: '2025-05-01',
				completed: false,
			},
			{
				id: 'task_2',
				title: 'Hello World',
				date: '2025-05-01',
				completed: false,
			},
			{
				id: 'task_3',
				title: 'HelloImkktkmrdt',
				date: '2025-05-01',
				completed: false,
			},
			{
				id: 'task_4',
				title: 'sersrseresr',
				date: '2025-05-01',
				completed: false,
			},
			{
				id: 'task_5',
				title: 'ssgsgsgsgeges',
				date: '2025-05-01',
				completed: false,
			},
			{
				id: 'task_6',
				title: 'sdsfsersereres',
				date: '2025-05-01',
				completed: false,
			},
		],
	}).current;

	const [tasks, setTasks] = useState<TasksState>(initialTasks);

	const addTask = (date: string, title: string) => {
		if (!title.trim()) return;

		setTasks((prevTasks: TasksState) => {
			const dateTasks = prevTasks[date] || [];
			return {
				...prevTasks,
				[date]: [
					...dateTasks,
					{ id: generateId(), title, date, completed: false },
				],
			};
		});
	};

	const removeTask = (taskId: string) => {
		setTasks((prevTasks: TasksState) => {
			const newTasks = { ...prevTasks };

			// Find the date that contains this task
			Object.keys(newTasks).forEach((date) => {
				newTasks[date] = newTasks[date].filter(
					(task) => task.id !== taskId
				);
				// Remove the date entry if it has no tasks
				if (newTasks[date].length === 0) {
					delete newTasks[date];
				}
			});

			return newTasks;
		});
	};

	const updateTaskCompletion = (taskId: string, completed: boolean) => {
		setTasks((prevTasks: TasksState) => {
			const newTasks = { ...prevTasks };

			// Find the task and update its completion status
			Object.keys(newTasks).forEach((date) => {
				newTasks[date] = newTasks[date].map((task) =>
					task.id === taskId ? { ...task, completed } : task
				);
			});

			return newTasks;
		});
	};

	const updateTaskTitle = (taskId: string, title: string) => {
		if (!title.trim()) return;

		setTasks((prevTasks: TasksState) => {
			const newTasks = { ...prevTasks };

			// Find the task and update its title
			Object.keys(newTasks).forEach((date) => {
				newTasks[date] = newTasks[date].map((task) =>
					task.id === taskId ? { ...task, title } : task
				);
			});

			return newTasks;
		});
	};

	const moveTask = (taskId: string, newDate: string) => {
		setTasks((prevTasks: TasksState) => {
			const newTasks = { ...prevTasks };
			let taskToMove: Task | undefined;
			let oldDate: string | undefined;

			// Find the task and remove it from the old date
			Object.keys(newTasks).forEach((date) => {
				const task = newTasks[date].find((t) => t.id === taskId);
				if (task) {
					taskToMove = { ...task, date: newDate };
					oldDate = date;
					newTasks[date] = newTasks[date].filter(
						(t) => t.id !== taskId
					);
				}
			});

			// If we found the task, add it to the new date
			if (taskToMove) {
				if (!newTasks[newDate]) {
					newTasks[newDate] = [];
				}
				newTasks[newDate].push(taskToMove);

				// Clean up empty date entries
				if (oldDate && newTasks[oldDate].length === 0) {
					delete newTasks[oldDate];
				}
			}

			return newTasks;
		});
	};

	return (
		<TasksContext.Provider
			value={{
				tasks,
				addTask,
				removeTask,
				updateTaskCompletion,
				updateTaskTitle,
				moveTask,
			}}
		>
			{children}
		</TasksContext.Provider>
	);
}

export function useTasks() {
	const context = useContext(TasksContext);
	if (context === undefined) {
		throw new Error('useTasks must be used within a TasksProvider');
	}
	return context;
}
