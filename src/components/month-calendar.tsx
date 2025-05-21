'use client';

import { useState, useEffect, useCallback, forwardRef, Ref } from 'react';
import { cn } from '@/lib/utils';
import { useColors } from '@/contexts/ColorContext';

type MonthCalendarProps = {
	month: string;
	days: {
		day: number;
		isCurrentMonth: boolean;
	}[];
	onSelectDays?: (days: number[]) => void;
	applyColor?: string | null;
	clearApplyColor?: () => void;
};

export const MonthCalendar = forwardRef(function MonthCalendar(
	{
		month,
		days,
		onSelectDays,
		applyColor = null,
		clearApplyColor,
	}: MonthCalendarProps,
	ref: Ref<HTMLDivElement>
) {
	const dayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
	const [selectedDays, setSelectedDays] = useState<number[]>([]);
	const [shiftKeyPressed, setShiftKeyPressed] = useState(false);
	const [lastSelectedDay, setLastSelectedDay] = useState<number | null>(null);
	const [dayColors, setDayColors] = useState<Record<number, string>>({});
	const { applyColorToMonth, updateDayColors, getDayColorsForMonth } =
		useColors();

	// Get current date information for highlighting current day and crossing out past days
	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();
	const currentMonthIndex = currentDate.getMonth();
	const currentMonthName = new Intl.DateTimeFormat('en-US', {
		month: 'short',
	}).format(currentDate);
	const currentDay = currentDate.getDate();
	const isCurrentMonth = currentMonthName === month;
	const monthIndex = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	].indexOf(month);

	// Get the calendar year (default to 2025 from the macro page)
	const calendarYear = 2025;

	// Load persisted colors for this month on component mount
	useEffect(() => {
		const savedColors = getDayColorsForMonth(month);
		if (savedColors && Object.keys(savedColors).length > 0) {
			console.log(`Loading saved colors for ${month}:`, savedColors);
			setDayColors(savedColors);
		}
	}, [month, getDayColorsForMonth]);

	// Monitor shift key press
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Shift') setShiftKeyPressed(true);
		};
		const handleKeyUp = (e: KeyboardEvent) => {
			if (e.key === 'Shift') setShiftKeyPressed(false);
		};
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, []);

	// Notify parent component when selected days change
	useEffect(() => {
		if (onSelectDays) onSelectDays(selectedDays);
	}, [selectedDays, onSelectDays]);

	// Apply color to selected days when applyColor changes
	useEffect(() => {
		if (
			applyColor &&
			applyColorToMonth === month &&
			selectedDays.length > 0
		) {
			const newDayColors = { ...dayColors };
			selectedDays.forEach((day) => {
				newDayColors[day] = applyColor;
			});

			// Update local state
			setDayColors(newDayColors);
			console.log(`Saving colors for ${month}:`, newDayColors);

			// Persist the updated colors
			updateDayColors(month, newDayColors);

			setSelectedDays([]);
			if (clearApplyColor) clearApplyColor();
		}
		// Only run when applyColor changes
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [applyColor, applyColorToMonth, month]);

	const handleDayClick = useCallback(
		(day: number) => {
			if (!day) return;
			if (shiftKeyPressed && lastSelectedDay !== null) {
				const start = Math.min(lastSelectedDay, day);
				const end = Math.max(lastSelectedDay, day);
				const newRange = Array.from(
					{ length: end - start + 1 },
					(_, i) => start + i
				);
				setSelectedDays((prev) => {
					const updated = [...prev];
					newRange.forEach((d) => {
						if (!updated.includes(d)) updated.push(d);
					});
					return updated;
				});
			} else {
				if (selectedDays.includes(day)) {
					setSelectedDays(selectedDays.filter((d) => d !== day));
				} else {
					setSelectedDays(
						shiftKeyPressed ? [...selectedDays, day] : [day]
					);
				}
				setLastSelectedDay(day);
			}
		},
		[shiftKeyPressed, lastSelectedDay, selectedDays]
	);

	// Function to check if a day has passed
	const isDayPassed = (day: number) => {
		// Compare current date with the calendar date
		if (currentYear > calendarYear) {
			return true; // All days passed if current year is after calendar year
		} else if (currentYear === calendarYear) {
			// Check month and day
			if (monthIndex < currentMonthIndex) {
				return true; // Past month in current year
			} else if (monthIndex === currentMonthIndex && day < currentDay) {
				return true; // Past day in current month
			}
		}
		// Current year is before calendar year or today/future date
		return false;
	};

	// Function to check if day is the current day
	const isToday = (day: number) => {
		return (
			currentYear === calendarYear && isCurrentMonth && day === currentDay
		);
	};

	const getDayColorStyle = (day: number) => {
		if (!day) return {};
		const color = dayColors[day];
		if (!color) return {};

		// Check if day has passed, apply reduced opacity
		if (isDayPassed(day) && !isToday(day)) {
			return {
				backgroundColor: color,
				color: 'white',
				opacity: 0.5,
			};
		}

		return { backgroundColor: color, color: 'white' };
	};

	return (
		<div className='w-full' ref={ref}>
			<div className='mb-2 text-center font-medium'>{month}</div>
			<div className='grid grid-cols-7 gap-1'>
				{dayHeaders.map((day, i) => (
					<div
						key={i}
						className='text-center text-xs text-gray-500 select-none'
					>
						{day}
					</div>
				))}
				{days.map((day, i) => {
					return (
						<div
							key={i}
							onClick={() =>
								day.isCurrentMonth && handleDayClick(day.day)
							}
							style={
								day.isCurrentMonth
									? getDayColorStyle(day.day)
									: {}
							}
							className={cn(
								'flex h-8 w-full cursor-pointer items-center justify-center rounded text-sm transition-colors select-none',
								day.isCurrentMonth
									? 'hover:bg-gray-100'
									: 'text-gray-400 cursor-default',
								selectedDays.includes(day.day) &&
									day.isCurrentMonth &&
									'bg-blue-100 hover:bg-blue-200',
								dayColors[day.day] && 'hover:opacity-90',
								isDayPassed(day.day) &&
									!isToday(day.day) &&
									'line-through text-gray-400'
							)}
						>
							{day.day || ''}
						</div>
					);
				})}
			</div>
		</div>
	);
});
