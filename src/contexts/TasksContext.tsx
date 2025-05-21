'use client';

import { createContext, useContext, useState, ReactNode, useRef } from 'react';

export interface Task {
	id: string;
	title: string;
	date: string; // YYYY-MM-DD format
	completed: boolean;
	taskType: 'power' | 'primary';
}

interface TasksState {
	[date: string]: Task[];
}

interface TasksContextType {
	tasks: TasksState;
	addTask: (
		date: string,
		title: string,
		taskType: 'power' | 'primary',
		position?: number
	) => void;
	removeTask: (taskId: string) => void;
	updateTaskCompletion: (taskId: string, completed: boolean) => void;
	updateTaskTitle: (taskId: string, title: string) => void;
	moveTask: (taskId: string, newDate: string, newIndex: number) => void;
	updateTaskType: (taskId: string, newType: 'power' | 'primary') => void;
	hasDatePowerTask: (date: string) => boolean;
	reorderTasks: (date: string, startIndex: number, endIndex: number) => void;
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
				taskType: 'power',
			},
			{
				id: 'task_2',
				title: 'Hello World',
				date: '2025-05-01',
				completed: false,
				taskType: 'primary',
			},
			{
				id: 'task_3',
				title: 'HelloImkktkmrdt',
				date: '2025-05-01',
				completed: false,
				taskType: 'primary',
			},
			{
				id: 'task_4',
				title: 'sersrseresr',
				date: '2025-05-01',
				completed: false,
				taskType: 'primary',
			},
			{
				id: 'task_5',
				title: 'ssgsgsgsgeges',
				date: '2025-05-01',
				completed: false,
				taskType: 'primary',
			},
			{
				id: 'task_6',
				title: 'sdsfsersereres',
				date: '2025-05-01',
				completed: false,
				taskType: 'primary',
			},
		],
	}).current;

	const [tasks, setTasks] = useState<TasksState>(initialTasks);

	const hasDatePowerTask = (date: string): boolean => {
		return tasks[date]?.some((task) => task.taskType === 'power') || false;
	};

	const addTask = (
		date: string,
		title: string,
		taskType: 'power' | 'primary',
		position?: number
	) => {
		if (!title.trim()) return;

		// If trying to add a power task but one already exists, default to primary
		const shouldBePrimary = taskType === 'power' && hasDatePowerTask(date);
		const finalTaskType = shouldBePrimary ? 'primary' : taskType;

		setTasks((prevTasks: TasksState) => {
			const dateTasks = prevTasks[date] || [];
			const newTask = {
				id: generateId(),
				title,
				date,
				completed: false,
				taskType: finalTaskType,
			};

			// If position is specified, insert at that position
			if (typeof position === 'number') {
				return {
					...prevTasks,
					[date]: [
						...dateTasks.slice(0, position),
						newTask,
						...dateTasks.slice(position),
					],
				};
			}

			// Otherwise, add to the end
			return {
				...prevTasks,
				[date]: [...dateTasks, newTask],
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

	const updateTaskType = (taskId: string, newType: 'power' | 'primary') => {
		setTasks((prevTasks: TasksState) => {
			const newTasks = { ...prevTasks };
			let taskDate: string | undefined;

			// Find the task's date
			Object.keys(newTasks).forEach((date) => {
				if (newTasks[date].some((task) => task.id === taskId)) {
					taskDate = date;
				}
			});

			if (!taskDate) return prevTasks;

			// If trying to make it a power task, check if one already exists
			if (newType === 'power') {
				const existingPowerTask = newTasks[taskDate].find(
					(task) => task.taskType === 'power' && task.id !== taskId
				);

				// If there's already a power task, don't change anything
				if (existingPowerTask) return prevTasks;
			}

			// Update the task type
			Object.keys(newTasks).forEach((date) => {
				newTasks[date] = newTasks[date].map((task) =>
					task.id === taskId ? { ...task, taskType: newType } : task
				);
			});

			return newTasks;
		});
	};

	const moveTask = (taskId: string, newDate: string, newIndex: number) => {
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

			// If we found the task, add it to the new date at the specified index
			if (taskToMove) {
				if (!newTasks[newDate]) {
					newTasks[newDate] = [];
				}

				// No longer automatically convert primary tasks to power tasks
				// Keep the task's original type when moving

				// Insert the task at the specified index
				newTasks[newDate] = [
					...newTasks[newDate].slice(0, newIndex),
					taskToMove,
					...newTasks[newDate].slice(newIndex),
				];

				// Clean up empty date entries
				if (oldDate && newTasks[oldDate].length === 0) {
					delete newTasks[oldDate];
				}
			}

			return newTasks;
		});
	};

	const reorderTasks = (
		date: string,
		startIndex: number,
		endIndex: number
	) => {
		setTasks((prevTasks: TasksState) => {
			const newTasks = { ...prevTasks };
			if (!newTasks[date]) return prevTasks;

			// Get the tasks for the specific date
			const dateTasks = [...newTasks[date]];

			// Remove the task from the start index
			const [movedTask] = dateTasks.splice(startIndex, 1);

			// Insert the task at the end index
			dateTasks.splice(endIndex, 0, movedTask);

			// Update the tasks for this date
			newTasks[date] = dateTasks;

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
				updateTaskType,
				hasDatePowerTask,
				reorderTasks,
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
