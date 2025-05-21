'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { SidebarNav } from '@/components/sidebar-nav';
import { DailyTaskList } from '@/components/daily-task-list';
import { DailyCalendar } from '@/components/daily-calendar';
import { Separator } from '@/components/ui/separator';
import { useTasks } from '@/contexts/TasksContext';
import { useColors } from '@/contexts/ColorContext';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';

function DailyPageContent() {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const { updateTaskType, hasDatePowerTask, reorderTasks } = useTasks();
	const { getDayColorsForMonth, colors } = useColors();

	// Get the day's color from ColorContext
	const getDateColor = () => {
		const monthName = format(selectedDate, 'MMM');
		const dayOfMonth = selectedDate.getDate();

		const monthColors = getDayColorsForMonth(monthName);
		const dayColor = monthColors[dayOfMonth];

		if (!dayColor) return null;

		// Find the color name
		const colorObject = colors.find((c) => c.color === dayColor);
		return {
			color: dayColor,
			name: colorObject?.name || 'Custom Color',
		};
	};

	const dayColorInfo = getDateColor();

	const handleDragEnd = (result: DropResult) => {
		const { source, destination, draggableId } = result;
		const dateStr = format(selectedDate, 'yyyy-MM-dd');

		// If dropped outside a droppable area or in the same list at the same position
		if (!destination) {
			return;
		}

		// No movement
		if (
			source.droppableId === destination.droppableId &&
			source.index === destination.index
		) {
			return;
		}

		// Handle reordering within the same list
		if (source.droppableId === destination.droppableId) {
			// Call reorderTasks to maintain the order
			reorderTasks(dateStr, source.index, destination.index);
			return;
		}

		// Handle moving between power and primary lists
		if (source.droppableId !== destination.droppableId) {
			const newType =
				destination.droppableId === 'power-tasks' ? 'power' : 'primary';

			// When moving to power task list, check if there's already a power task
			if (newType === 'power') {
				// If there's already a power task for this date, don't allow the move
				if (hasDatePowerTask(dateStr)) {
					console.log("Can't add more than one power task");
					return;
				}
			}

			// Update task type and maintain its position
			updateTaskType(draggableId, newType);
		}
	};

	const formattedDate = format(selectedDate, 'EEEE, MMMM d, yyyy');

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<div className='w-full h-screen flex'>
				{/* Sidebar - fixed width */}
				<div className='w-[200px] min-w-[200px] h-full'>
					<SidebarNav />
				</div>

				{/* Main content - flexible width */}
				<div className='flex-grow h-full overflow-auto bg-white p-6'>
					<div className='flex justify-between items-center mb-6'>
						<h1 className='text-2xl font-bold'>Daily Planner</h1>
					</div>

					<div className='flex items-center mb-6'>
						<h2 className='text-xl'>{formattedDate}</h2>
					</div>

					<div className='grid grid-cols-3 gap-6'>
						{/* Tasks section - 2/3 width */}
						<div className='col-span-2 space-y-6'>
							<div>
								<DailyTaskList
									selectedDate={selectedDate}
									isPowerTask={true}
									droppableId='power-tasks'
								/>
							</div>

							<Separator />

							<div>
								<DailyTaskList
									selectedDate={selectedDate}
									isPowerTask={false}
									droppableId='primary-tasks'
								/>
							</div>
						</div>

						{/* Calendar section - 1/3 width */}
						<div className='col-span-1'>
							<div className='rounded-lg bg-gray-50 p-4'>
								<div className='flex justify-between items-center mb-4'>
									<h3 className='text-base font-medium'>
										Macro Focus
									</h3>
									<button className='text-gray-400 hover:text-gray-600'>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											className='h-5 w-5'
											viewBox='0 0 24 24'
											fill='none'
											stroke='currentColor'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'
										>
											<circle
												cx='12'
												cy='12'
												r='1'
											></circle>
											<circle
												cx='19'
												cy='12'
												r='1'
											></circle>
											<circle
												cx='5'
												cy='12'
												r='1'
											></circle>
										</svg>
									</button>
								</div>
								{dayColorInfo ? (
									<div className='flex items-center'>
										<div
											className='w-8 h-8 rounded-md mr-3'
											style={{
												backgroundColor:
													dayColorInfo.color,
											}}
										></div>
										<div>
											<p className='font-medium'>
												{dayColorInfo.name}
											</p>
											<p className='text-gray-500 text-sm'>
												This day is marked in your macro
												plan
											</p>
										</div>
									</div>
								) : (
									<p className='text-gray-500 text-sm'>
										No macro color assigned to this day.
										<a
											href='/macro'
											className='text-blue-500 ml-1'
										>
											Set one
										</a>
										.
									</p>
								)}
							</div>

							<div className='mt-6'>
								<DailyCalendar
									selectedDate={selectedDate}
									onDateSelect={setSelectedDate}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</DragDropContext>
	);
}

export default function DailyPage() {
	return <DailyPageContent />;
}
