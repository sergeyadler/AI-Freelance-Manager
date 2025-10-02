import React from 'react';
import type { MenuModalProps } from '../types';
import { Download, RefreshCw, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const MenuModal: React.FC<MenuModalProps> = ({
  isOpen,
  onClose,
  balance,
  onExportCSV,
  onRefreshBalance
}) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: '#2f2f3a',
          borderRadius: 12,
          padding: 24,
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          minWidth: 300,
          maxWidth: 400
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ 
          margin: '0 0 20px 0', 
          color: '#e8e8f0',
          fontSize: 20,
          fontWeight: 600
        }}>
          Menu
        </h2>
        
        {/* User Info Section */}
        {user && (
          <div style={{ 
            marginBottom: 24,
            padding: 16,
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8,
              marginBottom: 8
            }}>
              <User size={16} style={{ color: '#e8e8f0' }} />
              <div style={{ color: '#e8e8f0', fontSize: 16, fontWeight: 500 }}>
                {user.full_name || user.email}
              </div>
            </div>
            {user.full_name && (
              <div style={{ color: '#888', fontSize: 14, marginTop: 4 }}>
                {user.email}
              </div>
            )}
          </div>
        )}
        
        {balance && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ 
              margin: '0 0 12px 0', 
              color: '#e8e8f0',
              fontSize: 16,
              fontWeight: 600
            }}>
              Balance Summary
            </h3>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: 8 
            }}>
              <span style={{ color: '#4ade80' }}>Income:</span>
              <span style={{ color: '#4ade80', fontWeight: 600 }}>
                {balance.income.toFixed(2)}
              </span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: 8 
            }}>
              <span style={{ color: '#f87171' }}>Expenses:</span>
              <span style={{ color: '#f87171', fontWeight: 600 }}>
                {balance.expense.toFixed(2)}
              </span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: 16,
              paddingTop: 8,
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}>
              <span style={{ color: '#e8e8f0', fontWeight: 600 }}>Net:</span>
              <span style={{ 
                color: balance.net >= 0 ? '#4ade80' : '#f87171',
                fontWeight: 600 
              }}>
                {balance.net.toFixed(2)}
              </span>
            </div>
          </div>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={onExportCSV}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 8,
              color: '#e8e8f0',
              cursor: 'pointer',
              fontSize: 16
            }}
          >
            <Download size={20} />
            Export CSV
          </button>
          
          <button
            onClick={onRefreshBalance}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 8,
              color: '#e8e8f0',
              cursor: 'pointer',
              fontSize: 16
            }}
          >
            <RefreshCw size={20} />
            Refresh Balance
          </button>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(255,68,68,0.1)',
              border: '1px solid rgba(255,68,68,0.3)',
              borderRadius: 8,
              color: '#ff4444',
              cursor: 'pointer',
              fontSize: 16,
              marginTop: 8
            }}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuModal;
