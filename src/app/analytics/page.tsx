import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/sidebar-nav';

export default function AnalyticsPage() {
	return (
		<SidebarProvider>
			<div className='grid h-screen grid-cols-[200px_minmax(0,1fr)]'>
				{/* Sidebar */}
				<SidebarNav />

				{/* Main content */}
				<SidebarInset>
					<main className='h-full overflow-auto bg-white p-6'>
						<h1 className='mb-8 text-2xl font-bold'>Analytics</h1>

						<div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4'>
							{/* Sample analytics cards */}
							<div className='rounded-lg border p-6'>
								<h2 className='mb-4 text-lg font-medium'>
									Goal Completion
								</h2>
								<div className='flex h-40 items-center justify-center bg-gray-100'>
									<p className='text-gray-500'>
										Chart placeholder
									</p>
								</div>
							</div>

							<div className='rounded-lg border p-6'>
								<h2 className='mb-4 text-lg font-medium'>
									Progress by Quarter
								</h2>
								<div className='flex h-40 items-center justify-center bg-gray-100'>
									<p className='text-gray-500'>
										Chart placeholder
									</p>
								</div>
							</div>

							<div className='rounded-lg border p-6'>
								<h2 className='mb-4 text-lg font-medium'>
									Completion Rate
								</h2>
								<div className='flex h-40 items-center justify-center bg-gray-100'>
									<p className='text-gray-500'>
										Chart placeholder
									</p>
								</div>
							</div>

							<div className='rounded-lg border p-6'>
								<h2 className='mb-4 text-lg font-medium'>
									Goal Categories
								</h2>
								<div className='flex h-40 items-center justify-center bg-gray-100'>
									<p className='text-gray-500'>
										Chart placeholder
									</p>
								</div>
							</div>
						</div>
					</main>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}
