'use client';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/sidebar-nav';
import { Calendar } from '@/components/ui/calendar';
import { ColorKey } from '@/components/color-key';
import { useState } from 'react';

export default function CalendarPage() {
	// Sample colors for the color key
	const colors = [
		{ name: 'Test', color: 'purple' },
		{ name: 'Hello', color: 'blue' },
	];

	return (
		<SidebarProvider>
			<div className='grid h-screen grid-cols-[200px_minmax(0,1fr)_250px]'>
				{/* Sidebar */}
				<SidebarNav />

				{/* Main content */}
				<SidebarInset>
					<main className='h-full overflow-auto bg-white p-6'>
						<h1 className='mb-8 text-2xl font-bold'>
							Calendar View
						</h1>

						<div className='rounded-lg border p-4'>
							<Calendar mode='single' />
						</div>
					</main>
				</SidebarInset>

				{/* Right sidebar - Color Key */}
				<div className='border-l border-gray-200 p-6'>
					<ColorKey colors={colors} />
				</div>
			</div>
		</SidebarProvider>
	);
}
