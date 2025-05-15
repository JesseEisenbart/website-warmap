'use client';

import { Check, GripVertical, Pencil, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Input } from './ui/input';

export interface Goal {
	id: string;
	title: string;
	completed: boolean;
}

interface GoalItemProps {
	goal: Goal;
	onCompleteChange: (id: string, completed: boolean) => void;
	dragHandleProps?: any;
	onUpdateTitle?: (id: string, newTitle: string) => void;
}

export function GoalItem({
	goal,
	onCompleteChange,
	dragHandleProps,
	onUpdateTitle,
}: GoalItemProps) {
	const [isHovered, setIsHovered] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editedTitle, setEditedTitle] = useState(goal.title);

	const handleEditClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsEditing(true);
		setEditedTitle(goal.title);
	};

	const handleSaveEdit = () => {
		if (editedTitle.trim() && onUpdateTitle) {
			onUpdateTitle(goal.id, editedTitle);
		}
		setIsEditing(false);
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
		setEditedTitle(goal.title);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSaveEdit();
		} else if (e.key === 'Escape') {
			handleCancelEdit();
		}
	};

	return (
		<div
			className={cn(
				'flex items-center gap-3 py-2 pl-2 pr-4 rounded-md mb-2 transition-all',
				goal.completed
					? 'bg-green-50'
					: isHovered
					? 'bg-gray-50'
					: 'bg-transparent'
			)}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			data-goal-title={goal.title}
		>
			<div
				{...dragHandleProps}
				className='cursor-grab p-1 text-gray-400 hover:text-gray-600 drag-handle'
				draggable='true'
				data-drag-handle-id={goal.id}
			>
				<GripVertical size={16} />
			</div>

			<button
				onClick={() => onCompleteChange(goal.id, !goal.completed)}
				className={cn(
					'flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center transition-colors',
					goal.completed
						? 'bg-green-500 border-green-500'
						: 'border-gray-300 hover:border-gray-400'
				)}
				aria-label={
					goal.completed ? 'Mark as incomplete' : 'Mark as complete'
				}
			>
				{goal.completed && <Check size={12} className='text-white' />}
			</button>

			{isEditing ? (
				<div className='flex items-center flex-grow gap-2'>
					<Input
						value={editedTitle}
						onChange={(e) => setEditedTitle(e.target.value)}
						onKeyDown={handleKeyDown}
						className='h-7 py-1 text-sm'
						autoFocus
						aria-label='Edit goal title'
					/>
					<div className='flex gap-1'>
						<button
							onClick={handleSaveEdit}
							className='p-1 text-green-600 hover:text-green-800 rounded-full hover:bg-green-50'
							aria-label='Save changes'
						>
							<Check size={16} />
						</button>
						<button
							onClick={handleCancelEdit}
							className='p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50'
							aria-label='Cancel editing'
						>
							<X size={16} />
						</button>
					</div>
				</div>
			) : (
				<>
					<span
						className={cn(
							'text-sm flex-grow',
							goal.completed && 'line-through text-green-700'
						)}
					>
						{goal.title}
					</span>
					<button
						onClick={handleEditClick}
						className={cn(
							'p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100',
							!isHovered && 'opacity-0',
							'transition-opacity'
						)}
						aria-label='Edit goal'
					>
						<Pencil size={14} />
					</button>
				</>
			)}
		</div>
	);
}
