import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, RefreshCw } from 'lucide-react';

interface DateRangeFilterProps {
	startDate: string;
	endDate: string;
	isFiltered: boolean;
	isLoading: boolean;
	onStartDateChange: (value: string) => void;
	onEndDateChange: (value: string) => void;
	onApplyFilter: () => void;
	onClearFilter: () => void;
}

export const DateRangeFilter = ({
	startDate,
	endDate,
	isFiltered,
	isLoading,
	onStartDateChange,
	onEndDateChange,
	onApplyFilter,
	onClearFilter,
}: DateRangeFilterProps) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-base sm:text-lg">
					<Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
					Date Range Filter
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="flex-1 space-y-2">
						<Label htmlFor="startDate" className="text-sm">
							Start Date
						</Label>
						<Input
							id="startDate"
							type="date"
							value={startDate}
							onChange={e => onStartDateChange(e.target.value)}
							className="h-10"
						/>
					</div>
					<div className="flex-1 space-y-2">
						<Label htmlFor="endDate" className="text-sm">
							End Date
						</Label>
						<Input
							id="endDate"
							type="date"
							value={endDate}
							onChange={e => onEndDateChange(e.target.value)}
							className="h-10"
						/>
					</div>
					<div className="flex items-end gap-2">
						<Button
							onClick={onApplyFilter}
							disabled={isLoading}
							size="sm"
							className="text-xs sm:text-sm"
						>
							Apply Filter
						</Button>
						{isFiltered && (
							<Button
								onClick={onClearFilter}
								variant="outline"
								disabled={isLoading}
								size="sm"
								className="h-9 w-9 p-0"
							>
								<RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
							</Button>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
