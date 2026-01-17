import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

/**
 * Network status hook using @react-native-community/netinfo.
 */
export function useNetworkStatus() {
	const [state, setState] = useState({
		isConnected: true,
		isInternetReachable: true,
		type: "unknown",
		details: null,
	});

	useEffect(() => {
		const sub = NetInfo.addEventListener((info) => {
			setState({
				isConnected: info.isConnected ?? true,
				isInternetReachable: info.isInternetReachable ?? true,
				type: info.type,
				details: info.details ?? null,
			});
		});
		return () => sub?.();
	}, []);

	return state;
}

export default useNetworkStatus;
