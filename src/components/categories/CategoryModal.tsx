import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Category } from '@/lib/services';
import { useCreateCategory, useUpdateCategory } from '@/hooks/useCategories';
import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from '@/components/ui/drawer';

interface CategoryModalProps {
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

export const CategoryModal = ({
	category,
	isOpen,
	onClose,
	onSuccess,
}: CategoryModalProps) => {
	const { toast } = useToast();
	const createCategory = useCreateCategory();
	const updateCategory = useUpdateCategory();
	const [formData, setFormData] = useState({
		name: category?.name || '',
		color: category?.color || '#3b82f6',
		icon: category?.icon || '',
	});
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
			if (category) {
				await updateCategory.mutateAsync({ id: category.id, data: formData });
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
			toast({
				variant: 'destructive',
				title: '✗ Failed to save category',
				description: errorMessage,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Drawer open={isOpen} onOpenChange={onClose} shouldScaleBackground={false}>
			<DrawerContent className="sm:max-w-lg md:max-w-xl mx-auto overflow-auto">
				<DrawerHeader className="border-b">
					<DrawerTitle className="text-2xl font-bold">
						{category ? 'Edit Category' : 'Add New Category'}
					</DrawerTitle>
				</DrawerHeader>

				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					{error && (
						<div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
							{error}
						</div>
					)}

					<div className="space-y-2">
						<Label htmlFor="name">
							Category Name <span className="text-red-500">*</span>
						</Label>
						<Input
							id="name"
							value={formData.name}
							onChange={e => setFormData({ ...formData, name: e.target.value })}
							placeholder="e.g., Food, Transport, Entertainment"
							required
							disabled={isSubmitting}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="color">
							Color <span className="text-red-500">*</span>
						</Label>
						<div className="flex gap-2">
							<Input
								id="color"
								type="color"
								value={formData.color}
								onChange={e =>
									setFormData({ ...formData, color: e.target.value })
								}
								className="w-20 h-10 cursor-pointer"
								disabled={isSubmitting}
							/>
							<Input
								type="text"
								value={formData.color}
								onChange={e =>
									setFormData({ ...formData, color: e.target.value })
								}
								placeholder="#3b82f6"
								className="flex-1"
								disabled={isSubmitting}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="icon">Icon (Emoji)</Label>
						<Input
							id="icon"
							value={formData.icon}
							onChange={e => setFormData({ ...formData, icon: e.target.value })}
							placeholder="Pick an emoji"
							className="text-2xl"
							maxLength={2}
							disabled={isSubmitting}
						/>
						<div className="grid grid-cols-8 gap-2 p-3 bg-gray-50 rounded-md max-h-48 overflow-y-auto">
							{commonEmojis.map(emoji => (
								<button
									key={emoji}
									type="button"
									onClick={() => setFormData({ ...formData, icon: emoji })}
									className={`text-2xl p-2 rounded hover:bg-gray-200 transition ${
										formData.icon === emoji
											? 'bg-gray-200 ring-2 ring-blue-500'
											: ''
									}`}
									disabled={isSubmitting}
								>
									{emoji}
								</button>
							))}
						</div>
					</div>

					<div className="flex justify-between items-center pt-6 sticky bottom-0 bg-white border-t -mx-6 px-6 py-4 mt-6">
						<Button
							type="button"
							onClick={onClose}
							className="h-16 w-16 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-600 border-2 border-red-500/30 hover:border-red-500/50 backdrop-blur-sm shadow-xl transition-all hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
							disabled={isSubmitting}
							title="Cancel"
						>
							<X className="h-11 w-11" strokeWidth={3} />
						</Button>
						<Button
							type="submit"
							className="h-16 w-16 rounded-full bg-green-500/10 hover:bg-green-500/20 text-green-600 border-2 border-green-500/30 hover:border-green-500/50 backdrop-blur-sm shadow-xl transition-all hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
							disabled={isSubmitting}
							title={
								isSubmitting
									? 'Saving...'
									: category
										? 'Update Category'
										: 'Create Category'
							}
						>
							<Check className="h-11 w-11" strokeWidth={3} />
						</Button>
					</div>
				</form>
			</DrawerContent>
		</Drawer>
	);
};
