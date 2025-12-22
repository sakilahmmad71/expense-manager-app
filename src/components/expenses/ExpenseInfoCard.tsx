import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface ExpenseInfoCardProps {
	icon: LucideIcon;
	iconColor: string;
	iconBgColor: string;
	label: string;
	children: ReactNode;
	scrollable?: boolean;
}

export const ExpenseInfoCard = ({
	icon: Icon,
	iconColor,
	iconBgColor,
	label,
	children,
	scrollable = false,
}: ExpenseInfoCardProps) => {
	return (
		<div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
			<div className="flex items-start gap-3">
				<div
					className={`h-10 w-10 rounded-lg ${iconBgColor} flex items-center justify-center flex-shrink-0`}
				>
					<Icon className={`h-5 w-5 ${iconColor}`} />
				</div>
				<div className="flex-1 min-w-0">
					<p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
						{label}
					</p>
					{scrollable ? (
						<div className="max-h-32 sm:max-h-40 overflow-y-auto">
							{children}
						</div>
					) : (
						children
					)}
				</div>
			</div>
		</div>
	);
};
