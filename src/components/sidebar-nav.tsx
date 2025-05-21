import Link from 'next/link';
import {
	BarChart2,
	LineChart,
	LogOut,
	UserCircle,
	CalendarDays,
	Calendar,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SettingsDialog } from './settings-dialog';

export function SidebarNav() {
	return (
		<div className='flex h-full flex-col bg-[#0a0a1a] text-white'>
			<div className='flex h-16 items-center px-4 font-medium'>
				<LineChart className='mr-2 h-5 w-5' />
				<span>War Map</span>
			</div>
			<Separator className='bg-gray-700' />
			<div className='flex-1 overflow-auto py-2'>
				<nav className='grid gap-1 px-2'>
					<Button
						asChild
						variant='ghost'
						className='justify-start text-white hover:bg-gray-800'
					>
						<Link href='/macro'>
							<BarChart2 className='mr-2 h-5 w-5' />
							Macro
						</Link>
					</Button>
					<Button
						asChild
						variant='ghost'
						className='justify-start text-white hover:bg-gray-800'
					>
						<Link href='/daily'>
							<Calendar className='mr-2 h-5 w-5' />
							Daily
						</Link>
					</Button>
					<Button
						asChild
						variant='ghost'
						className='justify-start text-white hover:bg-gray-800'
					>
						<Link href='/monthly'>
							<CalendarDays className='mr-2 h-5 w-5' />
							Monthly
						</Link>
					</Button>
					<Button
						asChild
						variant='ghost'
						className='justify-start text-white hover:bg-gray-800'
					>
						<Link href='/analytics'>
							<LineChart className='mr-2 h-5 w-5' />
							Analytics
						</Link>
					</Button>
					<Button
						asChild
						variant='ghost'
						className='justify-start text-white hover:bg-gray-800'
					>
						<Link href='/export'>
							<LogOut className='mr-2 h-5 w-5' />
							Export
						</Link>
					</Button>
				</nav>
			</div>
			<Separator className='bg-gray-700' />
			<div className='py-2'>
				<nav className='grid gap-1 px-2'>
					<SettingsDialog />
					<Button
						asChild
						variant='ghost'
						className='justify-start text-white hover:bg-gray-800'
					>
						<Link href='/profile'>
							<UserCircle className='mr-2 h-5 w-5' />
							Profile
						</Link>
					</Button>
				</nav>
			</div>
		</div>
	);
}
