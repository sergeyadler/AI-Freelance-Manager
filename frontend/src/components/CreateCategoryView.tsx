import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { setCustomCategoryIcon } from '../utils/categoryIcons';
import { 
  ShoppingCart, 
  Car, 
  Home, 
  UtensilsCrossed, 
  GraduationCap, 
  Heart, 
  Gamepad2, 
  Smartphone, 
  Shirt, 
  Baby, 
  Shield, 
  Gift, 
  Dumbbell, 
  Plane, 
  Stethoscope, 
  TrendingUp,
  CreditCard,
  HandHeart,
  Laptop,
  Clapperboard,
  ShoppingBag,
  PaintRoller,
  Cat,
  HelpCircle,
  DollarSign,
  Briefcase,
  Coins,
  Network,
  // Additional useful icons
  Coffee,
  BookOpen,
  Music,
  Camera,
  Bike,
  Train,
  Bus,
  Hotel,
  Wrench,
  Pill,
  Scissors,
  Zap,
  Sun,
  Moon,
  Star,
  Target,
  MapPin,
  Clock,
  Calendar,
  FileText,
  Calculator,
  PieChart,
  Wallet,
  PiggyBank,
  Building,
  Factory,
  Store,
  Truck,
  Package
} from 'lucide-react';

interface CreateCategoryViewProps {
  onCreateCategory: (name: string, type: 'income' | 'expense') => void;
}

