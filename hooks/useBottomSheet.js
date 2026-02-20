// hooks/useBottomSheet.js
import { useCallback, useState } from "react";

/**
 * Hook for managing bottom sheet state (collapsed/expanded).
 * Works with components/bottom-sheet/BottomSheet.jsx.
 */
export const useBottomSheet = (initialCollapsed = true) => {
	const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
	const [content, setContent] = useState(null);

	const expand = useCallback(() => setIsCollapsed(false), []);
	const collapse = useCallback(() => setIsCollapsed(true), []);

	const toggle = useCallback(() => {
		setIsCollapsed((prev) => !prev);
	}, []);

	const onToggle = useCallback((expanded) => {
		setIsCollapsed(!expanded);
	}, []);

	const showContent = useCallback((newContent) => {
		setContent(newContent);
		setIsCollapsed(false);
	}, []);

	const dismiss = useCallback(() => {
		setContent(null);
		setIsCollapsed(true);
	}, []);

	return {
		isCollapsed,
		isExpanded: !isCollapsed,
		content,
		expand,
		collapse,
		toggle,
		onToggle,
		showContent,
		dismiss,
	};
};

export default useBottomSheet;
