import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { signIn } from "../services/firebase/authService";
import { COLORS, SHADOWS, SIZES } from "./constants/theme";

export default function LoginScreen() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleLogin = async () => {
		if (!email || !password) {
			setError("Please fill in all fields");
			return;
		}

		setLoading(true);
		setError("");

		try {
			await signIn(email, password);
			// Navigate to main viewer on success
			router.replace("/viewer/");
		} catch (err) {
			setError(err.message || "Failed to sign in");
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.keyboardView}
			>
				<View style={styles.contentContainer}>
					{/* Header Section */}
					<View style={styles.header}>
						<View style={styles.logoContainer}>
							<FontAwesome5 name="bus" size={32} color={COLORS.white} />
						</View>
						<Text style={styles.title}>BusTrackNow</Text>
						<Text style={styles.subtitle}>Your journey, right on time.</Text>
					</View>

					{/* Form Section */}
					<View style={styles.form}>
						{error ? <Text style={styles.errorText}>{error}</Text> : null}

						<View style={styles.inputGroup}>
							<Text style={styles.inputLabel}>EMAIL</Text>
							<View style={styles.inputContainer}>
								<Ionicons
									name="mail-outline"
									size={20}
									color={COLORS.textPlaceholder}
									style={styles.inputIcon}
								/>
								<TextInput
									style={styles.input}
									placeholder="name@example.com"
									placeholderTextColor={COLORS.textPlaceholder}
									value={email}
									onChangeText={setEmail}
									autoCapitalize="none"
									keyboardType="email-address"
								/>
							</View>
						</View>

						<View style={styles.inputGroup}>
							<Text style={styles.inputLabel}>PASSWORD</Text>
							<View style={styles.inputContainer}>
								<Ionicons
									name="lock-closed-outline"
									size={20}
									color={COLORS.textPlaceholder}
									style={styles.inputIcon}
								/>
								<TextInput
									style={styles.input}
									placeholder="••••••••"
									placeholderTextColor={COLORS.textPlaceholder}
									value={password}
									onChangeText={setPassword}
									secureTextEntry
								/>
							</View>
						</View>

						<TouchableOpacity style={styles.forgotPassword}>
							<Text style={styles.forgotPasswordText}>Forgot Password?</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.signInButton}
							onPress={handleLogin}
							disabled={loading}
						>
							{loading ? (
								<ActivityIndicator color={COLORS.white} />
							) : (
								<>
									<Text style={styles.signInButtonText}>Sign In</Text>
									<Ionicons
										name="arrow-forward"
										size={20}
										color={COLORS.white}
										style={{ marginLeft: 8 }}
									/>
								</>
							)}
						</TouchableOpacity>
					</View>

					{/* Social / Footer */}
					<View style={styles.footer}>
						<View style={styles.dividerContainer}>
							<View style={styles.divider} />
							<Text style={styles.dividerText}>Or continue with</Text>
							<View style={styles.divider} />
						</View>

						<View style={styles.socialButtons}>
							<TouchableOpacity style={styles.socialButton}>
								<Ionicons name="logo-google" size={20} color="#DB4437" />
								<Text style={styles.socialButtonText}>Google</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.socialButton}>
								<Ionicons name="logo-apple" size={20} color={COLORS.text} />
								<Text style={styles.socialButtonText}>Apple</Text>
							</TouchableOpacity>
						</View>

						<View style={styles.signupContainer}>
							<Text style={styles.signupText}>Don't have an account? </Text>
							<TouchableOpacity onPress={() => router.push("/signup")}>
								<Text style={styles.signupLink}>Sign Up</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.surface,
	},
	keyboardView: {
		flex: 1,
	},
	contentContainer: {
		flex: 1,
		paddingHorizontal: SIZES.padding,
		justifyContent: "center",
	},
	header: {
		alignItems: "center",
		marginBottom: 40,
	},
	logoContainer: {
		width: 80,
		height: 80,
		backgroundColor: COLORS.primary,
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 20,
		...SHADOWS.primary,
	},
	title: {
		fontSize: SIZES.h1,
		fontWeight: "700",
		color: COLORS.text,
		marginBottom: 8,
	},
	subtitle: {
		fontSize: SIZES.body2,
		color: COLORS.textSecondary,
	},
	form: {
		marginBottom: 20,
	},
	errorText: {
		color: COLORS.error,
		marginBottom: 10,
		textAlign: "center",
	},
	inputGroup: {
		marginBottom: 16,
	},
	inputLabel: {
		fontSize: 12,
		fontWeight: "700",
		color: COLORS.textSecondary,
		marginBottom: 8,
		marginLeft: 4,
		letterSpacing: 0.5,
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: COLORS.white,
		borderRadius: SIZES.radius,
		borderWidth: 1,
		borderColor: COLORS.border,
		height: 56,
		paddingHorizontal: 16,
	},
	inputIcon: {
		marginRight: 12,
	},
	input: {
		flex: 1,
		fontSize: 16,
		color: COLORS.text,
		height: "100%",
	},
	forgotPassword: {
		alignSelf: "flex-end",
		marginBottom: 24,
	},
	forgotPasswordText: {
		color: COLORS.primary,
		fontWeight: "600",
		fontSize: SIZES.body3,
	},
	signInButton: {
		backgroundColor: COLORS.primary,
		height: 56,
		borderRadius: SIZES.radius,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		...SHADOWS.primary,
	},
	signInButtonText: {
		color: COLORS.white,
		fontSize: 18,
		fontWeight: "700",
	},
	footer: {
		marginTop: 20,
	},
	dividerContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 24,
	},
	divider: {
		flex: 1,
		height: 1,
		backgroundColor: COLORS.border,
	},
	dividerText: {
		marginHorizontal: 16,
		color: COLORS.textPlaceholder,
		fontSize: 12,
	},
	socialButtons: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 30,
	},
	socialButton: {
		flex: 0.48,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: COLORS.white,
		borderWidth: 1,
		borderColor: COLORS.border,
		height: 50,
		borderRadius: SIZES.radius,
	},
	socialButtonText: {
		marginLeft: 10,
		fontWeight: "600",
		color: COLORS.text,
	},
	signupContainer: {
		flexDirection: "row",
		justifyContent: "center",
	},
	signupText: {
		color: COLORS.textSecondary,
	},
	signupLink: {
		color: COLORS.primary,
		fontWeight: "700",
	},
});
