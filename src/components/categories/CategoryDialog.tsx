import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { useCreateCategory, useUpdateCategory } from '@/hooks/useCategories';
import { Category } from '@/lib/services';
import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CategoryDialogProps {
	category: Category | null;
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

const commonEmojis = [
	'🍔', // Food & Dining
	'🚗', // Transportation
	'🛒', // Groceries/Shopping
	'🎬', // Entertainment
	'💡', // Bills & Utilities
	'🏥', // Healthcare
	'📱', // Electronics/Phone
	'✈️', // Travel
	'🏠', // Home/Rent
	'📚', // Education
	'💼', // Business/Work
	'🎮', // Gaming
	'☕', // Coffee/Cafe
	'🍕', // Fast Food
	'🥗', // Healthy Food
	'🚕', // Taxi/Ride
	'⛽', // Gas/Fuel
	'🚌', // Public Transport
	'🛍️', // Shopping
	'👕', // Clothing
	'👟', // Shoes
	'💄', // Beauty/Cosmetics
	'💆', // Personal Care
	'🏋️', // Fitness/Gym
	'🎵', // Music
	'📺', // TV/Streaming
	'🎨', // Art/Hobbies
	'🐕', // Pet Care
	'🌳', // Nature/Outdoor
	'🔧', // Maintenance/Repair
	'🧹', // Cleaning
	'💳', // Credit Card/Payment
	'💰', // Money/Finance
	'🎁', // Gifts
	'🎉', // Party/Events
	'🏨', // Hotel
	'🍷', // Wine/Bar
	'🌮', // Restaurant
	'🚰', // Water/Utilities
	'⚡', // Electricity
	'📡', // Internet
	'📞', // Phone Bill
	'💊', // Medicine
	'🩺', // Doctor
	'🦷', // Dental
	'👓', // Optical
	'📖', // Books
	'✏️', // Stationery
	'🎓', // School/Course
	'🖥️', // Computer
	'⌚', // Watch/Accessories
	'🎧', // Audio
	'📷', // Photography
	'🎯', // Goals/Target
	'📌', // Other/Misc
	'🔖', // Subscription
	'💼', // Office
	'🏦', // Banking
	'🚲', // Bicycle
	'🏃', // Sports
];

export const CategoryDialog = ({
	category,
	isOpen,
	onClose,
	onSuccess,
}: CategoryDialogProps) => {
	const createCategory = useCreateCategory();
	const updateCategory = useUpdateCategory();
	const [formData, setFormData] = useState({
		name: category?.name || '',
		color: category?.color || '#3b82f6',
		icon: category?.icon || '',
	});

	// Keep local copy so close animation can run even if parent clears `category`
	const [localCategory, setLocalCategory] = useState<Category | null>(
		category || null
	);

	useEffect(() => {
		if (isOpen && category) {
			setLocalCategory(category);
		}
		if (!isOpen) {
			const t = window.setTimeout(() => setLocalCategory(null), 300);
			return () => window.clearTimeout(t);
		}
	}, [isOpen, category]);

	// Ensure body scroll is restored when dialog closes (mobile fix)
	useEffect(() => {
		if (!isOpen) {
			// Force restore scroll on mobile browsers
			document.body.style.overflow = 'auto';
			document.body.style.position = 'relative';
			document.documentElement.style.overflow = 'auto';
		}
	}, [isOpen]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		if (isOpen) {
			setFormData({
				name: category?.name || '',
				color: category?.color || '#3b82f6',
				icon: category?.icon || '',
			});
			setError('');
		}
	}, [category, isOpen]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setIsSubmitting(true);

		try {
			if (localCategory) {
				await updateCategory.mutateAsync({
					id: localCategory.id,
					data: formData,
				});
			} else {
				await createCategory.mutateAsync(formData);
			}
			// Close modal after successful mutation
			onClose();
			onSuccess();
		} catch (err: unknown) {
			const errorMessage =
				typeof err === 'object' &&
				err !== null &&
				'response' in err &&
				typeof err.response === 'object' &&
				err.response !== null &&
				'data' in err.response &&
				typeof err.response.data === 'object' &&
				err.response.data !== null &&
				'error' in err.response.data
					? String(err.response.data.error)
					: 'Failed to save category';
			setError(errorMessage);
			toast.error('Failed to save category', {
				description: errorMessage,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			onClose();
		}
	};

	if (!localCategory && !isOpen) return null;

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col p-0">
				<DialogHeader className="border-b flex-shrink-0 px-4 md:px-6 pt-3 md:pt-6 pb-2 md:pb-4">
					<DialogTitle className="text-xl md:text-2xl font-bold">
						{localCategory ? 'Edit Category' : 'Add New Category'}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
					<ScrollArea className="flex-1 px-4 md:px-6 overflow-y-auto">
						<div className="py-3 md:py-6 space-y-3 md:space-y-4 pb-3 md:pb-4">
							{error && (
								<div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
									{error}
								</div>
							)}

							<div className="space-y-1.5">
								<Label htmlFor="name">
									Category Name <span className="text-red-500">*</span>
								</Label>
								<Input
									id="name"
									value={formData.name}
									onChange={e =>
										setFormData({ ...formData, name: e.target.value })
									}
									placeholder="e.g., Food, Transport, Entertainment"
									maxLength={100}
									required
									disabled={isSubmitting}
								/>
								<p className="text-[10px] md:text-xs text-muted-foreground">
									{formData.name.length}/100 characters
								</p>
							</div>

							<div className="space-y-1.5">
								<Label htmlFor="color">
									Color <span className="text-red-500">*</span>
								</Label>
								<div className="flex gap-3 items-center">
									<Input
										type="color"
										id="color"
										value={formData.color}
										onChange={e =>
											setFormData({ ...formData, color: e.target.value })
										}
										className="flex-1"
										disabled={isSubmitting}
									/>
								</div>
							</div>

							<div className="space-y-1.5">
								<Label htmlFor="icon">Icon (Emoji)</Label>
								<Input
									id="icon"
									value={formData.icon}
									onChange={e =>
										setFormData({ ...formData, icon: e.target.value })
									}
									placeholder="Pick an emoji"
									className={formData.icon ? 'text-2xl' : 'placeholder:text-sm'}
									maxLength={2}
									disabled={isSubmitting}
								/>
								<div className="grid grid-cols-8 gap-1.5 md:gap-2 p-2 md:p-3 bg-gray-50 rounded-md max-h-40 md:max-h-48 overflow-y-auto">
									{commonEmojis.map(emoji => (
										<button
											key={emoji}
											type="button"
											onClick={() => setFormData({ ...formData, icon: emoji })}
											className="text-xl md:text-2xl hover:bg-gray-200 rounded-md p-1.5 md:p-2 transition-colors"
											disabled={isSubmitting}
										>
											{emoji}
										</button>
									))}
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex justify-between items-center pt-3 md:pt-6 mt-1 md:mt-2 border-t pb-1 md:pb-2">
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												type="button"
												onClick={onClose}
												className="h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 rounded-full bg-gray-500/10 hover:bg-gray-500/20 text-gray-600 border-2 border-gray-500/30 hover:border-gray-500/50 backdrop-blur-sm shadow-xl transition-all hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
												disabled={isSubmitting}
											>
												<X
													className="h-8 w-8 md:h-10 md:w-10 lg:h-11 lg:w-11"
													strokeWidth={3}
												/>
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>Cancel</p>
										</TooltipContent>
									</Tooltip>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												type="submit"
												className="h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 rounded-full bg-green-500/10 hover:bg-green-500/20 text-green-600 border-2 border-green-500/30 hover:border-green-500/50 backdrop-blur-sm shadow-xl transition-all hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
												disabled={isSubmitting}
											>
												<Check
													className="h-8 w-8 md:h-10 md:w-10 lg:h-11 lg:w-11"
													strokeWidth={3}
												/>
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>
												{isSubmitting
													? 'Saving...'
													: localCategory
														? 'Update Category'
														: 'Add Category'}
											</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
						</div>
					</ScrollArea>
				</form>
			</DialogContent>
		</Dialog>
	);
};
