import React from 'react';
import { 
  ShoppingCart, 
  Car, 
  UtensilsCrossed, 
  GraduationCap, 
  Heart, 
  Gamepad2, 
  Smartphone, 
  Shirt, 
  Baby, 
  Shield, 
  PiggyBank, 
  Gift, 
  Coffee, 
  Dumbbell, 
  Plane, 
  Stethoscope, 
  BookOpen, 
  Music,
  DollarSign,
  TrendingUp,
  CreditCard,
  Wallet,
  Building,
  HandHeart,
  Laptop,
  House,
  Wifi,
  Cat,
  Clapperboard,
  ShoppingBag,
  CarTaxiFront,
  PaintRoller,
  CircleQuestionMark,
} from 'lucide-react';

export const CATEGORY_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  // Expense categories
  'Food': ShoppingCart,
  'Car': Car,
  'Household': PaintRoller,
  'Eating Out': UtensilsCrossed,
  'Education': GraduationCap,
  'Charity': HandHeart,
  'Hobbys': Gamepad2,
  'Mobile': Smartphone,
  'Clothes': Shirt,
  'Children': Baby,
  'Insurance': Shield,
  'Electronics': Laptop,
  'Health': Stethoscope,
  'Travel': Plane,
  'Entertainment': Music,
  'Sport': Dumbbell,
  'Books': BookOpen,
  'Coffee': Coffee,
  'Presents': Gift,
  'Savings': PiggyBank,
  'Personal care': Heart,
  'Home': House,
  'Internet': Wifi,
  'Investing': TrendingUp,
  'Medication': Stethoscope,
  'Pets': Cat,
  'Relaxation': Clapperboard,
  'Finance': Wallet,
  'DM': ShoppingBag,
  'Sharing': CarTaxiFront,
  'Other': CircleQuestionMark,

  // Income categories
  'Salary': DollarSign,
  'Business': TrendingUp,
  'Freelance': CreditCard,
  'Investment': Wallet,
  'Rental': Building,
};

// Store custom category icon mappings
let customCategoryIcons: Record<string, React.ComponentType<{ size?: number }>> = {};

export const setCustomCategoryIcon = (categoryName: string, iconComponent: React.ComponentType<{ size?: number }>) => {
  customCategoryIcons[categoryName] = iconComponent;
};

export const CategoryIcon: React.FC<{ categoryName: string; size?: number }> = ({ 
  categoryName, 
  size = 20 
}) => {
  // First check predefined icons
  const IconComponent = CATEGORY_ICONS[categoryName];
  if (IconComponent) {
    return <IconComponent size={size} />;
  }
  
  // Then check custom category icons
  const CustomIconComponent = customCategoryIcons[categoryName];
  if (CustomIconComponent) {
    return <CustomIconComponent size={size} />;
  }
  
  // Fallback to default icon
  return <CircleQuestionMark size={size} />;
};
