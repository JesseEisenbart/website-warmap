'use client';

import { useState } from 'react';
import { X, Check, Pencil, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task } from '@/contexts/TasksContext';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface TaskItemProps {
	task: Task;
	onRemove: (id: string) => void;
	onCompletionChange: (id: string, completed: boolean) => void;
	onUpdateTitle: (id: string, title: string) => void;
	showActionButtons?: boolean;
}

export function TaskItem({
	task,
	onRemove,
	onCompletionChange,
	onUpdateTitle,
	showActionButtons = true,
}: TaskItemProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editedTitle, setEditedTitle] = useState(task.title);
	const [isHovered, setIsHovered] = useState(false);

	const handleEditSave = () => {
		if (editedTitle.trim() && editedTitle !== task.title) {
			onUpdateTitle(task.id, editedTitle);
		} else {
			setEditedTitle(task.title); // Reset to original if empty or unchanged
		}
		setIsEditing(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleEditSave();
		} else if (e.key === 'Escape') {
			setEditedTitle(task.title);
			setIsEditing(false);
		}
	};

	return (
		<div
			className={cn(
				'flex items-center gap-2 rounded-md border px-2 py-1 mb-1 text-sm',
				task.completed ? 'bg-green-50 border-green-200' : 'bg-white'
			)}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<button
				onClick={() => onCompletionChange(task.id, !task.completed)}
				className={cn(
					'flex-shrink-0 h-4 w-4 rounded-full border flex items-center justify-center',
					task.completed
						? 'bg-green-500 border-green-500'
						: 'border-gray-300'
				)}
				aria-label={
					task.completed ? 'Mark as incomplete' : 'Mark as complete'
				}
			>
				{task.completed && <Check size={10} className='text-white' />}
			</button>

			{isEditing ? (
				<Input
					value={editedTitle}
					onChange={(e) => setEditedTitle(e.target.value)}
					onKeyDown={handleKeyDown}
					autoFocus
					customSize='sm'
					className='flex-grow py-0 h-6 text-xs'
				/>
			) : (
				<span
					className={cn(
						'flex-grow truncate',
						task.completed && 'line-through text-gray-500'
					)}
				>
					{task.title}
				</span>
			)}

			<div className='flex gap-1'>
				{isEditing ? (
					<Button
						variant='ghost'
						size='sm'
						className='h-5 w-5 p-0 text-blue-500 hover:text-blue-600'
						onClick={handleEditSave}
					>
						<Save size={12} />
						<span className='sr-only'>Save</span>
					</Button>
				) : (
					showActionButtons &&
					isHovered && (
						<Button
							variant='ghost'
							size='sm'
							className='h-5 w-5 p-0 text-gray-400 hover:text-gray-600 transition-opacity duration-150'
							onClick={() => setIsEditing(true)}
						>
							<Pencil size={12} />
							<span className='sr-only'>Edit</span>
						</Button>
					)
				)}
				{showActionButtons && isHovered && (
					<Button
						variant='ghost'
						size='sm'
						className='h-5 w-5 p-0 text-gray-400 hover:text-gray-600 transition-opacity duration-150'
						onClick={() => onRemove(task.id)}
					>
						<X size={12} />
						<span className='sr-only'>Remove</span>
					</Button>
				)}
			</div>
		</div>
	);
}
