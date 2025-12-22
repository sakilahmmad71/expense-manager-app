import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Category } from '@/lib/services';
import { useCreateCategory, useUpdateCategory } from '@/hooks/useCategories';
import { useEffect, useState } from 'react';

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

	useEffect(() => {
		if (isOpen) {
			// Calculate scrollbar width before hiding
			const scrollbarWidth =
				window.innerWidth - document.documentElement.clientWidth;
			document.documentElement.style.setProperty(
				'--scrollbar-width',
				`${scrollbarWidth}px`
			);

			// Add modal-open class instead of inline style
			document.body.classList.add('modal-open');

			const handleEscape = (e: KeyboardEvent) => {
				if (e.key === 'Escape') onClose();
			};
			window.addEventListener('keydown', handleEscape);
			return () => {
				document.body.classList.remove('modal-open');
				document.documentElement.style.removeProperty('--scrollbar-width');
				window.removeEventListener('keydown', handleEscape);
			};
		}
	}, [isOpen, onClose]);

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

	const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) onClose();
	};

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-in fade-in duration-200"
			onClick={handleBackdropClick}
		>
			<div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
				<div className="p-6 border-b sticky top-0 bg-white z-10">
					<h2 className="text-2xl font-bold">
						{category ? 'Edit Category' : 'Add New Category'}
					</h2>
				</div>

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

					<div className="flex gap-3 pt-4 sticky bottom-0 bg-white border-t -mx-6 px-6 py-4 mt-6">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							className="flex-1"
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button type="submit" className="flex-1" disabled={isSubmitting}>
							{isSubmitting
								? 'Saving...'
								: category
									? 'Update Category'
									: 'Create Category'}
						</Button>
					</div>
				</form>
			</div>

			<style>{`
				@keyframes fadeIn {
					from { opacity: 0; }
					to { opacity: 1; }
				}
				@keyframes slideUp {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
			`}</style>
		</div>
	);
};
