import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Shield,
	Lock,
	Key,
	Database,
	Server,
	Eye,
	AlertCircle,
	CheckCircle2,
} from 'lucide-react';
import { useEffect } from 'react';

export const SecurityPage = () => {
	// Set document title and meta description
	useEffect(() => {
		document.title =
			'Security Practices - Expenser | Data Protection & Security';
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription) {
			metaDescription.setAttribute(
				'content',
				"Learn about Expenser's security practices, data encryption, authentication methods, and how we protect your financial information."
			);
		} else {
			const meta = document.createElement('meta');
			meta.name = 'description';
			meta.content =
				"Learn about Expenser's security practices, data encryption, authentication methods, and how we protect your financial information.";
			document.head.appendChild(meta);
		}
	}, []);

	return (
		<div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
			{/* Header */}
			<div id="security-header" className="text-center space-y-2">
				<h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
					Security Practices
				</h1>
				<p className="text-gray-600">
					How we protect your financial data and maintain a secure platform
				</p>
			</div>

			{/* Overview */}
			<Card id="security-commitment">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Shield className="h-5 w-5 text-blue-600" />
						Our Commitment to Security
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3 text-gray-700">
					<p>
						At Expenser, we take the security of your financial data seriously.
						We implement industry-standard security measures and best practices
						to protect your information from unauthorized access, alteration,
						disclosure, or destruction.
					</p>
					<p>
						This page outlines our security architecture, practices, and
						recommendations for keeping your account secure.
					</p>
				</CardContent>
			</Card>

			{/* Data Encryption */}
			<Card id="data-encryption">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Lock className="h-5 w-5 text-green-600" />
						Data Encryption
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4 text-gray-700">
					<div>
						<h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
							<CheckCircle2 className="h-4 w-4 text-green-600" />
							Data in Transit
						</h3>
						<ul className="list-disc list-inside space-y-1 ml-6">
							<li>
								<strong>HTTPS/TLS Encryption:</strong> All data transmitted
								between your browser and our servers is encrypted using TLS 1.2
								or higher
							</li>
							<li>
								<strong>Secure WebSockets:</strong> Real-time features use WSS
								(WebSocket Secure) protocol
							</li>
							<li>
								<strong>API Security:</strong> All API endpoints require secure
								HTTPS connections
							</li>
							<li>
								<strong>Certificate Pinning:</strong> SSL/TLS certificates are
								regularly renewed and validated
							</li>
						</ul>
					</div>
					<div>
						<h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
							<CheckCircle2 className="h-4 w-4 text-green-600" />
							Data at Rest
						</h3>
						<ul className="list-disc list-inside space-y-1 ml-6">
							<li>
								<strong>Database Encryption:</strong> PostgreSQL database with
								encryption at rest
							</li>
							<li>
								<strong>Encrypted Backups:</strong> All database backups are
								encrypted
							</li>
							<li>
								<strong>Secure Storage:</strong> Sensitive data stored in
								encrypted volumes
							</li>
						</ul>
					</div>
				</CardContent>
			</Card>

			{/* Authentication */}
			<Card id="authentication">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Key className="h-5 w-5 text-purple-600" />
						Authentication & Access Control
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4 text-gray-700">
					<div>
						<h3 className="font-semibold text-gray-900 mb-2">
							Password Security
						</h3>
						<ul className="list-disc list-inside space-y-1 ml-2">
							<li>
								<strong>Bcrypt Hashing:</strong> Passwords are hashed using
								bcrypt with a cost factor of 10 before storage
							</li>
							<li>
								<strong>No Plain Text Storage:</strong> We never store passwords
								in plain text
							</li>
							<li>
								<strong>Password Requirements:</strong> Minimum 6 characters,
								with strength indicator encouraging complex passwords
							</li>
							<li>
								<strong>Secure Password Reset:</strong> Time-limited, single-use
								reset tokens
							</li>
						</ul>
					</div>
					<div>
						<h3 className="font-semibold text-gray-900 mb-2">
							JWT Token Authentication
						</h3>
						<ul className="list-disc list-inside space-y-1 ml-2">
							<li>
								<strong>Secure Tokens:</strong> JSON Web Tokens (JWT) with
								cryptographic signatures
							</li>
							<li>
								<strong>Token Expiration:</strong> Access tokens expire after a
								set period
							</li>
							<li>
								<strong>HttpOnly Cookies:</strong> Tokens stored in HttpOnly
								cookies to prevent XSS attacks
							</li>
							<li>
								<strong>Token Refresh:</strong> Secure token refresh mechanism
							</li>
						</ul>
					</div>
					<div>
						<h3 className="font-semibold text-gray-900 mb-2">
							OAuth 2.0 Integration
						</h3>
						<ul className="list-disc list-inside space-y-1 ml-2">
							<li>
								<strong>Google OAuth:</strong> Optional authentication via
								Google using industry-standard OAuth 2.0
							</li>
							<li>
								<strong>Secure Flow:</strong> Authorization code flow with PKCE
								for enhanced security
							</li>
							<li>
								<strong>Minimal Permissions:</strong> Only requests necessary
								user information (email, profile)
							</li>
						</ul>
					</div>
				</CardContent>
			</Card>

			{/* Database Security */}
			<Card id="database-security">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Database className="h-5 w-5 text-red-600" />
						Database Security
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3 text-gray-700">
					<ul className="list-disc list-inside space-y-1">
						<li>
							<strong>PostgreSQL:</strong> Production-grade relational database
							with advanced security features
						</li>
						<li>
							<strong>Access Control:</strong> Database access restricted to
							application servers only
						</li>
						<li>
							<strong>Parameterized Queries:</strong> Prisma ORM prevents SQL
							injection attacks
						</li>
						<li>
							<strong>Row-Level Security:</strong> Users can only access their
							own data
						</li>
						<li>
							<strong>Connection Pooling:</strong> Secure and efficient database
							connections
						</li>
						<li>
							<strong>Regular Backups:</strong> Automated encrypted backups with
							point-in-time recovery
						</li>
						<li>
							<strong>Database Monitoring:</strong> Continuous monitoring for
							suspicious activity
						</li>
					</ul>
				</CardContent>
			</Card>

			{/* Infrastructure */}
			<Card id="infrastructure">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Server className="h-5 w-5 text-orange-600" />
						Infrastructure Security
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4 text-gray-700">
					<div>
						<h3 className="font-semibold text-gray-900 mb-2">
							Application Architecture
						</h3>
						<ul className="list-disc list-inside space-y-1 ml-2">
							<li>
								<strong>Node.js Backend:</strong> Express.js framework with
								security middleware
							</li>
							<li>
								<strong>React Frontend:</strong> Built with security-focused
								practices
							</li>
							<li>
								<strong>NGINX Load Balancer:</strong> Reverse proxy with
								security headers and rate limiting
							</li>
							<li>
								<strong>Docker Containers:</strong> Isolated application
								environments
							</li>
							<li>
								<strong>Environment Variables:</strong> Sensitive credentials
								never hard-coded
							</li>
						</ul>
					</div>
					<div>
						<h3 className="font-semibold text-gray-900 mb-2">
							Security Headers
						</h3>
						<ul className="list-disc list-inside space-y-1 ml-2">
							<li>
								<strong>Helmet.js:</strong> Comprehensive security headers
								middleware
							</li>
							<li>
								<strong>CORS:</strong> Controlled cross-origin resource sharing
							</li>
							<li>
								<strong>CSP:</strong> Content Security Policy to prevent XSS
							</li>
							<li>
								<strong>HSTS:</strong> HTTP Strict Transport Security
							</li>
							<li>
								<strong>X-Frame-Options:</strong> Clickjacking protection
							</li>
						</ul>
					</div>
					<div>
						<h3 className="font-semibold text-gray-900 mb-2">
							Rate Limiting & DDoS Protection
						</h3>
						<ul className="list-disc list-inside space-y-1 ml-2">
							<li>
								<strong>Express Rate Limit:</strong> API rate limiting to
								prevent abuse
							</li>
							<li>
								<strong>Request Throttling:</strong> Per-user and per-IP rate
								limits
							</li>
							<li>
								<strong>Load Balancing:</strong> NGINX distributes traffic
								across servers
							</li>
						</ul>
					</div>
				</CardContent>
			</Card>

			{/* Application Security */}
			<Card id="application-security">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Eye className="h-5 w-5 text-indigo-600" />
						Application Security Practices
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3 text-gray-700">
					<ul className="list-disc list-inside space-y-1">
						<li>
							<strong>Input Validation:</strong> All user input validated and
							sanitized on both client and server
						</li>
						<li>
							<strong>XSS Prevention:</strong> React's built-in protection
							against cross-site scripting
						</li>
						<li>
							<strong>CSRF Protection:</strong> Token-based CSRF protection for
							state-changing operations
						</li>
						<li>
							<strong>Dependency Management:</strong> Regular updates to
							dependencies to patch vulnerabilities
						</li>
						<li>
							<strong>Code Reviews:</strong> Security-focused code review
							process
						</li>
						<li>
							<strong>TypeScript:</strong> Type safety reduces runtime errors
							and vulnerabilities
						</li>
						<li>
							<strong>ESLint Security Rules:</strong> Automated security linting
						</li>
					</ul>
				</CardContent>
			</Card>

			{/* Monitoring */}
			<Card id="monitoring">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<AlertCircle className="h-5 w-5 text-yellow-600" />
						Monitoring & Incident Response
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4 text-gray-700">
					<div>
						<h3 className="font-semibold text-gray-900 mb-2">
							Continuous Monitoring
						</h3>
						<ul className="list-disc list-inside space-y-1 ml-2">
							<li>Server and application performance monitoring</li>
							<li>Error tracking and logging</li>
							<li>Failed authentication attempt tracking</li>
							<li>Unusual activity detection</li>
						</ul>
					</div>
					<div>
						<h3 className="font-semibold text-gray-900 mb-2">
							Incident Response
						</h3>
						<p>In the event of a security incident, we have procedures to:</p>
						<ul className="list-disc list-inside space-y-1 ml-2">
							<li>Quickly identify and contain the breach</li>
							<li>Investigate the root cause</li>
							<li>Notify affected users within 72 hours</li>
							<li>Implement corrective measures</li>
							<li>Conduct post-incident analysis</li>
						</ul>
					</div>
				</CardContent>
			</Card>

			{/* Best Practices */}
			<Card id="best-practices">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<CheckCircle2 className="h-5 w-5 text-green-600" />
						Security Best Practices for Users
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3 text-gray-700">
					<p>
						Help us keep your account secure by following these recommendations:
					</p>
					<ul className="list-disc list-inside space-y-1">
						<li>
							<strong>Use Strong Passwords:</strong> Create unique passwords
							with at least 12 characters, mixing uppercase, lowercase, numbers,
							and symbols
						</li>
						<li>
							<strong>Enable Remember Me Carefully:</strong> Only use "Remember
							Me" on trusted personal devices
						</li>
						<li>
							<strong>Log Out on Shared Devices:</strong> Always log out when
							using public or shared computers
						</li>
						<li>
							<strong>Keep Software Updated:</strong> Use the latest browser
							version with security updates
						</li>
						<li>
							<strong>Be Wary of Phishing:</strong> We will never ask for your
							password via email
						</li>
						<li>
							<strong>Review Account Activity:</strong> Regularly check your
							expenses for any unauthorized entries
						</li>
						<li>
							<strong>Use HTTPS:</strong> Always ensure you're on the secure
							HTTPS version of the site
						</li>
						<li>
							<strong>Report Suspicious Activity:</strong> Contact us
							immediately if you notice anything unusual
						</li>
					</ul>
				</CardContent>
			</Card>

			{/* Open Source */}
			<Card id="open-source">
				<CardHeader>
					<CardTitle>Open Source & Transparency</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3 text-gray-700">
					<p>
						Expenser is open source software. You can review our security
						implementation, report vulnerabilities, and contribute improvements
						on GitHub:
					</p>
					<div className="bg-gray-50 p-4 rounded-md space-y-2">
						<p>
							<strong>Repositories:</strong>
						</p>
						<ul className="space-y-1 text-sm">
							<li>
								• Frontend:{' '}
								<a
									href="https://github.com/sakilahmmad71/expense-manager-app"
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 hover:underline"
								>
									expense-manager-app
								</a>
							</li>
							<li>
								• Backend API:{' '}
								<a
									href="https://github.com/sakilahmmad71/expense-manager-apis"
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 hover:underline"
								>
									expense-manager-apis
								</a>
							</li>
							<li>
								• Load Balancer:{' '}
								<a
									href="https://github.com/sakilahmmad71/expense-manager-loadbalancer"
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 hover:underline"
								>
									expense-manager-loadbalancer
								</a>
							</li>
						</ul>
					</div>
				</CardContent>
			</Card>

			{/* Responsible Disclosure */}
			<Card id="responsible-disclosure">
				<CardHeader>
					<CardTitle>Responsible Vulnerability Disclosure</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3 text-gray-700">
					<p>
						If you discover a security vulnerability, please help us protect our
						users by reporting it responsibly:
					</p>
					<ol className="list-decimal list-inside space-y-1 ml-2">
						<li>
							<strong>Do not</strong> publicly disclose the vulnerability before
							it has been addressed
						</li>
						<li>
							Email details to{' '}
							<a
								href="mailto:sakilahmmad71@gmail.com"
								className="text-blue-600 hover:underline"
							>
								sakilahmmad71@gmail.com
							</a>{' '}
							with subject "Security Vulnerability"
						</li>
						<li>Include steps to reproduce the issue and potential impact</li>
						<li>
							Allow reasonable time for us to address the issue before public
							disclosure
						</li>
						<li>
							We will acknowledge your report within 48 hours and provide
							updates on remediation
						</li>
					</ol>
					<p className="mt-3">
						We appreciate the security research community's efforts in making
						Expenser safer for everyone.
					</p>
				</CardContent>
			</Card>

			{/* Contact */}
			<Card id="security-contact">
				<CardHeader>
					<CardTitle>Security Contact</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3 text-gray-700">
					<p>For security concerns, questions, or to report a vulnerability:</p>
					<div className="bg-gray-50 p-4 rounded-md">
						<p className="font-semibold">Security Team</p>
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
