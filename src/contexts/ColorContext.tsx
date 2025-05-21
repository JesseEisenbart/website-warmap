'use client';

import {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
} from 'react';

type ColorType = {
	name: string;
	color: string;
};

// Define a type for the day colors data structure
type DayColorsMapType = {
	[month: string]: {
		[day: number]: string;
	};
};

interface ColorContextType {
	colors: ColorType[];
	addColor: (color: ColorType) => void;
	activeColor: string | null;
	setActiveColor: (color: string | null) => void;
	resetActiveColor: () => void;
	applyColorToMonth: string | null;
	setApplyColorToMonth: (month: string | null) => void;
	dayColorsMap: DayColorsMapType;
	updateDayColors: (month: string, dayColors: Record<number, string>) => void;
	getDayColorsForMonth: (month: string) => Record<number, string>;
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
	const [dayColorsMap, setDayColorsMap] = useState<DayColorsMapType>({});

	// Load stored colors from localStorage on initial render
	useEffect(() => {
		try {
			const storedDayColors = localStorage.getItem('dayColorsMap');
			if (storedDayColors) {
				const parsedColors = JSON.parse(storedDayColors);
				setDayColorsMap(parsedColors);
				console.log('Loaded colors from localStorage:', parsedColors);
			}
		} catch (error) {
			console.error('Error loading day colors from localStorage:', error);
		}
	}, []);

	// Update localStorage whenever dayColorsMap changes
	useEffect(() => {
		if (Object.keys(dayColorsMap).length > 0) {
			try {
				const serialized = JSON.stringify(dayColorsMap);
				localStorage.setItem('dayColorsMap', serialized);
				console.log('Saved colors to localStorage:', dayColorsMap);
			} catch (error) {
				console.error(
					'Error saving day colors to localStorage:',
					error
				);
			}
		}
	}, [dayColorsMap]);

	const addColor = (color: ColorType) => {
		setColors((prev) => [...prev, color]);
	};

	const resetActiveColor = () => {
		setActiveColor(null);
	};

	const updateDayColors = (
		month: string,
		dayColors: Record<number, string>
	) => {
		setDayColorsMap((prev) => ({
			...prev,
			[month]: {
				...(prev[month] || {}),
				...dayColors,
			},
		}));
	};

	const getDayColorsForMonth = (month: string) => {
		const monthColors = dayColorsMap[month] || {};
		// Ensure all keys are properly converted to numbers
		const result: Record<number, string> = {};
		Object.entries(monthColors).forEach(([day, color]) => {
			result[Number(day)] = color;
		});
		return result;
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
				dayColorsMap,
				updateDayColors,
				getDayColorsForMonth,
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
