'use client';

import { SidebarNav } from '@/components/sidebar-nav';
import { MonthlyCalendar } from '@/components/monthly-calendar';
import { TasksProvider } from '@/contexts/TasksContext';

export default function MonthlyPage() {
	return (
		<TasksProvider>
			<div className='w-full h-screen flex'>
				{/* Sidebar - fixed width */}
				<div className='w-[200px] min-w-[200px] h-full'>
					<SidebarNav />
				</div>

				{/* Main content - flexible width */}
				<div className='flex-grow h-full overflow-auto bg-white p-6'>
					<h1 className='mb-8 text-2xl font-bold'>
						Monthly Calendar
					</h1>
					<MonthlyCalendar />
				</div>
			</div>
		</TasksProvider>
	);
}
