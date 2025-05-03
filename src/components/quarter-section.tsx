'use client';

import { useState, useEffect } from 'react';
import { MonthCalendar } from './month-calendar';
import { Button } from './ui/button';
import { useColors } from '@/contexts/ColorContext';
import { useGoals } from '@/contexts/GoalsContext';
import { GoalList } from './goal-list';
import { AddGoal } from './add-goal';
import { DropResult } from '@hello-pangea/dnd';

interface QuarterSectionProps {
	quarter: string;
	months: string[];
	id: string;
}

export function QuarterSection({ quarter, months, id }: QuarterSectionProps) {
	const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
	const [selectedDaysByMonth, setSelectedDaysByMonth] = useState<
		Record<string, number[]>
	>({});
	const { activeColor, setApplyColorToMonth, resetActiveColor } = useColors();
	const { goals, addGoal, updateGoalOrder, updateGoalCompletion } =
		useGoals();

	const quarterGoals = goals[id] || [];

	const generateDays = (totalDays: number) => {
		return Array.from({ length: totalDays }, (_, i) => ({
			day: i + 1,
			isCurrentMonth: true,
		}));
	};

	const monthDays = {
		Jan: generateDays(31),
		Feb: generateDays(28),
		Mar: generateDays(31),
		Apr: generateDays(30),
		May: generateDays(31),
		Jun: generateDays(30),
		Jul: generateDays(31),
		Aug: generateDays(31),
		Sep: generateDays(30),
		Oct: generateDays(31),
		Nov: generateDays(30),
		Dec: generateDays(31),
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

	const totalSelectedDays = Object.values(selectedDaysByMonth).reduce(
		(sum, days) => sum + days.length,
		0
	);

	const handleDragEnd = (result: DropResult) => {
		if (!result.destination) return;

		const items = Array.from(quarterGoals);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		updateGoalOrder(id, items);
	};

	return (
		<div className='mb-8'>
			<div className='mb-4 rounded-md bg-[#0a101e] p-2 text-white flex justify-between items-center'>
				<h2 className='font-medium'>{quarter}</h2>
				{totalSelectedDays > 0 && (
					<span className='text-sm bg-blue-500 px-2 py-1 rounded-full'>
						{totalSelectedDays} day
						{totalSelectedDays !== 1 ? 's' : ''} selected
					</span>
				)}
			</div>

			<div className='grid grid-cols-12 gap-4'>
				{/* Goals column */}
				<div className='col-span-2'>
					<h3 className='text-sm font-medium mb-3'>Goals</h3>
					<GoalList
						goals={quarterGoals}
						quarterId={id}
						onDragEnd={handleDragEnd}
						onCompleteChange={(goalId, completed) =>
							updateGoalCompletion(id, goalId, completed)
						}
					/>
					<AddGoal onAddGoal={(title) => addGoal(id, title)} />
				</div>

				{/* Months columns */}
				<div className='col-span-10 grid grid-cols-3 gap-4'>
					{months.map((month) => (
						<div key={month} className='rounded border p-2'>
							<MonthCalendar
								month={month}
								days={
									monthDays[month as keyof typeof monthDays]
								}
								onSelectDays={(days) =>
									handleDaySelection(month, days)
								}
								applyColor={activeColor}
								clearApplyColor={handleClearApplyColor}
							/>
							<div className='mt-2 text-center flex justify-between items-center'>
								<span className='text-xs text-gray-500'>
									{selectedDaysByMonth[month]?.length || 0}{' '}
									selected
								</span>
								<Button
									variant='outline'
									size='sm'
									onClick={() =>
										setExpandedMonth(
											expandedMonth === month
												? null
												: month
										)
									}
									className='text-xs'
								>
									{expandedMonth === month ? 'Close' : 'View'}
								</Button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
