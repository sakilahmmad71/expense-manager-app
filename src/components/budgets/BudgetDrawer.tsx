import { Button } from '@/components/ui/button';
import {
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from '@/components/ui/drawer';
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
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { currencies } from '@/constants/currencies';
import { useCreateBudget, useUpdateBudget } from '@/hooks/useBudgets';
import { Budget, BudgetInput } from '@/lib/services';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

interface BudgetDrawerProps {
	isOpen: boolean;
	budget: Budget | null;
	onClose: () => void;
	onSuccess: () => void;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i); // 5 years before, current, 5 years after
const months = [
	{ value: 1, label: 'January' },
	{ value: 2, label: 'February' },
	{ value: 3, label: 'March' },
	{ value: 4, label: 'April' },
	{ value: 5, label: 'May' },
	{ value: 6, label: 'June' },
	{ value: 7, label: 'July' },
	{ value: 8, label: 'August' },
	{ value: 9, label: 'September' },
	{ value: 10, label: 'October' },
	{ value: 11, label: 'November' },
	{ value: 12, label: 'December' },
];

export const BudgetDrawer = ({
	isOpen,
	budget,
	onClose,
	onSuccess,
}: BudgetDrawerProps) => {
	const createBudget = useCreateBudget();
	const updateBudget = useUpdateBudget();

	// Keep local copy of budget so closing animation isn't interrupted
	const [localBudget, setLocalBudget] = useState<Budget | null>(budget || null);

	// Accordion state for mobile/desktop default behavior
	// On desktop, expand by default; on mobile, collapsed
	const [accordionValue, setAccordionValue] = useState<string>(() => {
		const mobile = window.innerWidth < 768; // md breakpoint
		return mobile ? '' : 'additional-details';
	});

	// Update local budget when prop changes
	useEffect(() => {
		if (isOpen && budget) {
			setLocalBudget(budget);
		}
		if (!isOpen) {
			const t = window.setTimeout(() => setLocalBudget(null), 300);
			return () => window.clearTimeout(t);
		}
	}, [isOpen, budget]);

	const [formData, setFormData] = useState<BudgetInput>(() => ({
		amount: localBudget?.amount || 0,
		currency:
			localBudget?.currency ||
			localStorage.getItem('preferredCurrency') ||
			'USD',
		period: localBudget?.period || 'monthly',
		month: localBudget?.month || new Date().getMonth() + 1,
		year: localBudget?.year || currentYear,
		name: localBudget?.name || '',
		notes: localBudget?.notes || '',
		alertAt80: localBudget?.alertAt80 ?? false,
		alertAt100: localBudget?.alertAt100 ?? false,
	}));

	const [errors, setErrors] = useState<Record<string, string>>({});
	const isEditing = !!localBudget;

	// Reset form when drawer opens/closes or budget changes
	useEffect(() => {
		if (isOpen) {
			setFormData({
				amount: localBudget?.amount || 0,
				currency:
					localBudget?.currency ||
					localStorage.getItem('preferredCurrency') ||
					'USD',
				period: localBudget?.period || 'monthly',
				month: localBudget?.month || new Date().getMonth() + 1,
				year: localBudget?.year || currentYear,
				name: localBudget?.name || '',
				notes: localBudget?.notes || '',
				alertAt80: localBudget?.alertAt80 ?? false,
				alertAt100: localBudget?.alertAt100 ?? false,
			});
			setErrors({});
		}
	}, [isOpen, localBudget]);

	const validateForm = useCallback(() => {
		const newErrors: Record<string, string> = {};

		if (!formData.amount || formData.amount < 0.01) {
			newErrors.amount = 'Amount must be at least $0.01';
		}

		if (
			formData.period === 'monthly' &&
			(!formData.month || formData.month < 1 || formData.month > 12)
		) {
			newErrors.month = 'Month must be between 1 and 12';
		}

		if (!formData.year || formData.year < 2000 || formData.year > 2100) {
			newErrors.year = 'Year must be between 2000 and 2100';
		}

		if (formData.notes && formData.notes.length > 500) {
			newErrors.notes = 'Notes cannot exceed 500 characters';
		}

		if (formData.name && formData.name.length > 100) {
			newErrors.name = 'Name cannot exceed 100 characters';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}, [formData]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) return;

		try {
			// Save currency preference
			localStorage.setItem('preferredCurrency', formData.currency || 'USD');

			const submitData: BudgetInput = {
				amount: formData.amount,
				currency: formData.currency,
				period: formData.period,
				year: formData.year,
				month:
					formData.period === 'monthly' && formData.month
						? formData.month
						: undefined,
				name: formData.name || undefined,
				notes: formData.notes || undefined,
				alertAt80: formData.alertAt80,
				alertAt100: formData.alertAt100,
			};

			if (isEditing && localBudget?.id) {
				await updateBudget.mutateAsync({
					id: localBudget.id,
					data: submitData,
				});
			} else {
				await createBudget.mutateAsync(submitData);
			}

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
					: 'Failed to save budget';
			setErrors({ submit: errorMessage });
			toast.error('Failed to save budget', {
				description: errorMessage,
			});
		}
	};

	const isLoading = createBudget.isPending || updateBudget.isPending;

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			onClose();
		}
	};

	if (!localBudget && !isOpen) return null;

	return (
		<Drawer open={isOpen} onOpenChange={handleOpenChange}>
			<DrawerContent className="sm:max-w-lg md:max-w-xl mx-auto max-h-[95vh] overflow-hidden flex flex-col">
				<DrawerHeader className="border-b flex-shrink-0 px-4 md:px-6 pt-3 md:pt-4 pb-2 md:pb-3">
					<DrawerTitle className="text-xl md:text-2xl font-bold">
						{isEditing ? 'Edit Budget' : 'Create New Budget'}
					</DrawerTitle>
				</DrawerHeader>

				<form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
					<ScrollArea className="flex-1 px-4 md:px-6 overflow-y-auto">
						<div className="space-y-3 md:space-y-4 py-4 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
							{/* Period */}
							<div className="space-y-2">
								<Label className="required">Period</Label>
								<RadioGroup
									value={formData.period}
									onValueChange={(value: 'monthly' | 'yearly') =>
										setFormData({ ...formData, period: value })
									}
								>
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="monthly" id="monthly" />
										<Label
											htmlFor="monthly"
											className="font-normal cursor-pointer"
										>
											Monthly
										</Label>
									</div>
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="yearly" id="yearly" />
										<Label
											htmlFor="yearly"
											className="font-normal cursor-pointer"
										>
											Yearly
										</Label>
									</div>
								</RadioGroup>
							</div>

							{/* Amount */}
							<div className="space-y-2">
								<Label htmlFor="amount" className="required">
									Amount
								</Label>
								<div className="flex gap-2">
									<Select
										value={formData.currency}
										onValueChange={value =>
											setFormData({ ...formData, currency: value })
										}
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
										min="0.01"
										placeholder="0.00"
										value={formData.amount || ''}
										onChange={e =>
											setFormData({
												...formData,
												amount: parseFloat(e.target.value) || 0,
											})
										}
										className={cn(
											'flex-1',
											errors.amount && 'border-destructive'
										)}
									/>
								</div>
								{errors.amount && (
									<p className="text-sm text-destructive">{errors.amount}</p>
								)}
							</div>

							{/* Year and Month */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="year" className="required">
										Year
									</Label>
									<Select
										value={formData.year?.toString()}
										onValueChange={value =>
											setFormData({ ...formData, year: parseInt(value) })
										}
									>
										<SelectTrigger id="year">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{years.map(year => (
												<SelectItem key={year} value={year.toString()}>
													{year}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{errors.year && (
										<p className="text-sm text-destructive">{errors.year}</p>
									)}
								</div>

								{formData.period === 'monthly' && (
									<div className="space-y-2">
										<Label htmlFor="month" className="required">
											Month
										</Label>
										<Select
											value={formData.month?.toString()}
											onValueChange={value =>
												setFormData({ ...formData, month: parseInt(value) })
											}
										>
											<SelectTrigger id="month">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{months.map(month => (
													<SelectItem
														key={month.value}
														value={month.value.toString()}
													>
														{month.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{errors.month && (
											<p className="text-sm text-destructive">{errors.month}</p>
										)}
									</div>
								)}
							</div>

							{/* Additional Details Accordion */}
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
											Additional Details (Name, Alert Settings, Notes)
										</span>
									</AccordionTrigger>
									<AccordionContent className="space-y-4 pt-2">
										{/* Name (optional) */}
										<div className="space-y-2">
											<Label htmlFor="name">Name (Optional)</Label>
											<Input
												id="name"
												type="text"
												placeholder="e.g., Grocery Budget"
												value={formData.name}
												onChange={e =>
													setFormData({ ...formData, name: e.target.value })
												}
												className={cn(errors.name && 'border-destructive')}
												maxLength={100}
											/>
											{errors.name && (
												<p className="text-sm text-destructive">
													{errors.name}
												</p>
											)}
										</div>

										{/* Alert Settings */}
										<div className="space-y-3">
											<Label>Alert Settings</Label>
											<div className="flex items-center space-x-2">
												<Checkbox
													id="alertAt80"
													checked={formData.alertAt80}
													onCheckedChange={checked =>
														setFormData({
															...formData,
															alertAt80: checked as boolean,
														})
													}
												/>
												<Label
													htmlFor="alertAt80"
													className="font-normal cursor-pointer"
												>
													Alert me at 80% usage
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<Checkbox
													id="alertAt100"
													checked={formData.alertAt100}
													onCheckedChange={checked =>
														setFormData({
															...formData,
															alertAt100: checked as boolean,
														})
													}
												/>
												<Label
													htmlFor="alertAt100"
													className="font-normal cursor-pointer"
												>
													Alert me at 100% usage
												</Label>
											</div>
										</div>

										{/* Notes */}
										<div className="space-y-2">
											<Label htmlFor="notes">Notes (Optional)</Label>
											<Textarea
												id="notes"
												placeholder="Add notes about this budget..."
												value={formData.notes}
												onChange={e =>
													setFormData({ ...formData, notes: e.target.value })
												}
												className={cn(errors.notes && 'border-destructive')}
												maxLength={500}
												rows={4}
											/>
											<p className="text-xs text-muted-foreground text-right">
												{(formData.notes || '').length}/500 characters
											</p>
											{errors.notes && (
												<p className="text-sm text-destructive">
													{errors.notes}
												</p>
											)}
										</div>
									</AccordionContent>
								</AccordionItem>
							</Accordion>

							{/* Submit Error */}
							{errors.submit && (
								<div className="p-3 bg-red-50 border border-red-200 rounded-lg">
									<p className="text-sm text-red-600">{errors.submit}</p>
								</div>
							)}
						</div>
					</ScrollArea>

					<DrawerFooter className="px-4 md:px-6 pb-4 md:pb-6 border-t flex-shrink-0">
						<div className="grid grid-cols-2 gap-3 md:gap-4 w-full">
							<Button
								type="submit"
								disabled={isLoading}
								className="w-full h-10 md:h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
							>
								{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								{isEditing ? 'Update' : 'Create'}
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								disabled={isLoading}
								className="w-full h-10 md:h-12 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
							>
								Cancel
							</Button>
						</div>
					</DrawerFooter>
				</form>
			</DrawerContent>
		</Drawer>
	);
};
