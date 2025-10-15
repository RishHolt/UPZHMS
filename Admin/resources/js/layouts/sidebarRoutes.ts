export interface SidebarRoute {
	label: string;
	path: string;
	icon: string;
	roles?: string[];
	children?: SidebarRoute[];
}

// Base routes - Main Dashboard
export const baseRoutes: SidebarRoute[] = [
	{
		label: "Main Dashboard",
		path: "/dashboard",
		icon: "LayoutDashboard",
		roles: ['IT_ADMIN']
	}
];

// Module routes - All application modules
export const moduleRoutes: SidebarRoute[] = [
	{
		label: "Zoning Clearance",
		path: "/zoning",
		icon: "Map",
		roles: ['IT_ADMIN', 'ZONING_ADMIN', 'ZONING_OFFICER'],
		children: [
			{ label: "Dashboard", path: "/zoning", icon: "LayoutDashboard" },
			{ label: "Applications", path: "/zoning/applications", icon: "FileText" },
			{ label: "Zoning Map", path: "/zoning/map", icon: "MapPin" },
			{ label: "Review & Evaluation", path: "/zoning/review-evaluation", icon: "CheckCircle" }
		]
	},
	{
		label: "Building Review",
		path: "/building",
		icon: "Building2",
		roles: ['IT_ADMIN', 'BUILDING_ADMIN', 'BUILDING_OFFICER'],
		children: [
			{ label: "Dashboard", path: "/building", icon: "LayoutDashboard" }
		]
	},
	{
		label: "Housing Registry",
		path: "/housing",
		icon: "Home",
		roles: ['IT_ADMIN', 'ZONING_ADMIN', 'ZONING_OFFICER'],
		children: [
			{ label: "Dashboard", path: "/housing", icon: "LayoutDashboard" },
			{ label: "Applications", path: "/housing/applications", icon: "UserPlus" },
			{ label: "Beneficiaries", path: "/housing/beneficiaries", icon: "Users" },
			{ label: "Housing Units", path: "/housing/units", icon: "Building" },
			{ label: "Reports", path: "/housing/reports", icon: "FileText" }
		]
	},
	{
		label: "Occupancy Monitoring",
		path: "/occupancy",
		icon: "Users",
		roles: ['IT_ADMIN', 'ZONING_ADMIN', 'ZONING_OFFICER'],
		children: [
			{ label: "Dashboard", path: "/occupancy", icon: "LayoutDashboard" }
		]
	},
	{
		label: "Infrastructure",
		path: "/infrastructure",
		icon: "Network",
		roles: ['IT_ADMIN', 'ZONING_ADMIN', 'ZONING_OFFICER'],
		children: [
			{ label: "Dashboard", path: "/infrastructure", icon: "LayoutDashboard" }
		]
	},
	{
		label: "User Management",
		path: "/user-management",
		icon: "Users",
		roles: ['IT_ADMIN']
	}
];

/**
 * Get filtered sidebar routes based on user role
 * @param userRole - The current user's role
 * @returns Filtered array of sidebar routes
 */
export const getFilteredRoutes = (userRole: string | undefined): SidebarRoute[] => {
	if (!userRole) return [];
	
	return [...baseRoutes, ...moduleRoutes].filter(route => 
		route.roles?.includes(userRole) ?? false
	);
};

