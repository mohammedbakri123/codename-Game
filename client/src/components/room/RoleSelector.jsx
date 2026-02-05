import '../../styles/components/RoleSelector.css';

function RoleSelector({ selectedRole, onSelectRole }) {
  const roleNames = {
    spymaster: 'قائد',
    operative: 'عميل'
  };

  return (
    <div className="role-selector">
      <h3>اختر الدور</h3>
      <div className="role-buttons">
        <button
          className={`role-btn ${selectedRole === 'spymaster' ? 'selected' : ''}`}
          onClick={() => onSelectRole('spymaster')}
        >
          {roleNames.spymaster}
        </button>
        <button
          className={`role-btn ${selectedRole === 'operative' ? 'selected' : ''}`}
          onClick={() => onSelectRole('operative')}
        >
          {roleNames.operative}
        </button>
      </div>
    </div>
  );
}

export default RoleSelector;
