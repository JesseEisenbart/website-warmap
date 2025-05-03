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

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId={`goals-${quarterId}`}>
				{(provided) => (
					<div
						{...provided.droppableProps}
						ref={provided.innerRef}
						className='mb-2'
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

// Separate component to handle the Draggable element
interface GoalItemWrapperProps {
	goal: Goal;
	index: number;
	onCompleteChange: (goalId: string, completed: boolean) => void;
}

function GoalItemWrapper({
	goal,
	index,
	onCompleteChange,
}: GoalItemWrapperProps) {
	return (
		<Draggable draggableId={goal.id} index={index} isDragDisabled={false}>
			{(provided) => (
				<div ref={provided.innerRef} {...provided.draggableProps}>
					<GoalItem
						goal={goal}
						onCompleteChange={onCompleteChange}
						dragHandleProps={provided.dragHandleProps}
					/>
				</div>
			)}
		</Draggable>
	);
}
