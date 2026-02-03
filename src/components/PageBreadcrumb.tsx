import React from 'react';
import { Link } from 'react-router-dom';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';

interface BreadcrumbItemType {
	label: string;
	href?: string;
}

interface PageBreadcrumbProps {
	items: BreadcrumbItemType[];
}

export const PageBreadcrumb = ({ items }: PageBreadcrumbProps) => {
	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link
							to="/dashboard"
							className="flex items-center gap-1 hover:text-gray-900 transition-colors"
						>
							<Home className="h-4 w-4" />
							Home
						</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>
				{items.map((item, index) => (
					<React.Fragment key={index}>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							{item.href ? (
								<BreadcrumbLink asChild>
									<Link
										to={item.href}
										className="hover:text-gray-900 transition-colors"
									>
										{item.label}
									</Link>
								</BreadcrumbLink>
							) : (
								<BreadcrumbPage className="font-medium text-gray-900">
									{item.label}
								</BreadcrumbPage>
							)}
						</BreadcrumbItem>
					</React.Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
};
