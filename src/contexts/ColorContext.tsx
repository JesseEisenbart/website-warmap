'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type ColorType = {
	name: string;
	color: string;
};

interface ColorContextType {
	colors: ColorType[];
	addColor: (color: ColorType) => void;
	activeColor: string | null;
	setActiveColor: (color: string | null) => void;
	resetActiveColor: () => void;
	applyColorToMonth: string | null;
	setApplyColorToMonth: (month: string | null) => void;
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export function ColorProvider({ children }: { children: ReactNode }) {
	const [colors, setColors] = useState<ColorType[]>([
		{ name: 'Purple', color: '#9333ea' },
		{ name: 'Blue', color: '#2563eb' },
	]);

	const [activeColor, setActiveColor] = useState<string | null>(null);
	const [applyColorToMonth, setApplyColorToMonth] = useState<string | null>(
		null
	);

	const addColor = (color: ColorType) => {
		setColors((prev) => [...prev, color]);
	};

	const resetActiveColor = () => {
		setActiveColor(null);
	};

	return (
		<ColorContext.Provider
			value={{
				colors,
				addColor,
				activeColor,
				setActiveColor,
				resetActiveColor,
				applyColorToMonth,
				setApplyColorToMonth,
			}}
		>
			{children}
		</ColorContext.Provider>
	);
}

export function useColors() {
	const context = useContext(ColorContext);
	if (context === undefined) {
		throw new Error('useColors must be used within a ColorProvider');
	}
	return context;
}
