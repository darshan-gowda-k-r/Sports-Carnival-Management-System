import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './dashboardCardStyle';
import Colors from '../constants/colors';

interface Props {
    title: string;
    icon: string;
    onPress: () => void;
}

const DashboardCard = ({ title, icon, onPress }: Props) => (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
        <View style={styles.iconBox}>
            <Icon name={icon} size={26} color={Colors.white} />
        </View>
        <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
);

export default DashboardCard;