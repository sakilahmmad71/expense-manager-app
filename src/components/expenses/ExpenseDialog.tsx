import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Combobox } from '@/components/ui/combobox';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { currencies } from '@/constants/currencies';
import { useCreateExpense, useUpdateExpense } from '@/hooks/useExpenses';
import { useCategories, CategoriesData } from '@/hooks/useCategories';
import { Expense, ExpenseInput } from '@/lib/services';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar, Check, Clock, Plus, X } from 'lucide-react';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ExpenseDialogProps {
	isOpen: boolean;
	expense: Expense | null;
	onClose: () => void;
	onSuccess: () => void;
}

export const ExpenseDialog = ({
	isOpen,
	expense,
	onClose,
	onSuccess,
}: ExpenseDialogProps) => {
	const navigate = useNavigate();
	const createExpense = useCreateExpense();
	const updateExpense = useUpdateExpense();
	const [localCategorySearch, setLocalCategorySearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');

	// Debounce server-side search (600ms delay)
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(localCategorySearch);
		}, 600);

		return () => clearTimeout(timer);
	}, [localCategorySearch]);

	// Fetch categories with debounced search
	const { data: categoriesData, isLoading: isLoadingCategories } =
		useCategories({
			page: 1,
			limit: 100,
			search: debouncedSearch,
		});

	const categories = useMemo(
		() => (categoriesData as CategoriesData | undefined)?.categories || [],
		[categoriesData]
	);

	// Handle local search change
	const handleCategorySearch = useCallback((query: string) => {
		setLocalCategorySearch(query);
	}, []);

	const [selectedCurrency, setSelectedCurrency] = useState(() => {
		return (
			expense?.currency || localStorage.getItem('preferredCurrency') || 'USD'
		);
	});

	const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
		if (expense?.date) {
			return new Date(expense.date);
		}
		return new Date();
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

		// Get last selected category from localStorage (only for new expenses)
		const lastCategoryId = !expense
			? localStorage.getItem('lastSelectedCategory') || ''
			: '';

		return {
			title: expense?.title || '',
			amount: expense?.amount || 0,
			currency: expense?.currency || selectedCurrency,
			categoryId: expense?.category
				? typeof expense.category === 'string'
					? expense.category
					: expense.category.id
				: lastCategoryId,
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

	// Keep local copy of expense so closing animation isn't interrupted
	const [localExpense, setLocalExpense] = useState<Expense | null>(
		expense || null
	);

	useEffect(() => {
		if (isOpen && expense) {
			setLocalExpense(expense);
		}
		if (!isOpen) {
			const t = window.setTimeout(() => setLocalExpense(null), 300);
			return () => window.clearTimeout(t);
		}
	}, [isOpen, expense]);

	// Ensure body scroll is restored when dialog closes (mobile fix)
	useEffect(() => {
		if (!isOpen) {
			// Force restore scroll on mobile browsers
			document.body.style.overflow = 'auto';
			document.body.style.position = 'relative';
			document.documentElement.style.overflow = 'auto';
		}
	}, [isOpen]);

	// Load last selected category from localStorage when opening for new expense
	useEffect(() => {
		if (isOpen && !expense) {
			const lastCategoryId = localStorage.getItem('lastSelectedCategory');
			if (lastCategoryId) {
				setFormData(prev => ({ ...prev, categoryId: lastCategoryId }));
			}
		}
	}, [isOpen, expense]);

	// Accordion state for mobile/desktop default behavior
	// On mobile, collapsed by default
	const [accordionValue, setAccordionValue] = useState<string>('');

	const categoryOptions = categories.map(category => ({
		value: category.id,
		label: category.name,
		icon: category.icon,
	}));

	const handleCurrencyChange = (currency: string) => {
		setSelectedCurrency(currency);
		setFormData({ ...formData, currency });
		localStorage.setItem('preferredCurrency', currency);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setIsSubmitting(true);

		try {
			// Combine date and time into ISO string using local timezone
			let dateTime: string | undefined;

			if (selectedDate && time) {
				// Create a date object in local timezone
				const [hours, minutes] = time.split(':').map(Number);
				const localDate = new Date(selectedDate);
				localDate.setHours(hours, minutes, 0, 0);
				dateTime = localDate.toISOString();
			} else if (selectedDate) {
				// Only date provided, use current time
				const now = new Date();
				const localDate = new Date(selectedDate);
				localDate.setHours(now.getHours(), now.getMinutes(), 0, 0);
				dateTime = localDate.toISOString();
			} else {
				// No date provided, use current date and time
				dateTime = new Date().toISOString();
			}

			const submitData = {
				...formData,
				date: dateTime,
			};

			if (localExpense) {
				await updateExpense.mutateAsync({
					id: localExpense.id,
					data: submitData,
				});
			} else {
				await createExpense.mutateAsync(submitData);
				// Save the selected category to localStorage for future use
				if (formData.categoryId) {
					localStorage.setItem('lastSelectedCategory', formData.categoryId);
				}
			}

			// Wait for parent to refetch data (this now waits for actual refetch to complete)
			await onSuccess();

			// Close dialog after data is fully refreshed
			onClose();
		} catch (err: unknown) {
			// Error handling is done in the mutation hooks
			// Only set local error for display purposes
			if (err && typeof err === 'object' && 'response' in err) {
				const axiosError = err as {
					response?: { data?: { error?: string } };
				};
				if (axiosError.response?.data?.error !== 'Unauthorized') {
					setError(
						axiosError.response?.data?.error || 'Failed to save expense'
					);
				}
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			onClose();
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col p-0">
				<DialogHeader className="border-b flex-shrink-0 px-6 pt-6 pb-4">
					<DialogTitle className="text-2xl font-bold">
						{localExpense ? 'Edit Expense' : 'Add New Expense'}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
					<ScrollArea className="flex-1 px-6 overflow-y-auto">
						<div className="py-6 space-y-4 pb-4">
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
									maxLength={255}
									required
									disabled={isSubmitting}
								/>
								<p className="text-xs text-muted-foreground">
									{formData.title.length}/255 characters
								</p>
							</div>

							<div className="space-y-2">
								<Label htmlFor="amount" className="text-sm">
									Amount <span className="text-red-500">*</span>
								</Label>
								<div className="flex gap-2">
									<Select
										value={selectedCurrency}
										onValueChange={handleCurrencyChange}
										disabled={isSubmitting}
									>
										<SelectTrigger id="currency" className="w-[120px]">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{currencies.map(currency => (
												<SelectItem key={currency.code} value={currency.code}>
													{currency.symbol} {currency.code}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<Input
										id="amount"
										type="number"
										step="0.01"
										min="0"
										max="999999999.99"
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
										className="flex-1"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="category">
										Category <span className="text-red-500">*</span>
									</Label>
									<Combobox
										options={categoryOptions}
										value={formData.categoryId}
										onValueChange={value => {
											setFormData({ ...formData, categoryId: value });
										}}
										placeholder="Select a category"
										searchPlaceholder="Search categories..."
										emptyText="No category found."
										disabled={isSubmitting}
										onSearchChange={handleCategorySearch}
										isLoading={isLoadingCategories}
									/>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => navigate('/categories')}
										className="w-full justify-start text-sm font-normal text-primary hover:text-primary hover:bg-primary/10 mt-1"
									>
										<Plus className="h-4 w-4 mr-2" />
										Add New Category
									</Button>
								</div>

								<Accordion
									type="single"
									collapsible
									value={accordionValue}
									onValueChange={setAccordionValue}
									className="w-full"
								>
									<AccordionItem
										value="additional-details"
										className="border-none"
									>
										<AccordionTrigger className="hover:no-underline py-3">
											<span className="text-sm font-medium">
												Additional Details (Date, Time, Description)
											</span>
										</AccordionTrigger>
										<AccordionContent className="space-y-4 pt-2">
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label htmlFor="date" className="text-sm font-medium">
														Date (Optional)
													</Label>
													<Popover>
														<PopoverTrigger asChild>
															<Button
																id="date"
																variant="outline"
																className={cn(
																	'w-full justify-start text-left font-normal',
																	!selectedDate && 'text-muted-foreground'
																)}
																disabled={isSubmitting}
															>
																<Calendar className="mr-2 h-4 w-4" />
																{selectedDate ? (
																	format(selectedDate, 'PPP')
																) : (
																	<span>Pick a date</span>
																)}
															</Button>
														</PopoverTrigger>
														<PopoverContent
															className="w-auto p-0"
															align="start"
														>
															<CalendarComponent
																mode="single"
																selected={selectedDate}
																onSelect={setSelectedDate}
																initialFocus
															/>
														</PopoverContent>
													</Popover>
													<p className="text-xs text-muted-foreground">
														Defaults to current date if not provided
													</p>
												</div>

												<div className="space-y-2">
													<Label htmlFor="time" className="text-sm font-medium">
														Time (Optional)
													</Label>
													<Popover>
														<PopoverTrigger asChild>
															<Button
																id="time"
																variant="outline"
																className={cn(
																	'w-full justify-start text-left font-normal',
																	!time && 'text-muted-foreground'
																)}
																disabled={isSubmitting}
															>
																<Clock className="mr-2 h-4 w-4" />
																{time || 'Pick a time'}
															</Button>
														</PopoverTrigger>
														<PopoverContent
															className="w-auto p-4"
															align="start"
														>
															<div className="space-y-4">
																<div className="space-y-2">
																	<Label
																		htmlFor="time-input"
																		className="text-sm"
																	>
																		Select Time
																	</Label>
																	<Input
																		id="time-input"
																		type="time"
																		value={time}
																		onChange={e => setTime(e.target.value)}
																		className="w-full"
																	/>
																</div>
															</div>
														</PopoverContent>
													</Popover>
													<p className="text-xs text-muted-foreground">
														Defaults to current time if not provided
													</p>
												</div>
											</div>

											<div className="space-y-2">
												<Label htmlFor="description">
													Description (Optional)
												</Label>
												<Textarea
													id="description"
													placeholder="Add any additional details..."
													value={formData.description}
													onChange={(
														e: React.ChangeEvent<HTMLTextAreaElement>
													) =>
														setFormData({
															...formData,
															description: e.target.value,
														})
													}
													maxLength={1000}
													rows={3}
													disabled={isSubmitting}
												/>
												<p className="text-xs text-muted-foreground">
													{formData.description?.length || 0}/1000 characters
												</p>
											</div>
										</AccordionContent>
									</AccordionItem>
								</Accordion>

								{/* Action Buttons */}
								<div className="flex justify-between items-center pt-6 mt-2 border-t pb-2">
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													type="button"
													onClick={onClose}
													className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gray-500/10 hover:bg-gray-500/20 text-gray-600 border-2 border-gray-500/30 hover:border-gray-500/50 backdrop-blur-sm shadow-xl transition-all hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
													disabled={isSubmitting}
												>
													<X
														className="h-10 w-10 sm:h-11 sm:w-11"
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
													className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-green-500/10 hover:bg-green-500/20 text-green-600 border-2 border-green-500/30 hover:border-green-500/50 backdrop-blur-sm shadow-xl transition-all hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
													disabled={isSubmitting}
												>
													<Check
														className="h-10 w-10 sm:h-11 sm:w-11"
														strokeWidth={3}
													/>
												</Button>
											</TooltipTrigger>
											<TooltipContent>
												<p>
													{isSubmitting
														? 'Saving...'
														: expense
															? 'Update Expense'
															: 'Add Expense'}
												</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</div>
							</div>
						</div>
					</ScrollArea>
				</form>
			</DialogContent>
		</Dialog>
	);
};
