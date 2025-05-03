'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { PlusCircle } from 'lucide-react';
import { Input } from './ui/input';

interface AddGoalProps {
	onAddGoal: (title: string) => void;
}

export function AddGoal({ onAddGoal }: AddGoalProps) {
	const [isAdding, setIsAdding] = useState(false);
	const [newGoalTitle, setNewGoalTitle] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (newGoalTitle.trim()) {
			onAddGoal(newGoalTitle.trim());
			setNewGoalTitle('');
			setIsAdding(false);
		}
	};

	if (!isAdding) {
		return (
			<Button
				variant='ghost'
				size='sm'
				className='flex items-center text-gray-500 hover:text-gray-700 w-full justify-start pl-2 mb-2'
				onClick={() => setIsAdding(true)}
			>
				<PlusCircle size={16} className='mr-2' />
				<span className='text-sm'>Add goal</span>
			</Button>
		);
	}

	return (
		<form onSubmit={handleSubmit} className='mb-2'>
			<div className='flex items-center gap-2 mb-2'>
				<Input
					type='text'
					placeholder='Enter goal title...'
					value={newGoalTitle}
					onChange={(e) => setNewGoalTitle(e.target.value)}
					autoFocus
					className='text-sm'
				/>
			</div>
			<div className='flex items-center gap-2'>
				<Button type='submit' size='sm'>
					Add Goal
				</Button>
				<Button
					type='button'
					variant='outline'
					size='sm'
					onClick={() => {
						setIsAdding(false);
						setNewGoalTitle('');
					}}
				>
					Cancel
				</Button>
			</div>
		</form>
	);
}
