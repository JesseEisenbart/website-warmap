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
}

export function GoalList({
	goals,
	quarterId,
	onDragEnd,
	onCompleteChange,
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
						className='mb-2'
						data-goals-list-id={quarterId}
					>
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
									>
										<GoalItem
											goal={goal}
											onCompleteChange={onCompleteChange}
											dragHandleProps={
												provided.dragHandleProps
											}
										/>
									</div>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
}
