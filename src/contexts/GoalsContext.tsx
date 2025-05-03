'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Goal } from '@/components/goal-item';

interface GoalsState {
	[quarterId: string]: Goal[];
}

interface GoalsContextType {
	goals: GoalsState;
	addGoal: (quarterId: string, title: string) => void;
	updateGoalOrder: (quarterId: string, reorderedGoals: Goal[]) => void;
	updateGoalCompletion: (
		quarterId: string,
		goalId: string,
		completed: boolean
	) => void;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

// Helper to generate unique IDs
const generateId = () => `goal_${Math.random().toString(36).substr(2, 9)}`;

export function GoalsProvider({ children }: { children: ReactNode }) {
	const [goals, setGoals] = useState<GoalsState>({
		q1: [
			{
				id: generateId(),
				title: 'Register cosmetic form with Canada',
				completed: false,
			},
			{
				id: generateId(),
				title: 'Launch new product line',
				completed: false,
			},
		],
		q2: [
			{
				id: generateId(),
				title: 'Expand to international markets',
				completed: false,
			},
		],
		q3: [
			{
				id: generateId(),
				title: 'Review Q1 and Q2 performance',
				completed: false,
			},
		],
		q4: [
			{
				id: generateId(),
				title: 'Prepare annual report',
				completed: false,
			},
			{
				id: generateId(),
				title: 'Plan next year strategy',
				completed: false,
			},
		],
	});

	const addGoal = (quarterId: string, title: string) => {
		setGoals((prevGoals) => {
			const quarterGoals = prevGoals[quarterId] || [];
			return {
				...prevGoals,
				[quarterId]: [
					...quarterGoals,
					{ id: generateId(), title, completed: false },
				],
			};
		});
	};

	const updateGoalOrder = (quarterId: string, reorderedGoals: Goal[]) => {
		setGoals((prevGoals) => ({
			...prevGoals,
			[quarterId]: reorderedGoals,
		}));
	};

	const updateGoalCompletion = (
		quarterId: string,
		goalId: string,
		completed: boolean
	) => {
		setGoals((prevGoals) => {
			const quarterGoals = prevGoals[quarterId] || [];
			return {
				...prevGoals,
				[quarterId]: quarterGoals.map((goal) =>
					goal.id === goalId ? { ...goal, completed } : goal
				),
			};
		});
	};

	return (
		<GoalsContext.Provider
			value={{
				goals,
				addGoal,
				updateGoalOrder,
				updateGoalCompletion,
			}}
		>
			{children}
		</GoalsContext.Provider>
	);
}

export function useGoals() {
	const context = useContext(GoalsContext);
	if (context === undefined) {
		throw new Error('useGoals must be used within a GoalsProvider');
	}
	return context;
}