const CreateCategoryView: React.FC<CreateCategoryViewProps> = ({ onCreateCategory }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [selectedIcon, setSelectedIcon] = useState('ShoppingCart');

  // Available icons with their corresponding category names
  const availableIcons = [
    // Original icons
    { name: 'ShoppingCart', component: ShoppingCart, categoryName: 'Food' },
    { name: 'UtensilsCrossed', component: UtensilsCrossed, categoryName: 'Eating Out' },
    { name: 'Shirt', component: Shirt, categoryName: 'Clothes' },
    { name: 'Dumbbell', component: Dumbbell, categoryName: 'Sport' },
    { name: 'Car', component: Car, categoryName: 'Car' },
    { name: 'Home', component: Home, categoryName: 'Household' },
    { name: 'Clapperboard', component: Clapperboard, categoryName: 'Relaxation' },
    { name: 'Smartphone', component: Smartphone, categoryName: 'Mobile' },
    { name: 'Network', component: Network, categoryName: 'Internet' },
    { name: 'Shield', component: Shield, categoryName: 'Insurance' },
    { name: 'CreditCard', component: CreditCard, categoryName: 'Finance' },
    { name: 'ShoppingBag', component: ShoppingBag, categoryName: 'DM' },
    { name: 'PaintRoller', component: PaintRoller, categoryName: 'Home' },
    { name: 'Heart', component: Heart, categoryName: 'Personal care' },
    { name: 'Laptop', component: Laptop, categoryName: 'Electronics' },
    { name: 'Plane', component: Plane, categoryName: 'Travel' },
    { name: 'HandHeart', component: HandHeart, categoryName: 'Charity' },
    { name: 'Stethoscope', component: Stethoscope, categoryName: 'Medication' },
    { name: 'GraduationCap', component: GraduationCap, categoryName: 'Education' },
    { name: 'TrendingUp', component: TrendingUp, categoryName: 'Investing' },
    { name: 'Cat', component: Cat, categoryName: 'Pets' },
    { name: 'Gamepad2', component: Gamepad2, categoryName: 'Hobbys' },
    { name: 'HelpCircle', component: HelpCircle, categoryName: 'Other' },
    { name: 'Baby', component: Baby, categoryName: 'Children' },
    { name: 'Gift', component: Gift, categoryName: 'Presents' },
    { name: 'DollarSign', component: DollarSign, categoryName: 'Salary' },
    { name: 'Briefcase', component: Briefcase, categoryName: 'Business' },
    { name: 'Coins', component: Coins, categoryName: 'Other income' },
    
    // New additional icons
    { name: 'Coffee', component: Coffee, categoryName: 'Coffee & Cafes' },
    { name: 'BookOpen', component: BookOpen, categoryName: 'Books & Reading' },
    { name: 'Music', component: Music, categoryName: 'Music & Audio' },
    { name: 'Camera', component: Camera, categoryName: 'Photography' },
    { name: 'Bike', component: Bike, categoryName: 'Cycling' },
    { name: 'Train', component: Train, categoryName: 'Public Transport' },
    { name: 'Bus', component: Bus, categoryName: 'Bus Transport' },
    { name: 'Hotel', component: Hotel, categoryName: 'Accommodation' },
    { name: 'Wrench', component: Wrench, categoryName: 'Repairs & Tools' },
    { name: 'Pill', component: Pill, categoryName: 'Pharmacy' },
    { name: 'Scissors', component: Scissors, categoryName: 'Hair & Beauty' },
    { name: 'Zap', component: Zap, categoryName: 'Utilities & Energy' },
    { name: 'Sun', component: Sun, categoryName: 'Outdoor Activities' },
    { name: 'Moon', component: Moon, categoryName: 'Night Entertainment' },
    { name: 'Star', component: Star, categoryName: 'Premium Services' },
    { name: 'Target', component: Target, categoryName: 'Goals & Targets' },
    { name: 'MapPin', component: MapPin, categoryName: 'Location Services' },
    { name: 'Clock', component: Clock, categoryName: 'Time Management' },
    { name: 'Calendar', component: Calendar, categoryName: 'Events & Planning' },
    { name: 'FileText', component: FileText, categoryName: 'Documents & Legal' },
    { name: 'Calculator', component: Calculator, categoryName: 'Accounting' },
    { name: 'PieChart', component: PieChart, categoryName: 'Analytics' },
    { name: 'Wallet', component: Wallet, categoryName: 'Personal Finance' },
    { name: 'PiggyBank', component: PiggyBank, categoryName: 'Savings' },
    { name: 'Building', component: Building, categoryName: 'Real Estate' },
    { name: 'Factory', component: Factory, categoryName: 'Manufacturing' },
    { name: 'Store', component: Store, categoryName: 'Retail Shopping' },
    { name: 'Truck', component: Truck, categoryName: 'Delivery & Shipping' },
    { name: 'Package', component: Package, categoryName: 'Packages & Orders' }
  ];

  const handleSave = () => {
    if (name.trim()) {
      // Register the custom icon for this category
      const selectedIconData = availableIcons.find(icon => icon.name === selectedIcon);
      if (selectedIconData) {
        setCustomCategoryIcon(name.trim(), selectedIconData.component);
      }
      
      onCreateCategory(name.trim(), type);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      {/* Category Name Input */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ 
          display: 'block', 
          marginBottom: 8, 
          color: '#e8e8f0', 
          fontSize: 14,
          fontWeight: 500
        }}>
          Category Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name..."
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '20px',
            fontSize: '16px',
            background: 'rgba(255,255,255,0.06)',
            color: '#e8e8f0',
            fontFamily: 'inherit',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Category Type Selection */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ 
          display: 'block', 
          marginBottom: 8, 
          color: '#e8e8f0', 
          fontSize: 14,
          fontWeight: 500
        }}>
          Category Type
        </label>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => setType('expense')}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: `1px solid ${type === 'expense' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255,255,255,0.15)'}`,
              borderRadius: '20px',
              fontSize: '16px',
              background: type === 'expense' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.06)',
              color: type === 'expense' ? '#f87171' : '#e8e8f0',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Expense
          </button>
          <button
            onClick={() => setType('income')}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: `1px solid ${type === 'income' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(255,255,255,0.15)'}`,
              borderRadius: '20px',
              fontSize: '16px',
              background: type === 'income' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.06)',
              color: type === 'income' ? '#22c55e' : '#e8e8f0',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Income
          </button>
        </div>
      </div>

      {/* Icon Selection */}
      <div style={{ marginBottom: 32 }}>
        <label style={{ 
          display: 'block', 
          marginBottom: 8, 
          color: '#e8e8f0', 
          fontSize: 14,
          fontWeight: 500
        }}>
          Icon
        </label>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(6, 1fr)', 
          gap: 8,
          maxHeight: '300px',
          overflowY: 'auto',
          padding: '8px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {availableIcons.map(icon => {
            const IconComponent = icon.component;
            return (
              <button
                key={icon.name}
                onClick={() => setSelectedIcon(icon.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  border: `1px solid ${selectedIcon === icon.name ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '8px',
                  background: selectedIcon === icon.name ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: '#e8e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                title={icon.categoryName}
              >
                <IconComponent size={20} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Save Button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center' 
      }}>
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            background: name.trim() ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.1)',
            border: `1px solid ${name.trim() ? 'rgba(34, 197, 94, 0.4)' : 'rgba(255,255,255,0.2)'}`,
            borderRadius: '20px',
            color: name.trim() ? '#22c55e' : '#a0a0a0',
            cursor: name.trim() ? 'pointer' : 'not-allowed',
            fontSize: 16,
            fontWeight: 500,
            transition: 'all 0.2s ease'
          }}
        >
          <Save size={20} />
          Save Category
        </button>
      </div>
    </div>
  );
};

export default CreateCategoryView;


