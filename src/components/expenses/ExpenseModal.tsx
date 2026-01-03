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
import { Category, Expense, ExpenseInput } from '@/lib/services';
import { useCreateExpense, useUpdateExpense } from '@/hooks/useExpenses';
import { Calendar, Check, Clock, Plus, Search, X } from 'lucide-react';
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
	const navigate = useNavigate();
	const createExpense = useCreateExpense();
	const updateExpense = useUpdateExpense();
	const [selectedCurrency, setSelectedCurrency] = useState(() => {
		return (
			expense?.currency || localStorage.getItem('preferredCurrency') || 'USD'
		);
	});
	const [formData, setFormData] = useState<ExpenseInput>(() => {
		const now = new Date();
		let dateValue = '';

		if (expense?.date) {
			// Parse the ISO date string and convert to local date
			const expenseDate = new Date(expense.date);
			const year = expenseDate.getFullYear();
			const month = String(expenseDate.getMonth() + 1).padStart(2, '0');
			const day = String(expenseDate.getDate()).padStart(2, '0');
			dateValue = `${year}-${month}-${day}`;
		} else {
			// Use current local date
			const year = now.getFullYear();
			const month = String(now.getMonth() + 1).padStart(2, '0');
			const day = String(now.getDate()).padStart(2, '0');
			dateValue = `${year}-${month}-${day}`;
		}

		return {
			title: expense?.title || '',
			amount: expense?.amount || 0,
			currency: expense?.currency || selectedCurrency,
			categoryId: expense?.category
				? typeof expense.category === 'string'
					? expense.category
					: expense.category.id
				: '',
			description: expense?.description || '',
			date: dateValue,
		};
	});
	const [time, setTime] = useState(() => {
		if (expense?.date) {
			// Parse the ISO date string and get local time
			const date = new Date(expense.date);
			const hours = String(date.getHours()).padStart(2, '0');
			const minutes = String(date.getMinutes()).padStart(2, '0');
			return `${hours}:${minutes}`;
		}
		// Use current local time
		const now = new Date();
		const hours = String(now.getHours()).padStart(2, '0');
		const minutes = String(now.getMinutes()).padStart(2, '0');
		return `${hours}:${minutes}`;
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState('');
	const [categorySearch, setCategorySearch] = useState('');

	const filteredCategories = categories.filter(category =>
		category.name.toLowerCase().includes(categorySearch.toLowerCase())
	);

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
			// Combine date and time into ISO string using local timezone
			let dateTime: string | undefined;

			if (formData.date && time) {
				// Create a date object in local timezone
				const [year, month, day] = formData.date.split('-').map(Number);
				const [hours, minutes] = time.split(':').map(Number);
				const localDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
				// Convert to ISO string (which will be in UTC)
				dateTime = localDate.toISOString();
			} else if (formData.date) {
				// Only date provided, use current time
				const [year, month, day] = formData.date.split('-').map(Number);
				const now = new Date();
				const localDate = new Date(
					year,
					month - 1,
					day,
					now.getHours(),
					now.getMinutes(),
					0,
					0
				);
				dateTime = localDate.toISOString();
			} else {
				// No date provided, use current date and time
				dateTime = new Date().toISOString();
			}

			const submitData = {
				...formData,
				date: dateTime,
			};

			if (expense) {
				await updateExpense.mutateAsync({ id: expense.id, data: submitData });
			} else {
				await createExpense.mutateAsync(submitData);
			}
			// Close modal after successful mutation
			onClose();
			onSuccess();
		} catch (err: unknown) {
			// Error handling is done in the mutation hooks
			// Only set local error for display purposes
			if (err && typeof err === 'object' && 'response' in err) {
				const axiosError = err as {
					response?: { data?: { message?: string } };
				};
				if (axiosError.response?.data?.message !== 'Unauthorized') {
					setError(
						axiosError.response?.data?.message || 'Failed to save expense'
					);
				}
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
			className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-in fade-in duration-200 !m-0"
			onClick={handleBackdropClick}
		>
			<div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 [scrollbar-gutter:stable]">
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
							onValueChange={value => {
								setFormData({ ...formData, categoryId: value });
								setCategorySearch(''); // Reset search when category is selected
							}}
							disabled={isSubmitting}
							onOpenChange={open => {
								if (!open) setCategorySearch(''); // Reset search when dropdown closes
							}}
						>
							<SelectTrigger id="category">
								<SelectValue placeholder="Select a category" />
							</SelectTrigger>
							<SelectContent
								className="max-h-[320px]"
								position="popper"
								side="bottom"
								sideOffset={4}
								align="start"
							>
								<div className="sticky top-0 z-10 bg-popover p-2 border-b">
									<div className="relative">
										<Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
										<Input
											type="text"
											placeholder="Search categories..."
											value={categorySearch}
											onChange={e => setCategorySearch(e.target.value)}
											className="pl-8 h-9 text-sm"
											onKeyDown={e => e.stopPropagation()} // Prevent select from closing on keydown
										/>
									</div>
								</div>
								<div className="max-h-[200px] overflow-y-auto">
									{filteredCategories.length > 0 ? (
										filteredCategories.map(category => (
											<SelectItem key={category.id} value={category.id}>
												<span className="flex items-center gap-2">
													{category.icon && <span>{category.icon}</span>}
													{category.name}
												</span>
											</SelectItem>
										))
									) : (
										<div className="px-2 py-6 text-center text-sm text-muted-foreground">
											No categories found
										</div>
									)}
								</div>
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
								</div>
							</SelectContent>
						</Select>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="date" className="text-sm font-medium">
								Date (Optional)
							</Label>
							<div className="relative">
								<Input
									id="date"
									type="date"
									value={formData.date}
									onChange={e =>
										setFormData({ ...formData, date: e.target.value })
									}
									disabled={isSubmitting}
									placeholder="Current date"
									className="pr-10 cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
								/>
								<Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
							</div>
							<p className="text-xs text-muted-foreground">
								Defaults to current date if not provided
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="time" className="text-sm font-medium">
								Time (Optional)
							</Label>
							<div className="relative">
								<Input
									id="time"
									type="time"
									value={time}
									onChange={e => setTime(e.target.value)}
									disabled={isSubmitting}
									placeholder="Current time"
									className="pr-10 cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
								/>
								<Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
							</div>
							<p className="text-xs text-muted-foreground">
								Defaults to current time if not provided
							</p>
						</div>
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

					<div className="flex justify-between items-center pt-6">
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
									: expense
										? 'Update Expense'
										: 'Add Expense'
							}
						>
							<Check className="h-11 w-11" strokeWidth={3} />
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};
