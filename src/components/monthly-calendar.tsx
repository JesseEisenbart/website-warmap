'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Zap } from 'lucide-react';
import {
	format,
	startOfMonth,
	endOfMonth,
	eachDayOfInterval,
	isSameMonth,
	addMonths,
	subMonths,
	parse,
} from 'date-fns';
import { useTasks, Task } from '@/contexts/TasksContext';
import { TaskItem } from './task-item';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import { useColors } from '@/contexts/ColorContext';
import {
	DragDropContext,
	Droppable,
	Draggable,
	DropResult,
	DraggableProvidedDraggableProps,
} from '@hello-pangea/dnd';

// Optimize drag performance with a custom wrapper
const getItemStyle = (
	isDragging: boolean,
	draggableStyle?: DraggableProvidedDraggableProps['style']
) => ({
	// some basic styles to make the items look nicer
	userSelect: 'none' as const,

	// change background colour if dragging
	background: isDragging ? 'white' : 'transparent',

	// styles we need to apply on draggables
	...draggableStyle,
	// Override transition to make it faster
	transition: isDragging ? 'transform 0.05s' : undefined,
});

interface MonthlyCalendarProps {
	initialDate?: string | null;
}

export function MonthlyCalendar({ initialDate }: MonthlyCalendarProps) {
	const defaultDate = new Date('2025-05-01');
	const [currentDate, setCurrentDate] = useState<Date>(() => {
		if (initialDate) {
			try {
				// Try to parse the date string
				return parse(initialDate, 'yyyy-MM-dd', new Date());
			} catch (error) {
				console.error('Failed to parse initialDate:', error);
				return defaultDate;
			}
		}
		return defaultDate;
	});

	const [newTaskText, setNewTaskText] = useState<{ [key: string]: string }>(
		{}
	);
	const [showAddTask, setShowAddTask] = useState<{ [key: string]: boolean }>(
		{}
	);
	const [hoveredDay, setHoveredDay] = useState<string | null>(null);
	const {
		tasks,
		addTask,
		removeTask,
		updateTaskCompletion,
		updateTaskTitle,
		moveTask,
		updateTaskType,
	} = useTasks();
	const { getDayColorsForMonth } = useColors();

	// Update current date if initialDate prop changes
	useEffect(() => {
		if (initialDate) {
			try {
				const parsedDate = parse(initialDate, 'yyyy-MM-dd', new Date());
				setCurrentDate(parsedDate);
			} catch (error) {
				console.error('Failed to parse initialDate:', error);
			}
		}
	}, [initialDate]);

	// Memoize the getDaysForMonth calculation to avoid recalculating on every render
	const allDaysWithWeeks = useMemo(() => {
		// Generate all days in the current month
		const firstDay = startOfMonth(currentDate);
		const lastDay = endOfMonth(currentDate);
		const daysInMonth = eachDayOfInterval({
			start: firstDay,
			end: lastDay,
		});

		// Get day of week for the first day (0 = Sunday, 1 = Monday, etc.)
		const startDayOfWeek = firstDay.getDay();

		// Create placeholder days for leading empty cells
		const leadingDays = Array.from({ length: startDayOfWeek }, (_, i) => {
			const date = new Date(firstDay);
			date.setDate(date.getDate() - (startDayOfWeek - i));
			return date;
		});

		// Create placeholder days for trailing empty cells
		const totalCells =
			Math.ceil((leadingDays.length + daysInMonth.length) / 7) * 7;
		const trailingDays = Array.from(
			{ length: totalCells - (leadingDays.length + daysInMonth.length) },
			(_, i) => {
				const date = new Date(lastDay);
				date.setDate(date.getDate() + i + 1);
				return date;
			}
		);

		// All days to display in the calendar grid
		const allDays = [...leadingDays, ...daysInMonth, ...trailingDays];

		// Group days into weeks
		const weeks = [];
		for (let i = 0; i < allDays.length; i += 7) {
			weeks.push(allDays.slice(i, i + 7));
		}

		return { weeks, allDays };
	}, [currentDate]);

	const { weeks } = allDaysWithWeeks;

	const handlePrevMonth = () => {
		setCurrentDate(subMonths(currentDate, 1));
	};

	const handleNextMonth = () => {
		setCurrentDate(addMonths(currentDate, 1));
	};

	const handleAddTaskClick = (dateStr: string) => {
		setShowAddTask((prev) => ({
			...prev,
			[dateStr]: true,
		}));
	};

	const handleTaskSubmit = (dateStr: string) => {
		if (newTaskText[dateStr]?.trim()) {
			// Default to primary task type for new tasks in monthly view
			addTask(dateStr, newTaskText[dateStr], 'primary');
			setNewTaskText((prev) => ({
				...prev,
				[dateStr]: '',
			}));
		}
		setShowAddTask((prev) => ({
			...prev,
			[dateStr]: false,
		}));
	};

	const getTasksForDate = (dateStr: string): Task[] => {
		return tasks[dateStr] || [];
	};

	const handleDragEnd = (result: DropResult) => {
		const { destination, source, draggableId } = result;

		// If there's no destination, or if the task is dropped in the same place, do nothing
		if (
			!destination ||
			(destination.droppableId === source.droppableId &&
				destination.index === source.index)
		) {
			return;
		}

		// Get the source date for logging
		const sourceDate = source.droppableId;

		// Move the task to the new date at the specified index
		moveTask(draggableId, destination.droppableId, destination.index);

		// Log task movement for debugging
		console.log(
			`Moved task from ${sourceDate} to ${destination.droppableId}`
		);
	};

	// Get the month name from the current date
	const monthName = useMemo(() => {
		return format(currentDate, 'MMM');
	}, [currentDate]);

	// Get month colors from ColorContext
	const [dayColors, setDayColors] = useState<Record<number, string>>({});

	// Load colors for the current month
	useEffect(() => {
		const savedColors = getDayColorsForMonth(monthName);
		console.log(`Loading saved colors for ${monthName}:`, savedColors);
		setDayColors(savedColors);
	}, [monthName, getDayColorsForMonth]);

	// Function to get color for a specific day
	const getDayColor = (day: Date) => {
		const dayOfMonth = day.getDate();
		const isCurrentMonthDay = isSameMonth(day, currentDate);

		if (!isCurrentMonthDay) return null;

		return dayColors[dayOfMonth] || null;
	};

	return (
		<div className='w-full'>
			<div className='flex justify-between items-center mb-4'>
				<h2 className='text-xl font-bold'>
					{format(currentDate, 'MMMM yyyy')}
				</h2>
				<div className='flex gap-2'>
					<Button
						variant='outline'
						size='sm'
						onClick={handlePrevMonth}
					>
						<ChevronLeft className='h-4 w-4' />
					</Button>
					<Button
						variant='outline'
						size='sm'
						onClick={() => setCurrentDate(new Date('2025-05-01'))}
					>
						Today
					</Button>
					<Button
						variant='outline'
						size='sm'
						onClick={handleNextMonth}
					>
						<ChevronRight className='h-4 w-4' />
					</Button>
				</div>
			</div>

			<div className='rounded-lg shadow-sm border overflow-hidden'>
				<div className='grid grid-cols-7 gap-0 border-l overflow-hidden'>
					{/* Header row with day names */}
					{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
						(day) => (
							<div
								key={day}
								className='p-2 text-center font-medium border-b'
							>
								{day}
							</div>
						)
					)}

					{/* Calendar grid */}
					<DragDropContext
						onDragEnd={handleDragEnd}
						enableDefaultSensors={true}
					>
						{weeks.map((week, weekIndex) => (
							<React.Fragment key={`week-${weekIndex}`}>
								{week.map((day, dayIndex) => {
									const dateStr = format(day, 'yyyy-MM-dd');
									const isCurrentMonth = isSameMonth(
										day,
										currentDate
									);
									const dayTasks = getTasksForDate(dateStr);
									const isDayHovered = hoveredDay === dateStr;
									const dayColor = getDayColor(day);

									return (
										<div
											key={`${weekIndex}-${dayIndex}`}
											className={cn(
												'border-r border-b p-1 min-h-[150px] h-auto flex flex-col',
												isCurrentMonth
													? 'bg-white'
													: 'bg-gray-50',
												// Add darker gray background for weekends (Sunday = 0, Saturday = 6)
												(day.getDay() === 0 ||
													day.getDay() === 6) &&
													'bg-gray-100'
											)}
											style={
												dayColor
													? {
															borderTop: `4px solid ${dayColor}`,
															borderTopLeftRadius:
																dayIndex === 0
																	? '4px'
																	: '0',
															borderTopRightRadius:
																dayIndex === 6
																	? '4px'
																	: '0',
													  }
													: {}
											}
											onMouseEnter={() =>
												setHoveredDay(dateStr)
											}
											onMouseLeave={() =>
												setHoveredDay(null)
											}
										>
											<div className='flex justify-between items-center mb-1'>
												<span
													className={cn(
														'inline-flex h-6 w-6 items-center justify-center rounded-full text-sm',
														!isCurrentMonth &&
															'text-gray-400',
														isCurrentMonth &&
															format(
																day,
																'yyyy-MM-dd'
															) ===
																format(
																	new Date(),
																	'yyyy-MM-dd'
																) &&
															'bg-blue-600 text-white font-medium'
													)}
												>
													{format(day, 'd')}
												</span>

												{isCurrentMonth &&
													isDayHovered && (
														<button
															className='bg-white hover:bg-gray-100 rounded-md p-1 shadow-sm text-gray-600 hover:text-gray-800 transition-all duration-150 flex items-center justify-center hover:cursor-pointer'
															onClick={() =>
																handleAddTaskClick(
																	dateStr
																)
															}
														>
															<Plus className='h-4 w-4' />
														</button>
													)}
											</div>

											{/* Task list */}
											<Droppable
												droppableId={dateStr}
												renderClone={(
													provided,
													snapshot,
													rubric
												) => (
													<div
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
														style={{
															...provided
																.draggableProps
																.style,
															opacity: 0.8,
															transition:
																'transform 0.05s',
														}}
													>
														<TaskItem
															task={
																dayTasks[
																	rubric
																		.source
																		.index
																]
															}
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
												)}
											>
												{(provided, snapshot) => (
													<div
														ref={provided.innerRef}
														{...provided.droppableProps}
														className={cn(
															'space-y-1 flex-grow flex flex-col',
															snapshot.isDraggingOver &&
																'rounded'
														)}
														style={{
															minHeight: '100%',
														}}
													>
														{dayTasks.map(
															(task, index) => (
																<Draggable
																	key={
																		task.id
																	}
																	draggableId={
																		task.id
																	}
																	index={
																		index
																	}
																>
																	{(
																		provided,
																		snapshot
																	) => (
																		<div
																			ref={
																				provided.innerRef
																			}
																			{...provided.draggableProps}
																			{...provided.dragHandleProps}
																			className={`relative ${
																				snapshot.isDragging
																					? 'opacity-70'
																					: ''
																			}`}
																			style={getItemStyle(
																				snapshot.isDragging,
																				provided
																					.draggableProps
																					.style
																			)}
																		>
																			{task.taskType ===
																				'power' && (
																				<div className='absolute top-1 right-2 text-yellow-500 z-10'>
																					<Zap
																						size={
																							14
																						}
																					/>
																				</div>
																			)}
																			<TaskItem
																				task={
																					task
																				}
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
																	)}
																</Draggable>
															)
														)}
														{provided.placeholder}

														{showAddTask[
															dateStr
														] && (
															<div className='mt-1'>
																<Input
																	customSize='sm'
																	placeholder='New task...'
																	value={
																		newTaskText[
																			dateStr
																		] || ''
																	}
																	onChange={(
																		e
																	) =>
																		setNewTaskText(
																			(
																				prev
																			) => ({
																				...prev,
																				[dateStr]:
																					e
																						.target
																						.value,
																			})
																		)
																	}
																	onKeyDown={(
																		e
																	) => {
																		if (
																			e.key ===
																			'Enter'
																		) {
																			handleTaskSubmit(
																				dateStr
																			);
																		}
																	}}
																	autoFocus
																	className='text-xs py-1'
																/>
																<div className='flex gap-1 mt-1'>
																	<Button
																		size='sm'
																		className='h-6 text-xs py-0'
																		onClick={() =>
																			handleTaskSubmit(
																				dateStr
																			)
																		}
																	>
																		Add
																	</Button>
																	<Button
																		variant='ghost'
																		size='sm'
																		className='h-6 text-xs py-0'
																		onClick={() =>
																			setShowAddTask(
																				(
																					prev
																				) => ({
																					...prev,
																					[dateStr]:
																						false,
																				})
																			)
																		}
																	>
																		Cancel
																	</Button>
																</div>
															</div>
														)}
													</div>
												)}
											</Droppable>
										</div>
									);
								})}
							</React.Fragment>
						))}
					</DragDropContext>
				</div>
			</div>
		</div>
	);
}
