import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { colors } from '../../design/tokens';

const ProgressRing = ({ 
  current = 0, 
  max = 10000, 
  size = 120, 
  strokeWidth = 8,
  label = '',
  showCashEquivalent = true
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(current / max, 1);
  const offset = circumference - progress * circumference;

  const cashEquivalent = Math.floor(current / 100); // 100 points = ₹1

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.gray200}
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progress < 1 ? colors.primary : colors.success}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        
        {/* Center Text */}
        <SvgText
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          fill={colors.gray800}
          fontSize={20}
          fontWeight="bold"
          dy={8}
        >
          {current.toLocaleString()}
        </SvgText>
        
        {/* Points Label */}
        <SvgText
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          fill={colors.gray500}
          fontSize={12}
          dy={28}
        >
          points
        </SvgText>
      </Svg>
      
      {/* Cash Equivalent */}
      {showCashEquivalent && (
        <View style={styles.cashBadge}>
          <Text style={styles.cashText}>₹{cashEquivalent}</Text>
        </View>
      )}
      
      {/* Label */}
      {label ? (
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>{label}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  cashBadge: {
    position: 'absolute',
    bottom: -12,
    left: '50%',
    transform: [{ translateX: -25 }],
    backgroundColor: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cashText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  labelContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 8,
    alignItems: 'center',
  },
  labelText: {
    color: colors.gray600,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default ProgressRing;
