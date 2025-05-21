'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { useTasks } from '@/contexts/TasksContext';
import { TaskItem } from './task-item';
import { Input } from './ui/input';
import { GripVertical } from 'lucide-react';
import { Droppable, Draggable } from '@hello-pangea/dnd';

interface DailyTaskListProps {
	selectedDate: Date;
	isPowerTask: boolean;
	droppableId: string;
}

export function DailyTaskList({
	selectedDate,
	isPowerTask,
	droppableId,
}: DailyTaskListProps) {
	const [newTaskText, setNewTaskText] = useState('');
	const [isAddingTask, setIsAddingTask] = useState(false);
	const dateStr = format(selectedDate, 'yyyy-MM-dd');
	const {
		tasks,
		addTask,
		removeTask,
		updateTaskCompletion,
		updateTaskTitle,
		hasDatePowerTask,
		updateTaskType,
	} = useTasks();

	// Get tasks for the selected date
	const dayTasks = tasks[dateStr] || [];

	// Filter tasks based on taskType
	const filteredTasks = dayTasks.filter((task) =>
		isPowerTask ? task.taskType === 'power' : task.taskType === 'primary'
	);

	const handleAddTask = () => {
		if (newTaskText.trim()) {
			// Determine task type
			const taskType = isPowerTask ? 'power' : 'primary';

			// Add the task
			addTask(dateStr, newTaskText, taskType);
			setNewTaskText('');
			setIsAddingTask(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleAddTask();
		} else if (e.key === 'Escape') {
			setIsAddingTask(false);
			setNewTaskText('');
		}
	};

	return (
		<div className='space-y-2'>
			{isPowerTask && (
				<div className='flex items-center mb-4'>
					<div className='bg-black p-2 rounded-md mr-3'>
						<svg
							className='h-5 w-5 text-white'
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						>
							<path d='M13 2L3 14h9l-1 8 10-12h-9l1-8z'></path>
						</svg>
					</div>
					<div>
						<h3 className='text-lg font-semibold'>
							The Power Task
						</h3>
						<p className='text-gray-500 text-sm'>
							Your Power Task is the most important thing you can
							do for your goals today.
						</p>
					</div>
				</div>
			)}

			{!isPowerTask && (
				<div className='flex items-center mb-4'>
					<div className='bg-gray-800 p-2 rounded-md mr-3'>
						<svg
							className='h-5 w-5 text-white'
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						>
							<path d='M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9'></path>
							<path d='M13.73 21a2 2 0 0 1-3.46 0'></path>
						</svg>
					</div>
					<div>
						<h3 className='text-lg font-semibold'>Primary Tasks</h3>
						<p className='text-gray-500 text-sm'>
							Urgent or important tasks for the day.
						</p>
					</div>
				</div>
			)}

			<div className='rounded-md overflow-hidden bg-white border border-gray-200'>
				<Droppable droppableId={droppableId}>
					{(provided) => (
						<div
							ref={provided.innerRef}
							{...provided.droppableProps}
							className='bg-white'
						>
							{filteredTasks.length > 0 && (
								<div>
									{filteredTasks.map((task, index) => (
										<Draggable
											key={task.id}
											draggableId={task.id}
											index={index}
										>
											{(provided) => (
												<div
													ref={provided.innerRef}
													{...provided.draggableProps}
													className='border-b border-gray-100 last:border-0 flex items-center'
												>
													<div
														{...provided.dragHandleProps}
														className='px-1 py-3 cursor-grab flex items-center text-gray-400 hover:text-gray-600'
													>
														<GripVertical
															size={16}
														/>
													</div>
													<div className='flex-grow'>
														<TaskItem
															task={task}
															onRemove={
																removeTask
															}
															onCompletionChange={
																updateTaskCompletion
															}
															onUpdateTitle={
																updateTaskTitle
															}
															onUpdateTaskType={
																updateTaskType
															}
														/>
													</div>
												</div>
											)}
										</Draggable>
									))}
								</div>
							)}
							{provided.placeholder}

							{isPowerTask ? (
								// Only show the power task input if no power task exists for this date
								!hasDatePowerTask(dateStr) &&
								(isAddingTask ? (
									<div className='flex items-center px-4 py-3 gap-2 text-sm border-t border-gray-100'>
										<div className='flex-shrink-0 h-5 w-5 rounded-full border border-gray-300'></div>
										<Input
											value={newTaskText}
											onChange={(e) =>
												setNewTaskText(e.target.value)
											}
											placeholder='Your power task...'
											className='text-sm flex-grow border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0'
											autoFocus
											onKeyDown={handleKeyDown}
										/>
										<div className='flex gap-1'>
											<button
												className='text-blue-500 hover:text-blue-700 text-sm font-medium'
												onClick={handleAddTask}
											>
												Add
											</button>
											<button
												className='text-gray-500 hover:text-gray-700 text-sm ml-2'
												onClick={() =>
													setIsAddingTask(false)
												}
											>
												Cancel
											</button>
										</div>
									</div>
								) : (
									<div
										className={`flex items-center px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer ${
											filteredTasks.length > 0
												? 'border-t border-gray-100'
												: ''
										}`}
										onClick={() => setIsAddingTask(true)}
									>
										<div className='flex-shrink-0 h-5 w-5 rounded-full border border-gray-300'></div>

										<span className='ml-3 text-gray-400'>
											Click here to add power task
										</span>
										<svg
											className='h-4 w-4 text-gray-400 ml-2 mr-1'
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 24 24'
											fill='none'
											stroke='currentColor'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'
										>
											<path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'></path>
											<path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'></path>
										</svg>
									</div>
								))
							) : isAddingTask ? (
								<div className='flex items-center px-4 py-3 gap-2 text-sm border-t border-gray-100'>
									<div className='flex-shrink-0 h-5 w-5 rounded-full border border-gray-300'></div>
									<Input
										value={newTaskText}
										onChange={(e) =>
											setNewTaskText(e.target.value)
										}
										placeholder='Add a new task...'
										className='text-sm flex-grow border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0'
										autoFocus
										onKeyDown={handleKeyDown}
									/>
									<div className='flex gap-1'>
										<button
											className='text-blue-500 hover:text-blue-700 text-sm font-medium'
											onClick={handleAddTask}
										>
											Add
										</button>
										<button
											className='text-gray-500 hover:text-gray-700 text-sm ml-2'
											onClick={() =>
												setIsAddingTask(false)
											}
										>
											Cancel
										</button>
									</div>
								</div>
							) : (
								<div
									className={`flex items-center px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer ${
										filteredTasks.length > 0
											? 'border-t border-gray-100'
											: ''
									}`}
									onClick={() => setIsAddingTask(true)}
								>
									<div className='flex-shrink-0 h-5 w-5 rounded-full border border-gray-300'></div>

									<span className='ml-3 text-gray-400'>
										Click here to add primary task
									</span>
									<svg
										className='h-4 w-4 text-gray-400 ml-2 mr-1'
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
									>
										<path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'></path>
										<path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'></path>
									</svg>
								</div>
							)}
						</div>
					)}
				</Droppable>
			</div>
		</div>
	);
}
