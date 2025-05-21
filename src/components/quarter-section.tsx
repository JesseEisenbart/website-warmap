'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MonthCalendar } from './month-calendar';
import { Button } from './ui/button';
import { useColors } from '@/contexts/ColorContext';
import { useGoals } from '@/contexts/GoalsContext';
import { GoalList } from './goal-list';
import { AddGoal } from './add-goal';
import { DropResult } from '@hello-pangea/dnd';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Textarea } from './ui/textarea';

interface QuarterSectionProps {
	quarter: string;
	months: string[];
	id: string;
}

export function QuarterSection({ quarter, months, id }: QuarterSectionProps) {
	const router = useRouter();
	const [selectedDaysByMonth, setSelectedDaysByMonth] = useState<
		Record<string, number[]>
	>({});
	const { activeColor, setApplyColorToMonth, resetActiveColor } = useColors();
	const {
		goals,
		addGoal,
		removeGoal,
		updateGoalOrder,
		updateGoalCompletion,
	} = useGoals();
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [notes, setNotes] = useState<string>('');

	const quarterGoals = goals[id] || [];

	// Month name to month number mapping (0-based)
	const monthToNumberMap: Record<string, number> = {
		Jan: 0,
		Feb: 1,
		Mar: 2,
		Apr: 3,
		May: 4,
		Jun: 5,
		Jul: 6,
		Aug: 7,
		Sep: 8,
		Oct: 9,
		Nov: 10,
		Dec: 11,
	};

	const generateDays = (totalDays: number, monthName: string) => {
		// Create a date for the first day of the month in 2025
		const firstDayOfMonth = new Date(2025, monthToNumberMap[monthName], 1);

		// Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
		const startDayOfWeek = firstDayOfMonth.getDay();

		// Create placeholder days for leading empty cells (previous month days)
		const leadingEmptyDays = Array.from({ length: startDayOfWeek }, () => ({
			day: 0,
			isCurrentMonth: false,
		}));

		// Create days for the current month
		const monthDays = Array.from({ length: totalDays }, (_, i) => ({
			day: i + 1,
			isCurrentMonth: true,
		}));

		// Calculate how many trailing days we need to complete the grid
		const totalCells =
			Math.ceil((leadingEmptyDays.length + monthDays.length) / 7) * 7;
		const trailingEmptyDays = Array.from(
			{
				length:
					totalCells - (leadingEmptyDays.length + monthDays.length),
			},
			() => ({
				day: 0,
				isCurrentMonth: false,
			})
		);

		// Combine all days to create the complete grid
		return [...leadingEmptyDays, ...monthDays, ...trailingEmptyDays];
	};

	const monthDays = {
		Jan: generateDays(31, 'Jan'),
		Feb: generateDays(28, 'Feb'),
		Mar: generateDays(31, 'Mar'),
		Apr: generateDays(30, 'Apr'),
		May: generateDays(31, 'May'),
		Jun: generateDays(30, 'Jun'),
		Jul: generateDays(31, 'Jul'),
		Aug: generateDays(31, 'Aug'),
		Sep: generateDays(30, 'Sep'),
		Oct: generateDays(31, 'Oct'),
		Nov: generateDays(30, 'Nov'),
		Dec: generateDays(31, 'Dec'),
	};

	useEffect(() => {
		if (activeColor) {
			const monthWithSelection = months.find(
				(m) => (selectedDaysByMonth[m]?.length || 0) > 0
			);
			if (monthWithSelection) {
				setApplyColorToMonth(monthWithSelection);
			}
		}
	}, [activeColor, months, selectedDaysByMonth, setApplyColorToMonth]);

	const handleDaySelection = (month: string, selectedDays: number[]) => {
		const currentDays = selectedDaysByMonth[month] || [];
		const areDifferent =
			currentDays.length !== selectedDays.length ||
			selectedDays.some((day, i) => currentDays[i] !== day);

		if (areDifferent) {
			setSelectedDaysByMonth((prev) => ({
				...prev,
				[month]: selectedDays,
			}));
		}
	};

	const handleClearApplyColor = () => {
		setApplyColorToMonth(null);
		resetActiveColor();
	};

	const handleDragEnd = (result: DropResult) => {
		if (!result.destination) return;

		const items = Array.from(quarterGoals);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		updateGoalOrder(id, items);
	};

	// Navigate to monthly view for the selected month
	const navigateToMonth = (month: string) => {
		// Default year is 2025 based on the macro page heading
		const year = 2025;
		const monthIndex = monthToNumberMap[month];

		if (monthIndex !== undefined) {
			// Create a date string in format YYYY-MM-DD (first day of month)
			const dateString = `${year}-${String(monthIndex + 1).padStart(
				2,
				'0'
			)}-01`;

			// Navigate to monthly page
			router.push(`/monthly?date=${dateString}`);
		}
	};

	const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setNotes(e.target.value);
	};

	return (
		<div className='mb-8'>
			<div className='mb-4 rounded-md bg-[#0a101e] p-2 text-white flex justify-between items-center'>
				<h2 className='font-medium'>{quarter}</h2>
				<Button
					variant='ghost'
					size='sm'
					className='text-white hover:bg-gray-800 h-7 w-7 p-0 cursor-pointer'
					onClick={() => setIsCollapsed(!isCollapsed)}
				>
					{isCollapsed ? (
						<ChevronDown className='h-5 w-5' />
					) : (
						<ChevronUp className='h-5 w-5' />
					)}
				</Button>
			</div>

			{!isCollapsed && (
				<div className='flex flex-col gap-6'>
					{/* Months columns - now full width */}
					<div className='grid grid-cols-3 gap-4 w-full'>
						{months.map((month) => (
							<div
								key={month}
								className='rounded border p-2 flex flex-col h-full'
							>
								<MonthCalendar
									month={month}
									days={
										monthDays[
											month as keyof typeof monthDays
										]
									}
									onSelectDays={(days) =>
										handleDaySelection(month, days)
									}
									applyColor={activeColor}
									clearApplyColor={handleClearApplyColor}
								/>
								<div className='mt-auto pt-2'>
									<Button
										variant='outline'
										size='sm'
										onClick={() => navigateToMonth(month)}
										className='text-xs cursor-pointer w-full'
									>
										View Month
									</Button>
								</div>
							</div>
						))}
					</div>

					{/* Goals and Notes section - in a two column layout */}
					<div className='grid grid-cols-2 gap-4 w-full'>
						{/* Goals column */}
						<div>
							<h3 className='text-sm font-medium mb-3'>Goals</h3>
							<GoalList
								goals={quarterGoals}
								quarterId={id}
								onDragEnd={handleDragEnd}
								onCompleteChange={(goalId, completed) =>
									updateGoalCompletion(id, goalId, completed)
								}
								onDelete={(goalId) => removeGoal(id, goalId)}
								hideActions={true}
							/>
							<AddGoal
								onAddGoal={(title) => addGoal(id, title)}
							/>
						</div>

						{/* Notes column */}
						<div>
							<h3 className='text-sm font-medium mb-3'>Notes</h3>

							<Textarea
								placeholder='Add notes for this quarter...'
								className='min-h-[120px] bg-white resize-none'
								value={notes}
								onChange={handleNotesChange}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
