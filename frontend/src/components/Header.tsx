import React from 'react';
import type { HeaderProps } from '../types';
import { ChevronLeft, Menu, ChartPie } from 'lucide-react';

const Header: React.FC<HeaderProps> = ({
    view,
    setView,
    goBack,
    setShowMenuModal,
    activeType,
}) => {



  return (
    <div style={{ padding: '20px' }}>
      {(view === 'entry' || view === 'chart') ? <div className="topbar">
        <button 
          onClick={() => setShowMenuModal(true)}
          style={{ justifySelf: 'start', background: 'none', border: 'none', color: '#e8e8f0', cursor: 'pointer', padding: 0 }}
        >
          <Menu size={24} />
        </button>
        
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#e8e8f0' }}>
          { view === 'entry' ? activeType === 'income' ? 'Income' : 'Expenses' : view === 'chart' ? activeType === 'income' ? 'Income Report' : 'Expenses Report' : null}
        </h1>
        
        <button 
          onClick={() => setView(view === 'entry' ? 'chart' : 'entry')}
          style={{ justifySelf: 'end', background: 'none', border: 'none', color: '#e8e8f0', cursor: 'pointer', padding: 0 }}
        >
          <ChartPie size={24} />
        </button>
      </div> : 
        <div className="topbar">
          <button 
            onClick={goBack}
            style={{ justifySelf: 'start', background: 'none', border: 'none', color: '#e8e8f0', cursor: 'pointer', padding: 0 }}
          >
            <ChevronLeft size={24} />
          </button>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#e8e8f0' }}>
            {view === 'history' ? 'History' : view === 'edit' ? 'Edit Transaction' : view === 'categories' ? 'Categories' : view === 'createCategory' ? 'Create Category' : view === 'editCategory' ? 'Edit Category' : null}
          </h1>
        </div>
      }
    </div>
  );
};

export default Header;
