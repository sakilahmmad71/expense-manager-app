import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Expense } from '@/lib/services';
import { formatCurrency } from '@/lib/utils';
import {
	Edit,
	Trash2,
	X,
	Calendar,
	DollarSign,
	Clock,
	FileText,
} from 'lucide-react';
import { ExpenseInfoCard } from './ExpenseInfoCard';

interface ExpenseDetailModalProps {
	expense: Expense;
	onClose: () => void;
	onEdit: (expense: Expense) => void;
	onDelete: (expense: Expense) => void;
}

export const ExpenseDetailModal = ({
	expense,
	onClose,
	onEdit,
	onDelete,
}: ExpenseDetailModalProps) => {
	// Prevent background scroll when modal is open
	useEffect(() => {
		document.body.style.overflow = 'hidden';

		// Close modal on Escape key
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};

		window.addEventListener('keydown', handleEscape);

		return () => {
			document.body.style.overflow = 'unset';
			window.removeEventListener('keydown', handleEscape);
		};
	}, [onClose]);

	return (
		<div
			className="bg-white rounded-lg sm:rounded-xl shadow-xl w-full max-w-lg h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
			onClick={e => e.stopPropagation()}
			style={{ animation: 'slideUp 0.2s ease-out' }}
		>
			{/* Modal Header with Gradient */}
			<div className="relative overflow-hidden">
				<div
					className="absolute inset-0 opacity-10"
					style={{
						background: `linear-gradient(135deg, ${expense.category.color || '#3b82f6'} 0%, ${expense.category.color || '#3b82f6'}dd 100%)`,
					}}
				/>
				<div className="relative px-4 sm:px-6 py-6 sm:py-8">
					<div className="flex items-start justify-between mb-3 sm:mb-4">
						<div
							className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-lg"
							style={{
								backgroundColor: expense.category.color
									? `${expense.category.color}30`
									: '#dbeafe',
							}}
						>
							{expense.category.icon || '💰'}
						</div>
						<div
							className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold shadow-sm"
							style={{
								backgroundColor: expense.category.color
									? `${expense.category.color}20`
									: '#dbeafe',
								color: expense.category.color || '#1e40af',
							}}
						>
							{expense.category.name}
						</div>
					</div>
					<h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 break-words">
						{expense.title}
					</h2>
					<div className="flex items-baseline gap-2">
						<span className="text-3xl sm:text-4xl font-bold text-gray-900">
							{formatCurrency(expense.amount, expense.currency)}
						</span>
					</div>
				</div>
			</div>

			{/* Modal Content */}
			<div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4 bg-gray-50">
				{/* Date Card */}
				<ExpenseInfoCard
					icon={Calendar}
					iconColor="text-blue-600"
					iconBgColor="bg-blue-50"
					label="Expense Date"
				>
					<p className="text-sm font-semibold text-gray-900 mt-0.5">
						{new Date(expense.date).toLocaleDateString('en-US', {
							weekday: 'long',
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						})}
					</p>
				</ExpenseInfoCard>

				{/* Currency Card */}
				<ExpenseInfoCard
					icon={DollarSign}
					iconColor="text-green-600"
					iconBgColor="bg-green-50"
					label="Currency"
				>
					<p className="text-sm font-semibold text-gray-900 mt-0.5">
						{expense.currency}
					</p>
				</ExpenseInfoCard>

				{/* Created At Card */}
				<ExpenseInfoCard
					icon={Clock}
					iconColor="text-purple-600"
					iconBgColor="bg-purple-50"
					label="Created At"
				>
					<p className="text-sm font-semibold text-gray-900 mt-0.5">
						{new Date(expense.createdAt).toLocaleDateString('en-US', {
							month: 'short',
							day: 'numeric',
							year: 'numeric',
							hour: '2-digit',
							minute: '2-digit',
						})}
					</p>
				</ExpenseInfoCard>

				{/* Description Card */}
				{expense.description && (
					<ExpenseInfoCard
						icon={FileText}
						iconColor="text-amber-600"
						iconBgColor="bg-amber-50"
						label="Description"
						scrollable
					>
						<p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
							{expense.description}
						</p>
					</ExpenseInfoCard>
				)}
			</div>

			{/* Modal Footer with Actions */}
			<div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-4 sm:pt-6 pb-3 sm:pb-4 px-4 sm:px-6 -mt-2">
				<TooltipProvider delayDuration={200}>
					<div className="flex gap-2">
						{/* Delete Button - Left */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										onDelete(expense);
										onClose();
									}}
									className="flex-1 sm:gap-2 h-11 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors justify-center"
								>
									<Trash2 className="h-4 w-4" />
									<span className="hidden sm:inline">Delete</span>
								</Button>
							</TooltipTrigger>
							<TooltipContent side="top" className="sm:hidden">
								<p>Delete expense</p>
							</TooltipContent>
						</Tooltip>

						{/* Edit Button - Middle */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									type="button"
									onClick={() => {
										onEdit(expense);
										onClose();
									}}
									className="flex-1 sm:gap-2 h-11 bg-black hover:bg-gray-800 text-white font-medium shadow-sm hover:shadow-md transition-all justify-center"
								>
									<Edit className="h-4 w-4" />
									<span className="hidden sm:inline">Edit Expense</span>
								</Button>
							</TooltipTrigger>
							<TooltipContent side="top" className="sm:hidden">
								<p>Edit expense</p>
							</TooltipContent>
						</Tooltip>

						{/* Close Button - Right */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									type="button"
									variant="outline"
									onClick={onClose}
									className="flex-1 sm:gap-2 h-11 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors justify-center"
								>
									<X className="h-4 w-4" />
									<span className="hidden sm:inline">Close</span>
								</Button>
							</TooltipTrigger>
							<TooltipContent side="top" className="sm:hidden">
								<p>Close modal</p>
							</TooltipContent>
						</Tooltip>
					</div>
				</TooltipProvider>
			</div>
		</div>
	);
};
