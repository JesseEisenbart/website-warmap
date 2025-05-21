'use client';

import { Check, GripVertical, Pencil, X, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import { Input } from './ui/input';
import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';

export interface Goal {
	id: string;
	title: string;
	completed: boolean;
}

export interface GoalItemProps {
	goal: Goal;
	onCompleteChange: (goalId: string, completed: boolean) => void;
	dragHandleProps?: DraggableProvidedDragHandleProps;
	onUpdateTitle?: (goalId: string, newTitle: string) => void;
	onDelete?: (goalId: string) => void;
	onMove?: (goalId: string) => void;
	hideActions?: boolean;
}

export function GoalItem({
	goal,
	onCompleteChange,
	dragHandleProps,
	onUpdateTitle,
	onDelete,
	onMove,
	hideActions = false,
}: GoalItemProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editedTitle, setEditedTitle] = useState(goal.title);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

	const handleEditClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsEditing(true);
		setEditedTitle(goal.title);
		setIsMenuOpen(false);
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

	// Popup menu positioning and clamping
	useEffect(() => {
		if (isMenuOpen && buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect();
			const menuWidth = 192;
			const menuHeight = 144;
			let top = rect.bottom + window.scrollY;
			let right = window.innerWidth - rect.right;
			if (top + menuHeight > window.innerHeight + window.scrollY) {
				top = rect.top + window.scrollY - menuHeight;
				if (top < window.scrollY) {
					top = window.innerHeight + window.scrollY - menuHeight;
				}
			}
			if (rect.right - menuWidth < 0) {
				right = window.innerWidth - rect.left - menuWidth;
			}
			setMenuPosition({
				top,
				right: Math.max(right, 10),
			});
		}
	}, [isMenuOpen]);

	// Close menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target as Node)
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

	return (
		<div
			className={cn(
				'flex items-center gap-2 px-4 py-3 text-sm relative group w-full',
				goal.completed
					? 'bg-green-50 border border-green-200'
					: 'hover:bg-gray-50'
			)}
		>
			<div
				{...dragHandleProps}
				className={cn(
					'cursor-grab flex-shrink-0 drag-handle',
					goal.completed
						? 'text-green-300'
						: 'text-gray-400 hover:text-gray-600'
				)}
				draggable='true'
				data-drag-handle-id={goal.id}
			>
				<GripVertical size={14} />
			</div>

			<button
				onClick={() => onCompleteChange(goal.id, !goal.completed)}
				className={cn(
					'flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center',
					goal.completed
						? 'bg-green-500 border-green-500 text-white'
						: 'border-gray-300'
				)}
				aria-label={
					goal.completed ? 'Mark as incomplete' : 'Mark as complete'
				}
			>
				{goal.completed && <Check size={12} className='text-white' />}
			</button>

			{isEditing ? (
				<Input
					value={editedTitle}
					onChange={(e) => setEditedTitle(e.target.value)}
					onKeyDown={handleKeyDown}
					className='flex-grow py-1'
					autoFocus
					aria-label='Edit goal title'
				/>
			) : (
				<span
					className={cn(
						'flex-grow truncate ml-2',
						goal.completed ? 'text-green-700 italic' : ''
					)}
				>
					{goal.title}
				</span>
			)}

			<div className='flex gap-1'>
				{isEditing ? (
					<>
						<button
							onClick={handleSaveEdit}
							className='h-5 w-5 p-0 text-blue-500 hover:text-blue-600'
							aria-label='Save changes'
						>
							<Check size={12} />
						</button>
						<button
							onClick={handleCancelEdit}
							className='h-5 w-5 p-0 text-gray-500 hover:text-gray-600'
							aria-label='Cancel editing'
						>
							<X size={12} />
						</button>
					</>
				) : (
					<>
						{!hideActions && (
							<>
								<button
									onClick={handleEditClick}
									className='h-5 w-5 p-0 text-gray-500 hover:text-gray-600'
									aria-label='Edit goal'
								>
									<Pencil size={12} />
								</button>
								{onDelete && (
									<button
										onClick={() => onDelete(goal.id)}
										className='h-5 w-5 p-0 text-gray-500 hover:text-gray-600'
										aria-label='Delete goal'
									>
										<X size={12} />
									</button>
								)}
							</>
						)}
						{/* Three dots menu for popup */}
						<div className='relative' ref={menuRef}>
							<button
								ref={buttonRef}
								onClick={() => setIsMenuOpen((v) => !v)}
								className='h-5 w-5 p-0 text-gray-400 hover:text-gray-600 rounded-md'
								aria-label='More actions'
							>
								<MoreVertical size={16} />
							</button>
							{isMenuOpen && (
								<div
									className='fixed z-[9999] w-48 bg-white shadow-lg rounded-md py-1 border border-gray-200 overflow-hidden'
									style={{
										top: `${menuPosition.top}px`,
										right: `${menuPosition.right}px`,
										maxHeight: '80vh',
									}}
								>
									<button
										onClick={handleEditClick}
										className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'
									>
										<Pencil size={14} />
										Edit
									</button>
									{onDelete && (
										<button
											onClick={() => {
												setIsMenuOpen(false);
												onDelete(goal.id);
											}}
											className='flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left'
										>
											<X size={14} />
											Delete
										</button>
									)}
									{onMove && (
										<button
											onClick={() => {
												setIsMenuOpen(false);
												onMove(goal.id);
											}}
											className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'
										>
											<GripVertical size={14} />
											Move to another quarter
										</button>
									)}
								</div>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
}
