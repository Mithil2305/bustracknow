/**
 * utils/dateUtils.js
 * Helper functions for date and time formatting.
 */

export const formatTime = (date) => {
	if (!date) return "";
	const d = new Date(date);
	return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const formatDate = (date) => {
	if (!date) return "";
	const d = new Date(date);
	return d.toLocaleDateString([], {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
};

export const getDurationString = (minutes) => {
	if (minutes < 60) return `${Math.round(minutes)} min`;
	const hrs = Math.floor(minutes / 60);
	const mins = Math.round(minutes % 60);
	return `${hrs}h ${mins}m`;
};

export const isSameDay = (date1, date2) => {
	const d1 = new Date(date1);
	const d2 = new Date(date2);
	return (
		d1.getDate() === d2.getDate() &&
		d1.getMonth() === d2.getMonth() &&
		d1.getFullYear() === d2.getFullYear()
	);
};
