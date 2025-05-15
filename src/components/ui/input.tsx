import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
	customSize?: 'sm' | 'md' | 'lg';
}

function Input({ className, type, customSize, ...props }: InputProps) {
	return (
		<input
			type={type}
			data-slot='input'
			className={cn(
				'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
				'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
				'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
				customSize === 'sm' && 'h-7 text-xs py-0 px-2',
				customSize === 'lg' && 'h-11 text-base py-2 px-4',
				(customSize === undefined || customSize === 'md') && 'h-9', // Default 'md' size
				className
			)}
			{...props}
		/>
	);
}

export { Input };
