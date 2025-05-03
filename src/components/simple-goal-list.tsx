'use client';

import { useState } from 'react';
import { Goal, GoalItem } from './goal-item';
import { Button } from './ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface SimpleGoalListProps {
	goals: Goal[];
	quarterId: string;
	onReorder: (reorderedGoals: Goal[]) => void;
	onCompleteChange: (goalId: string, completed: boolean) => void;
}

export function SimpleGoalList({
	goals,
	quarterId,
	onReorder,
	onCompleteChange,
}: SimpleGoalListProps) {
	const moveGoal = (index: number, direction: 'up' | 'down') => {
		if (
			(direction === 'up' && index === 0) ||
			(direction === 'down' && index === goals.length - 1)
		) {
			return; // Can't move outside boundaries
		}

		const newGoals = [...goals];
		const targetIndex = direction === 'up' ? index - 1 : index + 1;

		// Swap the goals
		[newGoals[index], newGoals[targetIndex]] = [
			newGoals[targetIndex],
			newGoals[index],
		];

		onReorder(newGoals);
	};

	return (
		<div className='mb-2 space-y-1'>
			{goals.map((goal, index) => (
				<div
					key={goal.id}
					className='group flex items-center border border-transparent hover:border-gray-200 rounded-md'
				>
					<div className='flex-grow'>
						<GoalItem
							goal={goal}
							onCompleteChange={onCompleteChange}
							dragHandleProps={{}} // Empty dragHandleProps since we're not using drag-and-drop
						/>
					</div>

					<div className='flex flex-col opacity-0 group-hover:opacity-100 transition-opacity'>
						<Button
							variant='ghost'
							size='sm'
							className='h-6 w-6 p-0 rounded-full'
							onClick={() => moveGoal(index, 'up')}
							disabled={index === 0}
						>
							<ArrowUp size={14} />
							<span className='sr-only'>Move up</span>
						</Button>

						<Button
							variant='ghost'
							size='sm'
							className='h-6 w-6 p-0 rounded-full'
							onClick={() => moveGoal(index, 'down')}
							disabled={index === goals.length - 1}
						>
							<ArrowDown size={14} />
							<span className='sr-only'>Move down</span>
						</Button>
					</div>
				</div>
			))}
		</div>
	);
}
