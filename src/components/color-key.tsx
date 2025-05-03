'use client';

import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { useColors } from '@/contexts/ColorContext';
import { AddColorModal } from './add-color-modal';

export function ColorKey() {
	const { colors, addColor, setActiveColor, activeColor } = useColors();
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	const handleColorSelect = (color: string) => {
		setActiveColor(color === activeColor ? null : color);
	};

	const handleAddColor = (name: string, color: string) => {
		addColor({
			name,
			color,
		});
	};

	return (
		<div className='rounded-lg border p-4 sticky top-6'>
			<h3 className='mb-4 font-medium'>Key</h3>

			<div className='mb-4'>
				<h4 className='mb-2 text-sm font-medium'>Custom Colors</h4>
				<div className='space-y-2'>
					{colors.map((color, index) => (
						<div
							key={index}
							className={cn(
								'flex items-center gap-2 p-2 rounded cursor-pointer',
								activeColor === color.color ? 'bg-gray-100' : ''
							)}
							onClick={() => handleColorSelect(color.color)}
						>
							<div
								className={cn(
									'h-5 w-5 rounded',
									color.color === 'purple'
										? 'bg-purple-600'
										: color.color === 'blue'
										? 'bg-blue-600'
										: ''
								)}
								style={
									color.color.startsWith('#')
										? { backgroundColor: color.color }
										: {}
								}
							/>
							<span className='text-sm'>{color.name}</span>
						</div>
					))}
				</div>
			</div>

			<div className='mb-4'>
				<Button
					variant='outline'
					onClick={() => setIsAddModalOpen(true)}
					className='w-full text-sm'
					size='sm'
				>
					<PlusIcon className='h-4 w-4 mr-2' />
					Add New Color
				</Button>
			</div>

			<div className='mt-4 text-xs text-gray-500'>
				<p>Tip: Select days and click a color to apply it.</p>
				<p>Hold Shift to select a range of days.</p>
			</div>

			<AddColorModal
				isOpen={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				onAddColor={handleAddColor}
			/>
		</div>
	);
}
