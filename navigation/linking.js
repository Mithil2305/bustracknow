export const linking = {
	prefixes: ["bustrack://", "https://bustrack.app"],
	config: {
		screens: {
			Auth: {
				screens: {
					Login: "login",
					Register: "register",
					OTP: "otp",
				},
			},
			Viewer: {
				screens: {
					Home: "home",
					Live: "live",
					Search: "search",
					Profile: "profile",
				},
			},
			Admin: {
				screens: {
					Dashboard: "admin",
					Users: "admin/users",
					Stops: "admin/stops",
					Routes: "admin/routes",
					GodMode: "admin/god",
				},
			},
		},
	},
};
