import { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
	errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null,
		};
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return {
			hasError: true,
			error,
			errorInfo: null,
		};
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error('ErrorBoundary caught an error:', error, errorInfo);
		this.setState({
			error,
			errorInfo,
		});
	}

	handleReset = () => {
		this.setState({
			hasError: false,
			error: null,
			errorInfo: null,
		});
		window.location.reload();
	};

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50">
					<Card className="w-full max-w-2xl border-red-200 shadow-xl">
						<CardHeader className="text-center pb-4">
							<div className="flex justify-center mb-4">
								<div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
									<AlertCircle className="h-8 w-8 text-red-600" />
								</div>
							</div>
							<CardTitle className="text-2xl text-red-900">
								Oops! Something went wrong
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-center text-gray-600">
								We encountered an unexpected error. This might be due to a
								timeout or server issue.
							</p>

							{this.state.error && (
								<div className="bg-red-50 border border-red-200 rounded-lg p-4">
									<p className="text-sm font-semibold text-red-900 mb-1">
										Error Details:
									</p>
									<p className="text-xs text-red-700 font-mono break-all">
										{this.state.error.message}
									</p>
								</div>
							)}

							<div className="flex flex-col sm:flex-row gap-3 pt-4">
								<Button
									onClick={this.handleReset}
									className="flex-1 bg-red-600 hover:bg-red-700"
								>
									<RefreshCw className="h-4 w-4 mr-2" />
									Reload Page
								</Button>
								<Button
									onClick={() => (window.location.href = '/dashboard')}
									variant="outline"
									className="flex-1"
								>
									Go to Dashboard
								</Button>
							</div>

							<div className="pt-4 border-t">
								<details className="text-xs text-gray-500">
									<summary className="cursor-pointer hover:text-gray-700">
										Technical Details
									</summary>
									<div className="mt-2 p-2 bg-gray-50 rounded overflow-auto max-h-40">
										<pre className="text-xs">
											{this.state.errorInfo?.componentStack}
										</pre>
									</div>
								</details>
							</div>
						</CardContent>
					</Card>
				</div>
			);
		}

		return this.props.children;
	}
}
