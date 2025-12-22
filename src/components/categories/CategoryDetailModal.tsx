import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Category } from '@/lib/services';
import { Edit, Trash2, X, Calendar, Clock, Package } from 'lucide-react';

interface CategoryDetailModalProps {
	isOpen: boolean;
	category: Category | null;
	onClose: () => void;
	onEdit: (category: Category) => void;
	onDelete: (category: Category) => void;
}

interface CategoryInfoCardProps {
	icon: React.ElementType;
	iconColor: string;
	iconBgColor: string;
	label: string;
	children: React.ReactNode;
}

const CategoryInfoCard = ({
	icon: Icon,
	iconColor,
	iconBgColor,
	label,
	children,
}: CategoryInfoCardProps) => (
	<div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
		<div className="flex items-start gap-3">
			<div className={`${iconBgColor} p-2 rounded-lg`}>
				<Icon className={`h-4 w-4 ${iconColor}`} />
			</div>
			<div className="flex-1 min-w-0">
				<p className="text-xs text-gray-500 mb-1">{label}</p>
				{children}
			</div>
		</div>
	</div>
);

export const CategoryDetailModal = ({
	isOpen,
	category,
	onClose,
	onEdit,
	onDelete,
}: CategoryDetailModalProps) => {
	// Prevent background scroll when modal is open
	useEffect(() => {
		if (!isOpen) return;

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
	}, [isOpen, onClose]);

	if (!isOpen || !category) return null;

	const expenseCount = category._count?.expenses ?? 0;

	return (
		<div
			className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
			onClick={onClose}
		>
			<div
				className="bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
				onClick={e => e.stopPropagation()}
			>
				{/* Modal Header with Gradient */}
				<div className="relative overflow-hidden">
					<div
						className="absolute inset-0 opacity-10"
						style={{
							background: `linear-gradient(135deg, ${category.color || '#3b82f6'} 0%, ${category.color || '#3b82f6'}dd 100%)`,
						}}
					/>
					<div className="relative px-4 sm:px-6 py-6 sm:py-8">
						<div className="flex items-start justify-between mb-3 sm:mb-4">
							<div
								className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-lg"
								style={{
									backgroundColor: category.color
										? `${category.color}30`
										: '#dbeafe',
								}}
							>
								{category.icon || '📁'}
							</div>
							<div
								className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold shadow-sm"
								style={{
									backgroundColor: category.color
										? `${category.color}20`
										: '#dbeafe',
									color: category.color || '#1e40af',
								}}
							>
								Category
							</div>
						</div>
						<h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 break-words">
							{category.name}
						</h2>
						<div className="flex items-baseline gap-2">
							<span className="text-3xl sm:text-4xl font-bold text-gray-900">
								{expenseCount}
							</span>
							<span className="text-sm text-gray-600">
								{expenseCount === 1 ? 'expense' : 'expenses'}
							</span>
						</div>
					</div>
				</div>

				{/* Modal Content */}
				<div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4 bg-gray-50">
					{/* Color Card */}
					<CategoryInfoCard
						icon={Package}
						iconColor="text-purple-600"
						iconBgColor="bg-purple-50"
						label="Color"
					>
						<div className="flex items-center gap-2 mt-0.5">
							<div
								className="w-6 h-6 rounded-full border-2 border-gray-300 shadow-sm"
								style={{ backgroundColor: category.color }}
							/>
							<p className="text-sm font-semibold text-gray-900">
								{category.color}
							</p>
						</div>
					</CategoryInfoCard>

					{/* Created At Card */}
					<CategoryInfoCard
						icon={Calendar}
						iconColor="text-blue-600"
						iconBgColor="bg-blue-50"
						label="Created At"
					>
						<p className="text-sm font-semibold text-gray-900 mt-0.5">
							{new Date(category.createdAt).toLocaleDateString('en-US', {
								weekday: 'long',
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})}
						</p>
					</CategoryInfoCard>

					{/* Updated At Card */}
					<CategoryInfoCard
						icon={Clock}
						iconColor="text-green-600"
						iconBgColor="bg-green-50"
						label="Last Updated"
					>
						<p className="text-sm font-semibold text-gray-900 mt-0.5">
							{new Date(category.updatedAt).toLocaleDateString('en-US', {
								month: 'short',
								day: 'numeric',
								year: 'numeric',
								hour: '2-digit',
								minute: '2-digit',
							})}
						</p>
					</CategoryInfoCard>

					{/* Expense Count Card */}
					<CategoryInfoCard
						icon={Package}
						iconColor="text-amber-600"
						iconBgColor="bg-amber-50"
						label="Total Expenses"
					>
						<p className="text-sm font-semibold text-gray-900 mt-0.5">
							{expenseCount} {expenseCount === 1 ? 'expense' : 'expenses'} in
							this category
						</p>
					</CategoryInfoCard>
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
											onDelete(category);
											onClose();
										}}
										className="flex-1 sm:gap-2 h-11 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors justify-center"
									>
										<Trash2 className="h-4 w-4" />
										<span className="hidden sm:inline">Delete</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent side="top" className="sm:hidden">
									<p>Delete category</p>
								</TooltipContent>
							</Tooltip>

							{/* Edit Button - Middle */}
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										type="button"
										onClick={() => {
											onEdit(category);
											onClose();
										}}
										className="flex-1 sm:gap-2 h-11 bg-black hover:bg-gray-800 text-white font-medium shadow-sm hover:shadow-md transition-all justify-center"
									>
										<Edit className="h-4 w-4" />
										<span className="hidden sm:inline">Edit Category</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent side="top" className="sm:hidden">
									<p>Edit category</p>
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

			<style>{`
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
