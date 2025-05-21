'use client';

import { useState, useRef, useEffect } from 'react';
import {
	Check,
	MoreVertical,
	Edit,
	Trash2,
	Link,
	MoveVertical,
	Send,
	Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task } from '@/contexts/TasksContext';
import { Input } from './ui/input';

interface TaskItemProps {
	task: Task;
	onRemove: (id: string) => void;
	onCompletionChange: (id: string, completed: boolean) => void;
	onUpdateTitle: (id: string, title: string) => void;
	onUpdateTaskType?: (id: string, newType: 'power' | 'primary') => void;
	showActionButtons?: boolean;
}

export function TaskItem({
	task,
	onRemove,
	onCompletionChange,
	onUpdateTitle,
	onUpdateTaskType,
	showActionButtons = true,
}: TaskItemProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editedTitle, setEditedTitle] = useState(task.title);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

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

	// Close menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node)
			) {
				setIsMenuOpen(false);
			}
		};

		if (isMenuOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isMenuOpen]);

	useEffect(() => {
		if (isMenuOpen && buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect();
			const menuWidth = 192; // Approximate menu width (48 * 4)
			const menuHeight = 240; // Approximate menu height

			// Calculate position while ensuring the menu stays within viewport
			let top = rect.bottom + window.scrollY;
			let right = window.innerWidth - rect.right;

			// Ensure menu doesn't go below viewport
			if (top + menuHeight > window.innerHeight + window.scrollY) {
				// Position above if there's not enough space below
				top = rect.top + window.scrollY - menuHeight;
				// If still not enough space, position at the bottom of the viewport
				if (top < window.scrollY) {
					top = window.innerHeight + window.scrollY - menuHeight;
				}
			}

			// Ensure menu doesn't go off the left side of the screen
			if (rect.right - menuWidth < 0) {
				right = window.innerWidth - rect.left - menuWidth;
			}

			setMenuPosition({
				top,
				right: Math.max(right, 10), // Keep at least 10px from the right edge
			});
		}
	}, [isMenuOpen]);

	const handleEdit = () => {
		setIsMenuOpen(false);
		setIsEditing(true);
	};

	const handleDelete = () => {
		setIsMenuOpen(false);
		onRemove(task.id);
	};

	const handleTogglePowerTask = () => {
		if (onUpdateTaskType) {
			const newType = task.taskType === 'power' ? 'primary' : 'power';
			onUpdateTaskType(task.id, newType);
			setIsMenuOpen(false);
		}
	};

	return (
		<div
			className={cn(
				'flex items-center gap-2 px-4 py-3 text-sm relative hover:bg-gray-50 group',
				task.completed && 'opacity-60'
			)}
		>
			<button
				onClick={() => onCompletionChange(task.id, !task.completed)}
				className={cn(
					'flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center',
					task.completed
						? 'bg-blue-500 border-blue-500'
						: 'border-gray-300'
				)}
				aria-label={
					task.completed ? 'Mark as incomplete' : 'Mark as complete'
				}
			>
				{task.completed && <Check size={12} className='text-white' />}
			</button>

			{isEditing ? (
				<Input
					value={editedTitle}
					onChange={(e) => setEditedTitle(e.target.value)}
					onKeyDown={handleKeyDown}
					autoFocus
					className='flex-grow py-1'
					onBlur={handleEditSave}
				/>
			) : (
				<span
					className={cn(
						'flex-grow truncate ml-2',
						task.completed && 'line-through text-gray-500'
					)}
				>
					{task.title}
				</span>
			)}

			{showActionButtons && !isEditing && (
				<div className='relative' ref={menuRef}>
					<button
						ref={buttonRef}
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className='ml-auto text-gray-400 hover:text-gray-600 p-1 rounded-md'
					>
						<MoreVertical size={16} />
					</button>

					{isMenuOpen && (
						<div
							className='fixed z-[9999] w-48 bg-white shadow-lg rounded-md py-1 border border-gray-200 overflow-hidden'
							style={{
								top: `${menuPosition.top}px`,
								right: `${menuPosition.right}px`,
								maxHeight: '80vh', // Prevent menu from being taller than the viewport
							}}
						>
							<button
								className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'
								onClick={handleEdit}
							>
								<Edit size={14} />
								Edit
							</button>
							<button
								className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'
								onClick={handleDelete}
							>
								<Trash2 size={14} />
								Delete
							</button>
							{onUpdateTaskType && (
								<button
									className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'
									onClick={handleTogglePowerTask}
								>
									<Zap size={14} />
									{task.taskType === 'power'
										? 'Make Primary Task'
										: 'Make Power Task'}
								</button>
							)}
							<div className='h-px bg-gray-200 my-1'></div>
							<button className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'>
								<Link size={14} />
								Chain
							</button>
							<button className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'>
								<MoveVertical size={14} />
								Move
							</button>
							<button className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'>
								<Send size={14} />
								Send to Backlog
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
