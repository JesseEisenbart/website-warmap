'use client';

import {
	DragDropContext,
	Droppable,
	Draggable,
	DropResult,
} from '@hello-pangea/dnd';
import { Goal, GoalItem } from './goal-item';
import { useEffect } from 'react';

interface GoalListProps {
	goals: Goal[];
	quarterId: string;
	onDragEnd: (result: DropResult) => void;
	onCompleteChange: (goalId: string, completed: boolean) => void;
	onDelete?: (goalId: string) => void;
	hideActions?: boolean;
}

export function GoalList({
	goals,
	quarterId,
	onDragEnd,
	onCompleteChange,
	onDelete,
	hideActions = false,
}: GoalListProps) {
	// Debug log
	useEffect(() => {
		console.log(
			'GoalList rendering for quarter:',
			quarterId,
			'with goals:',
			goals
		);
	}, [quarterId, goals]);

	// Add necessary polyfill for React 19 compatibility
	useEffect(() => {
		// Ensure the drag and drop functionality works with React 19
		document.querySelectorAll('[data-rbd-draggable-id]').forEach((el) => {
			el.setAttribute('draggable', 'true');
		});
	}, [goals]);

	const handleDragEnd = (result: DropResult) => {
		console.log('Drag ended:', result);
		onDragEnd(result);
	};

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<Droppable droppableId={`goals-${quarterId}`}>
				{(provided) => (
					<div
						{...provided.droppableProps}
						ref={provided.innerRef}
						className='rounded-md overflow-hidden bg-white border border-gray-200'
						data-goals-list-id={quarterId}
					>
						<div className='bg-white'>
							{goals.map((goal, index) => (
								<Draggable
									key={goal.id}
									draggableId={goal.id}
									index={index}
								>
									{(provided) => (
										<div
											ref={provided.innerRef}
											{...provided.draggableProps}
											data-goal-id={goal.id}
											data-goal-index={index}
											className='border-b border-gray-100 last:border-0 flex items-center'
										>
											<GoalItem
												goal={goal}
												onCompleteChange={
													onCompleteChange
												}
												dragHandleProps={
													provided.dragHandleProps ??
													undefined
												}
												onDelete={onDelete}
												hideActions={hideActions}
											/>
										</div>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</div>
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
}
