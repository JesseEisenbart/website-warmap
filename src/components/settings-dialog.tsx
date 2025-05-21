'use client';

import { useState } from 'react';
import {
	Settings,
	User,
	Home,
	Layers,
	Bell,
	Palette,
	Info,
	Sliders,
	Users,
	Edit,
	Copy,
} from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogTrigger,
	DialogClose,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export function SettingsDialog() {
	const [activeTab, setActiveTab] = useState('profile');

	const tabs = [
		{
			id: 'general',
			label: 'General',
			icon: <Settings className='h-4 w-4' />,
		},
		{ id: 'profile', label: 'Profile', icon: <User className='h-4 w-4' /> },
		{ id: 'home', label: 'Home', icon: <Home className='h-4 w-4' /> },
		{
			id: 'integrations',
			label: 'Integrations',
			icon: <Layers className='h-4 w-4' />,
		},
		{
			id: 'notifications',
			label: 'Notifications',
			icon: <Bell className='h-4 w-4' />,
		},
		{
			id: 'appearance',
			label: 'Appearance',
			icon: <Palette className='h-4 w-4' />,
		},
		{ id: 'about', label: 'About', icon: <Info className='h-4 w-4' /> },
	];

	const workspaceTabs = [
		{
			id: 'preferences',
			label: 'Preferences',
			icon: <Sliders className='h-4 w-4' />,
		},
		{
			id: 'members',
			label: 'Members',
			icon: <Users className='h-4 w-4' />,
		},
	];

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant='ghost'
					className='justify-start text-white hover:bg-gray-800'
				>
					<Settings className='mr-2 h-5 w-5' />
					Settings
				</Button>
			</DialogTrigger>
			<DialogContent className='p-0 max-w-3xl h-[80vh] flex overflow-hidden'>
				<DialogTitle className='sr-only'>Settings</DialogTitle>
				{/* Sidebar */}
				<div className='w-[200px] border-r flex flex-col overflow-y-auto'>
					<div className='p-4'>
						{tabs.map((tab) => (
							<button
								key={tab.id}
								className={cn(
									'flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-sm mb-1 text-sm',
									activeTab === tab.id
										? 'bg-slate-100 font-medium'
										: 'hover:bg-slate-50'
								)}
								onClick={() => setActiveTab(tab.id)}
							>
								{tab.icon}
								{tab.label}
							</button>
						))}
					</div>

					<Separator className='my-2' />

					<div className='p-4'>
						<div className='uppercase text-xs font-medium text-gray-500 mb-2 px-2'>
							Workspace
						</div>
						{workspaceTabs.map((tab) => (
							<button
								key={tab.id}
								className={cn(
									'flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-sm mb-1 text-sm',
									activeTab === tab.id
										? 'bg-slate-100 font-medium'
										: 'hover:bg-slate-50'
								)}
								onClick={() => setActiveTab(tab.id)}
							>
								{tab.icon}
								{tab.label}
							</button>
						))}
					</div>

					<div className='mt-auto p-4'>
						<DialogClose asChild>
							<Button
								variant='ghost'
								size='sm'
								className='w-full justify-start text-sm'
							>
								<span className='flex items-center'>
									← Sign Out
								</span>
							</Button>
						</DialogClose>
					</div>
				</div>

				{/* Content Area */}
				<div className='flex-1 p-6 overflow-y-auto'>
					{activeTab === 'profile' && (
						<div className='space-y-6'>
							<div>
								<h2 className='text-lg font-medium'>Profile</h2>
								<p className='text-sm text-muted-foreground mt-1'>
									YOUR PROFILE
								</p>
							</div>

							<div className='flex items-center gap-4'>
								<div className='w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-orange-300 flex items-center justify-center text-white'>
									<span className='text-lg font-medium'>
										Sam
									</span>
								</div>

								<div className='flex gap-2'>
									<Button variant='ghost' size='sm'>
										<User className='h-4 w-4 mr-2' />
										<span className='sr-only'>
											Change avatar
										</span>
									</Button>
									<Button variant='ghost' size='sm'>
										<Edit className='h-4 w-4' />
										<span className='sr-only'>Edit</span>
									</Button>
								</div>

								<div>
									<div className='font-medium'>Sam</div>
									<div className='text-xs text-orange-500 flex items-center gap-1'>
										<div className='w-2 h-2 bg-orange-500 rounded-full'></div>
										CLAY
									</div>
								</div>
							</div>

							<div className='space-y-4'>
								<div>
									<h3 className='text-sm font-medium mb-2'>
										PUBLIC PROFILE
									</h3>
									<div className='border rounded-md p-4 bg-slate-50'>
										<div className='flex justify-between items-center'>
											<span>Enable Public Profile</span>
											<div className='w-10 h-5 bg-blue-500 rounded-full relative p-0.5'>
												<div className='absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full'></div>
											</div>
										</div>
										<p className='text-xs text-gray-500 mt-1'>
											Enable your public profile and share
											it with anyone inside and outside of
											Clay.
											<a
												href='#'
												className='text-blue-500 ml-1'
											>
												Learn more.
											</a>
										</p>
									</div>
								</div>

								<div>
									<h3 className='text-sm font-medium mb-2'>
										PROFILE URL
									</h3>
									<div className='border rounded-md p-4 flex items-center gap-2'>
										<div className='flex-grow text-sm'>
											clay.earth/profile/
											<span className='text-gray-500'>
												slmobbin
											</span>
										</div>
										<Button
											variant='ghost'
											size='sm'
											className='px-2'
										>
											<Copy className='h-4 w-4' />
										</Button>
									</div>
									<div className='text-xs text-gray-500 mt-1'>
										Set a custom URL for your public
										profile.
										<a
											href='#'
											className='text-blue-500 ml-1'
										>
											Learn more.
										</a>
									</div>
								</div>

								<div>
									<h3 className='text-sm font-medium mb-2'>
										SUBSCRIPTION PLAN
									</h3>
									<div className='border rounded-md p-4 flex items-center'>
										<div className='h-8 w-8 bg-gradient-to-br from-purple-700 to-purple-500 rounded-md flex items-center justify-center text-white text-xs font-medium mr-3'>
											PRO
										</div>
										<div className='flex-grow'>
											Clay Pro
										</div>
										<Button variant='outline' size='sm'>
											Manage Plan
										</Button>
									</div>
								</div>

								<div>
									<h3 className='text-sm font-medium mb-2'>
										SWITCH PLAN
									</h3>
									<div className='flex gap-2'>
										<div className='flex-1 border rounded-md p-4'>
											<div className='font-medium'>
												Teams
											</div>
											<Button
												variant='ghost'
												size='sm'
												className='mt-2'
											>
												SWITCH
											</Button>
										</div>
										<div className='flex-1 border rounded-md p-4'>
											<div className='font-medium'>
												Personal
											</div>
											<Button
												variant='ghost'
												size='sm'
												className='mt-2'
											>
												SWITCH
											</Button>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'general' && (
						<div>
							<h2 className='text-lg font-medium'>
								General Settings
							</h2>
							<div className='mt-4 space-y-4'>
								<div className='space-y-2'>
									<h3 className='text-sm font-medium'>
										Language
									</h3>
									<div className='flex items-center justify-between'>
										<span className='text-sm text-gray-500'>
											Select your preferred language
										</span>
										<Button variant='outline' size='sm'>
											English
										</Button>
									</div>
								</div>

								<Separator />

								<div className='space-y-2'>
									<h3 className='text-sm font-medium'>
										Time Zone
									</h3>
									<div className='flex items-center justify-between'>
										<span className='text-sm text-gray-500'>
											Select your time zone
										</span>
										<Button variant='outline' size='sm'>
											UTC-5 (Eastern Time)
										</Button>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'appearance' && (
						<div>
							<h2 className='text-lg font-medium'>Appearance</h2>
							<div className='mt-4 space-y-4'>
								<div className='space-y-2'>
									<h3 className='text-sm font-medium'>
										Theme
									</h3>
									<div className='flex items-center justify-between'>
										<span className='text-sm text-gray-500'>
											Dark Mode
										</span>
										<Button variant='outline' size='sm'>
											Off
										</Button>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab !== 'profile' &&
						activeTab !== 'general' &&
						activeTab !== 'appearance' && (
							<div className='h-full flex items-center justify-center text-gray-400'>
								<div className='text-center'>
									<div className='text-lg mb-2'>
										{activeTab.charAt(0).toUpperCase() +
											activeTab.slice(1)}
									</div>
									<p className='text-sm'>
										This section is not implemented in the
										demo.
									</p>
								</div>
							</div>
						)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
