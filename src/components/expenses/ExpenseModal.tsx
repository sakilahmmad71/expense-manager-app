import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Category, Expense, expenseAPI, ExpenseInput } from '@/lib/services';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ExpenseModalProps {
	expense: Expense | null;
	categories: Category[];
	onClose: () => void;
	onSuccess: () => void;
}

export const ExpenseModal = ({
	expense,
	categories,
	onClose,
	onSuccess,
}: ExpenseModalProps) => {
	const { toast } = useToast();
	const navigate = useNavigate();
	const [selectedCurrency, setSelectedCurrency] = useState(() => {
		return (
			expense?.currency || localStorage.getItem('preferredCurrency') || 'USD'
		);
	});
	const [formData, setFormData] = useState<ExpenseInput>({
		title: expense?.title || '',
		amount: expense?.amount || 0,
		currency: expense?.currency || selectedCurrency,
		categoryId: expense?.category
			? typeof expense.category === 'string'
				? expense.category
				: expense.category.id
			: '',
		description: expense?.description || '',
		date: expense?.date
			? expense.date.split('T')[0]
			: new Date().toISOString().split('T')[0],
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState('');

	const currencies = [
		{ code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
		{ code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
		{ code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
		{ code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
		{ code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
		{ code: 'EUR', symbol: '€', name: 'Euro' },
		{ code: 'GBP', symbol: '£', name: 'British Pound' },
		{ code: 'INR', symbol: '₹', name: 'Indian Rupee' },
		{ code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
		{ code: 'USD', symbol: '$', name: 'US Dollar' },
	];

	const handleCurrencyChange = (currency: string) => {
		setSelectedCurrency(currency);
		setFormData({ ...formData, currency });
		localStorage.setItem('preferredCurrency', currency);
	};

	// Prevent background scroll when modal is open
	useEffect(() => {
		// Calculate scrollbar width before hiding
		const scrollbarWidth =
			window.innerWidth - document.documentElement.clientWidth;
		document.documentElement.style.setProperty(
			'--scrollbar-width',
			`${scrollbarWidth}px`
		);

		// Add modal-open class instead of inline style
		document.body.classList.add('modal-open');

		// Close modal on Escape key
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};

		window.addEventListener('keydown', handleEscape);

		return () => {
			document.body.classList.remove('modal-open');
			document.documentElement.style.removeProperty('--scrollbar-width');
			window.removeEventListener('keydown', handleEscape);
		};
	}, [onClose]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setIsSubmitting(true);

		try {
			if (expense) {
				await expenseAPI.update(expense.id, formData);
				toast({
					variant: 'success',
					title: '✓ Expense updated',
					description: `"${formData.title}" has been updated successfully.`,
				});
			} else {
				await expenseAPI.create(formData);
				toast({
					variant: 'success',
					title: '✓ Expense created',
					description: `"${formData.title}" has been added successfully.`,
				});
			}
			onSuccess();
		} catch (err: unknown) {
			if (err && typeof err === 'object' && 'response' in err) {
				const axiosError = err as {
					response?: { data?: { message?: string } };
				};
				if (axiosError.response?.data?.message === 'Unauthorized') {
					toast({
						variant: 'destructive',
						title: '✗ Session expired',
						description: 'Please log in again.',
					});
					navigate('/login');
				} else {
					setError(
						axiosError.response?.data?.message || 'Failed to save expense'
					);
				}
			} else {
				setError('Failed to save expense');
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	return (
		<div
			className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-in fade-in duration-200"
			onClick={handleBackdropClick}
		>
			<div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
				<div className="p-6 border-b sticky top-0 bg-white z-10">
					<h2 className="text-2xl font-bold">
						{expense ? 'Edit Expense' : 'Add New Expense'}
					</h2>
				</div>

				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					{error && (
						<div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
							{error}
						</div>
					)}

					<div className="space-y-2">
						<Label htmlFor="title">
							Title <span className="text-red-500">*</span>
						</Label>
						<Input
							id="title"
							placeholder="e.g., Coffee at Starbucks"
							value={formData.title}
							onChange={e =>
								setFormData({ ...formData, title: e.target.value })
							}
							required
							disabled={isSubmitting}
						/>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="amount" className="text-sm">
								Amount <span className="text-red-500">*</span>
							</Label>
							<Input
								id="amount"
								type="number"
								step="0.01"
								placeholder="0.00"
								value={formData.amount || ''}
								onChange={e =>
									setFormData({
										...formData,
										amount: parseFloat(e.target.value),
									})
								}
								required
								disabled={isSubmitting}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="currency" className="text-sm">
								Currency <span className="text-red-500">*</span>
							</Label>
							<Select
								value={selectedCurrency}
								onValueChange={handleCurrencyChange}
								disabled={isSubmitting}
							>
								<SelectTrigger id="currency">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{currencies.map(currency => (
										<SelectItem key={currency.code} value={currency.code}>
											{currency.symbol} {currency.code} - {currency.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="category">
							Category <span className="text-red-500">*</span>
						</Label>
						<Select
							value={formData.categoryId}
							onValueChange={value =>
								setFormData({ ...formData, categoryId: value })
							}
							disabled={isSubmitting}
						>
							<SelectTrigger id="category">
								<SelectValue placeholder="Select a category" />
							</SelectTrigger>
							<SelectContent>
								{categories.map(category => (
									<SelectItem key={category.id} value={category.id}>
										<span className="flex items-center gap-2">
											{category.icon && <span>{category.icon}</span>}
											{category.name}
										</span>
									</SelectItem>
								))}{' '}
								<div className="border-t mt-1 pt-1">
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => navigate('/categories')}
										className="w-full justify-start text-sm font-normal text-primary hover:text-primary hover:bg-primary/10"
									>
										<Plus className="h-4 w-4 mr-2" />
										Add New Category
									</Button>
								</div>{' '}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="date">
							Date <span className="text-red-500">*</span>
						</Label>
						<Input
							id="date"
							type="date"
							value={formData.date}
							onChange={e => setFormData({ ...formData, date: e.target.value })}
							required
							disabled={isSubmitting}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description (Optional)</Label>
						<Textarea
							id="description"
							placeholder="Add any additional details..."
							value={formData.description}
							onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
								setFormData({ ...formData, description: e.target.value })
							}
							rows={3}
							disabled={isSubmitting}
						/>
					</div>

					<div className="flex gap-3 pt-4">
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
								: expense
									? 'Update Expense'
									: 'Add Expense'}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};
