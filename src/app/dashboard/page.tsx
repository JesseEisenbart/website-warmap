'use client';

import { SidebarNav } from '@/components/sidebar-nav';
import { QuarterSection } from '@/components/quarter-section';
import { ColorKey } from '@/components/color-key';
import { ColorProvider } from '@/contexts/ColorContext';
import { GoalsProvider } from '@/contexts/GoalsContext';

export default function DashboardPage() {
	// Sample data for the quarters and goals
	const quarters = [
		{
			id: 'q1',
			title: 'Q1',
			months: ['Jan', 'Feb', 'Mar'],
		},
		{
			id: 'q2',
			title: 'Q2',
			months: ['Apr', 'May', 'Jun'],
		},
		{
			id: 'q3',
			title: 'Q3',
			months: ['Jul', 'Aug', 'Sep'],
		},
		{
			id: 'q4',
			title: 'Q4',
			months: ['Oct', 'Nov', 'Dec'],
		},
	];

	return (
		<ColorProvider>
			<GoalsProvider>
				<div className='w-full h-screen flex'>
					{/* Sidebar - fixed width */}
					<div className='w-[200px] min-w-[200px] h-full'>
						<SidebarNav />
					</div>

					{/* Main content - flexible width */}
					<div className='flex-grow h-full overflow-auto bg-white p-6'>
						<h1 className='mb-8 text-2xl font-bold'>
							2025 Dashboard
						</h1>

						{/* Quarters */}
						{quarters.map((quarter) => (
							<QuarterSection
								key={quarter.id}
								id={quarter.id}
								quarter={quarter.title}
								months={quarter.months}
							/>
						))}
					</div>

					{/* Color key sidebar - fixed width */}
					<div className='w-[250px] min-w-[250px] h-full overflow-auto border-l border-gray-200 p-4'>
						<ColorKey />
					</div>
				</div>
			</GoalsProvider>
		</ColorProvider>
	);
}
