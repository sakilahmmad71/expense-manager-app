import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Database, Eye, FileText, UserCheck } from 'lucide-react';

export const PrivacyPage = () => {
	return (
		<div className="max-w-4xl mx-auto space-y-6">
			{/* Header */}
			<div className="text-center space-y-2">
				<h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
					Privacy Policy
				</h1>
				<p className="text-gray-600">
					How we collect, use, and protect your personal and financial
					information
				</p>
			</div>

			{/* Introduction */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Shield className="h-5 w-5 text-blue-600" />
						Introduction
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3 text-gray-700">
					<p>
						Welcome to Expenser, a personal expense tracking application. We are
						committed to protecting your privacy and ensuring the security of
						your financial data. This Privacy Policy explains how we collect,
						use, and safeguard your information.
					</p>
					<p>
						By using Expenser, you agree to the collection and use of
						information in accordance with this policy. If you do not agree with
						any part of this policy, please do not use our service.
					</p>
				</CardContent>
			</Card>

			{/* Data Collection */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Database className="h-5 w-5 text-green-600" />
						Information We Collect
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4 text-gray-700">
					<div>
						<h3 className="font-semibold text-gray-900 mb-2">
							Personal Information
						</h3>
						<ul className="list-disc list-inside space-y-1 ml-2">
							<li>Name and email address (when you register)</li>
							<li>Profile information you choose to provide</li>
							<li>Authentication credentials (securely hashed passwords)</li>
						</ul>
					</div>
					<div>
						<h3 className="font-semibold text-gray-900 mb-2">Financial Data</h3>
						<ul className="list-disc list-inside space-y-1 ml-2">
							<li>
								Expense records (title, amount, category, description, date)
							</li>
							<li>Custom categories you create</li>
							<li>Currency preferences</li>
							<li>Budget and spending analytics</li>
						</ul>
					</div>
					<div>
						<h3 className="font-semibold text-gray-900 mb-2">
							Technical Information
						</h3>
						<ul className="list-disc list-inside space-y-1 ml-2">
							<li>Browser type and version</li>
							<li>Device information and IP address</li>
							<li>Usage patterns and feature interactions</li>
							<li>Session data and authentication tokens</li>
						</ul>
					</div>
				</CardContent>
			</Card>

			{/* Data Usage */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Eye className="h-5 w-5 text-purple-600" />
						How We Use Your Information
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3 text-gray-700">
					<p>We use your information to:</p>
					<ul className="list-disc list-inside space-y-1 ml-2">
						<li>Provide and maintain the expense tracking service</li>
						<li>Generate personalized analytics and insights</li>
						<li>Authenticate and secure your account</li>
						<li>Improve our application and user experience</li>
						<li>Send important service notifications (if enabled)</li>
						<li>Comply with legal obligations</li>
					</ul>
					<p className="mt-3">
						<strong>We do not:</strong> Sell your data to third parties, use
						your financial information for advertising, or share your expense
						details with external services without your explicit consent.
					</p>
				</CardContent>
			</Card>

			{/* Data Security */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Lock className="h-5 w-5 text-red-600" />
						Data Security
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3 text-gray-700">
					<p>
						We implement industry-standard security measures to protect your
						data:
					</p>
					<ul className="list-disc list-inside space-y-1 ml-2">
						<li>
							<strong>Encryption:</strong> All data transmitted between your
							device and our servers is encrypted using HTTPS/TLS
						</li>
						<li>
							<strong>Password Security:</strong> Passwords are hashed using
							bcrypt before storage
						</li>
						<li>
							<strong>Database Security:</strong> PostgreSQL database with
							restricted access controls
						</li>
						<li>
							<strong>JWT Authentication:</strong> Secure token-based
							authentication with expiration
						</li>
						<li>
							<strong>Environment Variables:</strong> Sensitive credentials
							stored in secure environment variables
						</li>
						<li>
							<strong>Regular Updates:</strong> Dependencies and security
							patches are regularly updated
						</li>
					</ul>
					<p className="mt-3 text-sm">
						While we strive to protect your data, no method of transmission over
						the internet is 100% secure. Please use strong passwords and keep
						your credentials confidential.
					</p>
				</CardContent>
			</Card>

			{/* Third-Party Services */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<UserCheck className="h-5 w-5 text-orange-600" />
						Third-Party Services
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3 text-gray-700">
					<p>Expenser may integrate with the following third-party services:</p>
					<ul className="list-disc list-inside space-y-1 ml-2">
						<li>
							<strong>Google OAuth:</strong> For optional authentication
							(subject to Google's Privacy Policy)
						</li>
						<li>
							<strong>Cloud Hosting:</strong> Your data is stored on secure
							cloud infrastructure
						</li>
					</ul>
					<p className="mt-3">
						These services have their own privacy policies. We recommend
						reviewing them before using these authentication methods.
					</p>
				</CardContent>
			</Card>

			{/* User Rights */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<FileText className="h-5 w-5 text-indigo-600" />
						Your Rights and Choices
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3 text-gray-700">
					<p>You have the right to:</p>
					<ul className="list-disc list-inside space-y-1 ml-2">
						<li>
							<strong>Access:</strong> View all your personal data stored in the
							application
						</li>
						<li>
							<strong>Update:</strong> Modify your profile information and
							preferences
						</li>
						<li>
							<strong>Delete:</strong> Request deletion of your account and all
							associated data
						</li>
						<li>
							<strong>Export:</strong> Download your expense data in CSV format
						</li>
						<li>
							<strong>Opt-out:</strong> Disable optional features and
							notifications
						</li>
					</ul>
					<p className="mt-3">
						To exercise these rights, visit your Profile page or contact us at{' '}
						<a
							href="mailto:sakilahmmad71@gmail.com"
							className="text-blue-600 hover:underline"
						>
							sakilahmmad71@gmail.com
						</a>
					</p>
				</CardContent>
			</Card>

			{/* Data Retention */}
			<Card>
				<CardHeader>
					<CardTitle>Data Retention</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3 text-gray-700">
					<p>
						We retain your data for as long as your account is active. If you
						delete your account, all associated data (expenses, categories,
						profile information) will be permanently removed from our systems
						within 30 days.
					</p>
					<p>
						Some technical logs may be retained for security and compliance
						purposes for up to 90 days.
					</p>
				</CardContent>
			</Card>

			{/* Changes to Policy */}
			<Card>
				<CardHeader>
					<CardTitle>Changes to This Policy</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3 text-gray-700">
					<p>
						We may update this Privacy Policy from time to time. Changes will be
						posted on this page with an updated "Last updated" date. Continued
						use of Expenser after changes constitutes acceptance of the updated
						policy.
					</p>
				</CardContent>
			</Card>

			{/* Contact */}
			<Card>
				<CardHeader>
					<CardTitle>Contact Us</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3 text-gray-700">
					<p>
						If you have questions or concerns about this Privacy Policy, please
						contact:
					</p>
					<div className="bg-gray-50 p-4 rounded-md">
						<p className="font-semibold">Shakil Ahmed</p>
						<p>
							Email:{' '}
							<a
								href="mailto:sakilahmmad71@gmail.com"
								className="text-blue-600 hover:underline"
							>
								sakilahmmad71@gmail.com
							</a>
						</p>
						<p>
							GitHub:{' '}
							<a
								href="https://github.com/sakilahmmad71"
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-600 hover:underline"
							>
								@sakilahmmad71
							</a>
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
