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
			<div
				className='flex items-center px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer border-t border-gray-100'
				onClick={() => setIsAdding(true)}
			>
				<div className='flex-shrink-0 h-5 w-5 rounded-full border border-gray-300'></div>
				<span className='ml-3 text-gray-400'>
					Click here to add goal
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
		);
	}

	return (
		<form onSubmit={handleSubmit} className='mb-2'>
			<div className='flex items-center px-4 py-3 gap-2 text-sm border-t border-gray-100'>
				<div className='flex-shrink-0 h-5 w-5 rounded-full border border-gray-300'></div>
				<Input
					type='text'
					placeholder='Enter goal title...'
					value={newGoalTitle}
					onChange={(e) => setNewGoalTitle(e.target.value)}
					autoFocus
					className='text-sm flex-grow border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0'
				/>
				<div className='flex gap-1'>
					<button
						type='submit'
						className='text-blue-500 hover:text-blue-700 text-sm font-medium'
					>
						Add
					</button>
					<button
						type='button'
						className='text-gray-500 hover:text-gray-700 text-sm ml-2'
						onClick={() => {
							setIsAdding(false);
							setNewGoalTitle('');
						}}
					>
						Cancel
					</button>
				</div>
			</div>
		</form>
	);
}
