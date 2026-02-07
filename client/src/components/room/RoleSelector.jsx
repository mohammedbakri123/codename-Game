import styles from '../../styles/components/RoleSelector.module.css';

function RoleSelector({ selectedRole, onSelectRole }) {
  const roleNames = {
    spymaster: 'قائد',
    operative: 'عميل'
  };

  return (
    <div className={styles['role-selector']}>
      <h3>اختر الدور</h3>
      <div className={styles['role-buttons']}>
        <button
          className={`${styles['role-btn']} ${selectedRole === 'spymaster' ? styles.selected : ''}`}
          onClick={() => onSelectRole('spymaster')}
        >
          {roleNames.spymaster}
        </button>
        <button
          className={`${styles['role-btn']} ${selectedRole === 'operative' ? styles.selected : ''}`}
          onClick={() => onSelectRole('operative')}
        >
          {roleNames.operative}
        </button>
      </div>
    </div>
  );
}

export default RoleSelector;
