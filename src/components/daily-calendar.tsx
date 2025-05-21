'use client';

import { useState, useEffect } from 'react';
import {
	format,
	startOfMonth,
	endOfMonth,
	isToday,
	isSameDay,
	addMonths,
	subMonths,
} from 'date-fns';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { useTasks } from '@/contexts/TasksContext';

interface DailyCalendarProps {
	selectedDate: Date;
	onDateSelect: (date: Date) => void;
}

export function DailyCalendar({
	selectedDate,
	onDateSelect,
}: DailyCalendarProps) {
	const [calendarDate, setCalendarDate] = useState(
		startOfMonth(selectedDate)
	);
	const { tasks } = useTasks();

	// Update calendar only when selected date changes - NOT when calendarDate changes
	useEffect(() => {
		// This effect only runs when selectedDate changes from parent component
		// but NOT when we navigate with prev/next buttons
		setCalendarDate(startOfMonth(selectedDate));
	}, [selectedDate]); // Remove calendarDate dependency

	const handlePrevMonth = () => {
		setCalendarDate(subMonths(calendarDate, 1));
	};

	const handleNextMonth = () => {
		setCalendarDate(addMonths(calendarDate, 1));
	};

	const handleToday = () => {
		const today = new Date();
		setCalendarDate(startOfMonth(today));
		onDateSelect(today);
	};

	// Generate calendar days
	const generateCalendarDays = () => {
		const firstDay = startOfMonth(calendarDate);
		const lastDay = endOfMonth(calendarDate);
		const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

		// Create an array for all days in the month
		const daysInMonth = Array.from(
			{ length: lastDay.getDate() },
			(_, i) =>
				new Date(firstDay.getFullYear(), firstDay.getMonth(), i + 1)
		);

		// Add empty spaces for days before the first day of the month
		const leadingSpaces = Array.from(
			{ length: startingDayOfWeek },
			() => null
		);

		return [...leadingSpaces, ...daysInMonth];
	};

	const calendarDays = generateCalendarDays();
	const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	// Check if a date has tasks
	const hasTasksForDate = (date: Date) => {
		if (!date) return false;
		const dateString = format(date, 'yyyy-MM-dd');
		return tasks[dateString] && tasks[dateString].length > 0;
	};

	return (
		<div className='rounded-lg border bg-card p-4'>
			<div className='flex items-center justify-between mb-4'>
				<h3 className='font-medium'>
					{format(calendarDate, 'MMMM yyyy')}
				</h3>
				<div className='flex items-center space-x-1'>
					<Button
						variant='ghost'
						size='sm'
						className='h-7 w-7 p-0'
						onClick={handlePrevMonth}
						title='Previous month'
					>
						<ChevronLeft className='h-4 w-4' />
						<span className='sr-only'>Previous month</span>
					</Button>
					<Button
						variant='ghost'
						size='sm'
						className='h-7 p-0 px-2'
						onClick={handleToday}
						title='Go to today'
					>
						<Calendar className='h-4 w-4 mr-1' />
						<span className='text-xs'>Today</span>
					</Button>
					<Button
						variant='ghost'
						size='sm'
						className='h-7 w-7 p-0'
						onClick={handleNextMonth}
						title='Next month'
					>
						<ChevronRight className='h-4 w-4' />
						<span className='sr-only'>Next month</span>
					</Button>
				</div>
			</div>

			<div className='grid grid-cols-7 gap-1 text-center'>
				{/* Weekday headers */}
				{weekdays.map((day) => (
					<div
						key={day}
						className='text-xs font-medium text-gray-500 py-1'
					>
						{day}
					</div>
				))}

				{/* Calendar days */}
				{calendarDays.map((day, index) => {
					if (!day) {
						// Empty cells for days before the first of the month
						return <div key={`empty-${index}`} className='h-8' />;
					}

					const isCurrentDay = isToday(day);
					const isSelected = isSameDay(day, selectedDate);
					const hasTasks = hasTasksForDate(day);

					return (
						<button
							key={day.toString()}
							className={cn(
								'h-8 w-full flex items-center justify-center rounded-full text-sm relative',
								isCurrentDay &&
									!isSelected &&
									'bg-blue-50 text-blue-600',
								isSelected &&
									'bg-blue-600 text-white font-medium',
								!isCurrentDay &&
									!isSelected &&
									'hover:bg-gray-100'
							)}
							onClick={() => onDateSelect(day)}
						>
							{format(day, 'd')}
							{hasTasks && !isSelected && (
								<div className='absolute bottom-1 w-1 h-1 rounded-full bg-blue-600' />
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
}
