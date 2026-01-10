import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	FileText,
	CheckCircle,
	AlertTriangle,
	Users,
	Scale,
	Ban,
} from 'lucide-react';
import { useEffect } from 'react';

export const TermsPage = () => {
	// Set document title and meta description
	useEffect(() => {
		document.title = 'Terms & Conditions - Expenser | User Agreement';
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription) {
			metaDescription.setAttribute(
				'content',
				'Read the Terms and Conditions for using Expenser. Understand your rights, responsibilities, and our service agreement.'
			);
		} else {
			const meta = document.createElement('meta');
			meta.name = 'description';
			meta.content =
				'Read the Terms and Conditions for using Expenser. Understand your rights, responsibilities, and our service agreement.';
			document.head.appendChild(meta);
		}
	}, []);

	return (
		<div className="py-8 px-4 sm:px-6 min-h-screen">
			<div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
				{/* Header */}
				<div id="terms-header" className="text-center space-y-2">
					<h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
						Terms and Conditions
					</h1>
					<p className="text-gray-600">
						Your rights, responsibilities, and rules for using Expenser
					</p>
				</div>

				{/* Introduction */}
				<Card id="agreement-to-terms">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<FileText className="h-5 w-5 text-blue-600" />
							Agreement to Terms
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3 text-gray-700">
						<p>
							Welcome to Expenser. These Terms and Conditions ("Terms") govern
							your use of the Expenser expense tracking application and related
							services (collectively, the "Service").
						</p>
						<p>
							By accessing or using Expenser, you agree to be bound by these
							Terms. If you disagree with any part of these Terms, you may not
							access the Service.
						</p>
					</CardContent>
				</Card>

				{/* Acceptance */}
				<Card id="use-of-service">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<CheckCircle className="h-5 w-5 text-green-600" />
							Use of Service
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4 text-gray-700">
						<div>
							<h3 className="font-semibold text-gray-900 mb-2">Eligibility</h3>
							<p>
								You must be at least 13 years old to use Expenser. By using the
								Service, you represent that you meet this age requirement and
								have the legal capacity to enter into these Terms.
							</p>
						</div>
						<div>
							<h3 className="font-semibold text-gray-900 mb-2">
								Account Registration
							</h3>
							<ul className="list-disc list-inside space-y-1 ml-2">
								<li>
									You must provide accurate and complete information when
									creating an account
								</li>
								<li>
									You are responsible for maintaining the confidentiality of
									your password
								</li>
								<li>
									You are responsible for all activities that occur under your
									account
								</li>
								<li>
									You must notify us immediately of any unauthorized access
								</li>
								<li>One person or entity may maintain only one free account</li>
							</ul>
						</div>
						<div>
							<h3 className="font-semibold text-gray-900 mb-2">
								Acceptable Use
							</h3>
							<p>
								You agree to use Expenser only for lawful purposes and in
								accordance with these Terms. You agree not to:
							</p>
							<ul className="list-disc list-inside space-y-1 ml-2">
								<li>Use the Service for any illegal or unauthorized purpose</li>
								<li>Violate any applicable laws or regulations</li>
								<li>Impersonate any person or entity</li>
								<li>Interfere with or disrupt the Service or servers</li>
								<li>
									Attempt to gain unauthorized access to any part of the Service
								</li>
								<li>
									Use automated systems to access the Service without permission
								</li>
							</ul>
						</div>
					</CardContent>
				</Card>

				{/* User Content */}
				<Card id="user-content">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Users className="h-5 w-5 text-purple-600" />
							Your Content and Data
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3 text-gray-700">
						<div>
							<h3 className="font-semibold text-gray-900 mb-2">Ownership</h3>
							<p>
								You retain all rights to the expense data, categories, and other
								content you create or upload to Expenser ("Your Content"). You
								grant us a limited license to use, store, and process Your
								Content solely to provide the Service.
							</p>
						</div>
						<div>
							<h3 className="font-semibold text-gray-900 mb-2">
								Responsibility
							</h3>
							<p>
								You are solely responsible for Your Content and the consequences
								of posting it. You represent that you have all necessary rights
								to Your Content and that it does not violate any laws or
								third-party rights.
							</p>
						</div>
						<div>
							<h3 className="font-semibold text-gray-900 mb-2">Data Backup</h3>
							<p>
								While we implement regular backups, you are encouraged to export
								and maintain your own copies of Your Content. We are not
								responsible for any loss or corruption of Your Content.
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Intellectual Property */}
				<Card id="intellectual-property">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Scale className="h-5 w-5 text-indigo-600" />
							Intellectual Property
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3 text-gray-700">
						<p>
							The Service, including its original content, features,
							functionality, design, code, and visual elements, is owned by
							Shakil Ahmed and is protected by international copyright,
							trademark, and other intellectual property laws.
						</p>
						<p>
							Expenser is released as open-source software under the MIT
							License. You may view, fork, and contribute to the source code on
							GitHub, subject to the terms of the MIT License.
						</p>
						<p>
							The Expenser name, logo, and related marks are trademarks. You may
							not use these marks without prior written permission.
						</p>
					</CardContent>
				</Card>

				{/* Service Availability */}
				<Card id="service-availability">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<AlertTriangle className="h-5 w-5 text-yellow-600" />
							Service Availability and Modifications
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3 text-gray-700">
						<div>
							<h3 className="font-semibold text-gray-900 mb-2">
								Service Availability
							</h3>
							<p>
								We strive to provide reliable service but do not guarantee that
								the Service will be uninterrupted, timely, secure, or
								error-free. We may experience downtime for maintenance, updates,
								or unforeseen circumstances.
							</p>
						</div>
						<div>
							<h3 className="font-semibold text-gray-900 mb-2">
								Modifications
							</h3>
							<p>
								We reserve the right to modify, suspend, or discontinue any part
								of the Service at any time, with or without notice. We will not
								be liable to you or any third party for any modification,
								suspension, or discontinuance.
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Termination */}
				<Card id="account-termination">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Ban className="h-5 w-5 text-red-600" />
							Account Termination
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3 text-gray-700">
						<div>
							<h3 className="font-semibold text-gray-900 mb-2">By You</h3>
							<p>
								You may delete your account at any time through the Profile
								page. Upon deletion, all Your Content will be permanently
								removed within 30 days.
							</p>
						</div>
						<div>
							<h3 className="font-semibold text-gray-900 mb-2">By Us</h3>
							<p>
								We may suspend or terminate your account if you violate these
								Terms, engage in fraudulent activity, or for any other reason at
								our discretion. We will attempt to provide notice when possible.
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Disclaimer */}
				<Card id="disclaimer">
					<CardHeader>
						<CardTitle>Disclaimer of Warranties</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3 text-gray-700">
						<p className="uppercase font-semibold">
							THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
							WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
						</p>
						<p>We do not warrant that:</p>
						<ul className="list-disc list-inside space-y-1 ml-2">
							<li>The Service will meet your specific requirements</li>
							<li>
								The Service will be uninterrupted, timely, secure, or error-free
							</li>
							<li>
								The results obtained from use of the Service will be accurate or
								reliable
							</li>
							<li>Any errors in the Service will be corrected</li>
						</ul>
					</CardContent>
				</Card>

				{/* Limitation of Liability */}
				<Card id="liability">
					<CardHeader>
						<CardTitle>Limitation of Liability</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3 text-gray-700">
						<p className="uppercase font-semibold">
							TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL
							EXPENSER, ITS DEVELOPERS, OR CONTRIBUTORS BE LIABLE FOR ANY
							INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
							INCLUDING LOSS OF DATA, LOSS OF PROFITS, OR BUSINESS INTERRUPTION.
						</p>
						<p>
							This limitation applies whether the alleged liability is based on
							contract, tort, negligence, strict liability, or any other basis,
							even if we have been advised of the possibility of such damage.
						</p>
					</CardContent>
				</Card>

				{/* Governing Law */}
				<Card id="governing-law">
					<CardHeader>
						<CardTitle>Governing Law and Disputes</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3 text-gray-700">
						<p>
							These Terms shall be governed by and construed in accordance with
							applicable international laws, without regard to conflict of law
							provisions.
						</p>
						<p>
							Any disputes arising from these Terms or the Service shall first
							be attempted to be resolved through good-faith negotiation. If
							resolution cannot be reached, disputes may be submitted to binding
							arbitration or appropriate courts.
						</p>
					</CardContent>
				</Card>

				{/* Changes to Terms */}
				<Card id="changes-to-terms">
					<CardHeader>
						<CardTitle>Changes to Terms</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3 text-gray-700">
						<p>
							We reserve the right to modify these Terms at any time. We will
							notify users of material changes by updating the "Last updated"
							date and, where appropriate, through email or in-app
							notifications.
						</p>
						<p>
							Your continued use of the Service after changes become effective
							constitutes acceptance of the modified Terms. If you do not agree
							to the changes, you must stop using the Service and delete your
							account.
						</p>
					</CardContent>
				</Card>

				{/* Contact */}
				<Card>
					<CardHeader>
						<CardTitle>Contact Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3 text-gray-700">
						<p>If you have questions about these Terms, please contact:</p>
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
									href="https://github.com/sakilahmmad71/expense-manager-app"
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 hover:underline"
								>
									Expenser Repository
								</a>
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};
