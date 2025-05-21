'use client';

import { createContext, useContext, useState, ReactNode, useRef } from 'react';
import { Goal } from '@/components/goal-item';

interface GoalsState {
	[quarterId: string]: Goal[];
}

interface GoalsContextType {
	goals: GoalsState;
	addGoal: (quarterId: string, title: string) => void;
	removeGoal: (quarterId: string, goalId: string) => void;
	updateGoalOrder: (quarterId: string, reorderedGoals: Goal[]) => void;
	updateGoalCompletion: (
		quarterId: string,
		goalId: string,
		completed: boolean
	) => void;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

// Helper to generate unique IDs
const generateId = () =>
	`goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export function GoalsProvider({ children }: { children: ReactNode }) {
	// Use useRef with an initialization function to prevent regenerating IDs on re-renders
	const initialGoals = useRef<GoalsState>({
		q1: [
			{
				id: 'goal_q1_1',
				title: 'Register cosmetic form with Canada',
				completed: false,
			},
			{
				id: 'goal_q1_2',
				title: 'Launch new product line',
				completed: false,
			},
		],
		q2: [
			{
				id: 'goal_q2_1',
				title: 'Expand to international markets',
				completed: false,
			},
		],
		q3: [
			{
				id: 'goal_q3_1',
				title: 'Review Q1 and Q2 performance',
				completed: false,
			},
		],
		q4: [
			{
				id: 'goal_q4_1',
				title: 'Prepare annual report',
				completed: false,
			},
			{
				id: 'goal_q4_2',
				title: 'Plan next year strategy',
				completed: false,
			},
		],
	}).current;

	const [goals, setGoals] = useState<GoalsState>(initialGoals);

	const addGoal = (quarterId: string, title: string) => {
		setGoals((prevGoals: GoalsState) => {
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

	const removeGoal = (quarterId: string, goalId: string) => {
		setGoals((prevGoals: GoalsState) => {
			const quarterGoals = prevGoals[quarterId] || [];
			return {
				...prevGoals,
				[quarterId]: quarterGoals.filter(
					(goal: Goal) => goal.id !== goalId
				),
			};
		});
	};

	const updateGoalOrder = (quarterId: string, reorderedGoals: Goal[]) => {
		setGoals((prevGoals: GoalsState) => ({
			...prevGoals,
			[quarterId]: reorderedGoals,
		}));
	};

	const updateGoalCompletion = (
		quarterId: string,
		goalId: string,
		completed: boolean
	) => {
		setGoals((prevGoals: GoalsState) => {
			const quarterGoals = prevGoals[quarterId] || [];
			return {
				...prevGoals,
				[quarterId]: quarterGoals.map((goal: Goal) =>
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
				removeGoal,
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
