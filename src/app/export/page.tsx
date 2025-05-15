import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/sidebar-nav';
import { Button } from '@/components/ui/button';
import { FileDown, FileText, FileSpreadsheet } from 'lucide-react';

export default function ExportPage() {
	return (
		<SidebarProvider>
			<div className='grid h-screen grid-cols-[200px_minmax(0,1fr)]'>
				{/* Sidebar */}
				<SidebarNav />

				{/* Main content */}
				<SidebarInset>
					<main className='h-full overflow-auto bg-white p-6'>
						<h1 className='mb-8 text-2xl font-bold'>Export</h1>

						<div className='mx-auto max-w-4xl rounded-lg border p-6'>
							<h2 className='mb-6 text-lg font-medium'>
								Export Options
							</h2>

							<div className='space-y-4'>
								<div className='flex items-center justify-between rounded-md border p-4'>
									<div className='flex items-center gap-3'>
										<FileText className='h-6 w-6 text-red-500' />
										<div>
											<h3 className='font-medium'>
												PDF Export
											</h3>
											<p className='text-sm text-gray-500'>
												Export your macro as a PDF file
											</p>
										</div>
									</div>
									<Button>
										<FileDown className='mr-2 h-4 w-4' />
										Export
									</Button>
								</div>

								<div className='flex items-center justify-between rounded-md border p-4'>
									<div className='flex items-center gap-3'>
										<FileSpreadsheet className='h-6 w-6 text-green-500' />
										<div>
											<h3 className='font-medium'>
												Excel Export
											</h3>
											<p className='text-sm text-gray-500'>
												Export your data as an Excel
												spreadsheet
											</p>
										</div>
									</div>
									<Button>
										<FileDown className='mr-2 h-4 w-4' />
										Export
									</Button>
								</div>

								<div className='flex items-center justify-between rounded-md border p-4'>
									<div className='flex items-center gap-3'>
										<FileText className='h-6 w-6 text-blue-500' />
										<div>
											<h3 className='font-medium'>
												Custom Report
											</h3>
											<p className='text-sm text-gray-500'>
												Generate a custom report
											</p>
										</div>
									</div>
									<Button>
										<FileDown className='mr-2 h-4 w-4' />
										Export
									</Button>
								</div>
							</div>
						</div>
					</main>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}
