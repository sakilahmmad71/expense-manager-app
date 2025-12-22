import { Card, CardContent } from '@/components/ui/card';

interface MixedCurrencyWarningProps {
	primaryCurrency: string;
}

export const MixedCurrencyWarning = ({
	primaryCurrency,
}: MixedCurrencyWarningProps) => {
	return (
		<Card className="border-orange-200 bg-orange-50">
			<CardContent className="pt-4">
				<p className="text-sm text-orange-800">
					<span className="font-semibold">* Note:</span> Your expenses use
					multiple currencies. Summary totals are displayed in {primaryCurrency}{' '}
					but may not accurately reflect converted values. Individual expenses
					show their actual currency.
				</p>
			</CardContent>
		</Card>
	);
};
