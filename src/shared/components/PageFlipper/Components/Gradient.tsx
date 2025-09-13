import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import type { LinearGradientProps } from 'expo-linear-gradient';

const Gradient: React.FC<LinearGradientProps> = (props) => {
    return <LinearGradient {...props} />;
};

export { Gradient };
