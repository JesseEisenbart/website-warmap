'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddColorModalProps {
	isOpen: boolean;
	onClose: () => void;
	onAddColor: (name: string, color: string) => void;
}

export function AddColorModal({
	isOpen,
	onClose,
	onAddColor,
}: AddColorModalProps) {
	const [colorName, setColorName] = useState('');
	const [selectedColor, setSelectedColor] = useState('#4f4ce5');
	const [isCustomColor, setIsCustomColor] = useState(true);

	if (!isOpen) return null;

	const presetColors = [
		{ name: 'Blue', color: '#2563eb' },
		{ name: 'Green', color: '#16a34a' },
		{ name: 'Red', color: '#dc2626' },
		{ name: 'Purple', color: '#9333ea' },
		{ name: 'Orange', color: '#ea580c' },
		{ name: 'Pink', color: '#db2777' },
		{ name: 'Teal', color: '#0d9488' },
		{ name: 'Yellow', color: '#ca8a04' },
	];

	const handleSelectPreset = (color: string) => {
		setSelectedColor(color);
		setIsCustomColor(false);
	};

	const handleCustomColorChange = (color: string) => {
		setSelectedColor(color);
		setIsCustomColor(true);
	};

	const handleSubmit = () => {
		if (colorName.trim()) {
			onAddColor(colorName, selectedColor);
			setColorName('');
			setSelectedColor('#4f4ce5');
			setIsCustomColor(true);
			onClose();
		}
	};

	return (
		<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
			<div className='bg-white rounded-lg shadow-lg w-[400px] max-w-[90vw]'>
				<div className='flex justify-between items-center p-4 border-b'>
					<h2 className='text-lg font-medium'>Add New Color</h2>
					<button
						onClick={onClose}
						className='text-gray-500 hover:text-gray-700'
					>
						<X size={18} />
					</button>
				</div>

				<div className='p-4 space-y-4'>
					{/* Label input */}
					<div className='space-y-2'>
						<label
							htmlFor='colorName'
							className='block text-sm font-medium'
						>
							Label
						</label>
						<Input
							id='colorName'
							value={colorName}
							onChange={(e) => setColorName(e.target.value)}
							placeholder='Enter a name for this color'
							className='w-full'
						/>
					</div>

					{/* Preset colors */}
					<div className='space-y-2'>
						<label className='block text-sm font-medium'>
							Preset Colors
						</label>
						<div className='grid grid-cols-4 gap-2'>
							{presetColors.map((preset, index) => (
								<div
									key={index}
									onClick={() =>
										handleSelectPreset(preset.color)
									}
									className={cn(
										'flex flex-col items-center p-2 rounded cursor-pointer border transition-all',
										selectedColor === preset.color &&
											!isCustomColor
											? 'border-blue-500 bg-blue-50'
											: 'border-gray-200 hover:border-gray-300'
									)}
								>
									<div
										className='h-8 w-8 rounded-full mb-1'
										style={{
											backgroundColor: preset.color,
										}}
									/>
									<span className='text-xs'>
										{preset.name}
									</span>
								</div>
							))}
						</div>
					</div>

					{/* Custom color picker */}
					<div className='space-y-2'>
						<label
							htmlFor='colorPicker'
							className='block text-sm font-medium'
						>
							Custom Color
						</label>
						<div
							className={cn(
								'flex items-center gap-2 p-3 rounded border transition-all',
								isCustomColor
									? 'border-blue-500 bg-blue-50'
									: 'border-gray-200'
							)}
						>
							<input
								type='color'
								id='colorPicker'
								value={selectedColor}
								onChange={(e) =>
									handleCustomColorChange(e.target.value)
								}
								className='w-10 h-10 p-0 border-0 rounded cursor-pointer'
							/>
							<Input
								value={selectedColor}
								onChange={(e) =>
									handleCustomColorChange(e.target.value)
								}
								className='flex-grow'
								onClick={() => setIsCustomColor(true)}
							/>
						</div>
					</div>

					{/* Preview */}
					<div className='space-y-2'>
						<label className='block text-sm font-medium'>
							Preview
						</label>
						<div className='flex items-center gap-2 p-2 rounded border'>
							<div
								className='h-5 w-5 rounded'
								style={{ backgroundColor: selectedColor }}
							/>
							<span className='text-sm'>
								{isCustomColor
									? 'Custom Color'
									: presetColors.find(
											(p) => p.color === selectedColor
									  )?.name || 'Custom Color'}
							</span>
						</div>
					</div>
				</div>

				<div className='flex justify-end gap-2 p-4 border-t'>
					<Button variant='outline' onClick={onClose}>
						Cancel
					</Button>
					<Button onClick={handleSubmit}>Add Color</Button>
				</div>
			</div>
		</div>
	);
}
