

import React from 'react';
import { useFela } from 'react-fela';
import WarningIcn from '../../../Icons/WarningIcn';
import { __ } from '../../../Utils/i18nwrap';

interface EmptyStateProps {
  title?: string;
  description?: string;
  note?: string;
  iconSize?: number;
}

const EmptyFieldState: React.FC<EmptyStateProps> = ({
  title = __('No fields available'),
  description = __('You haven’t added any fields to this form or step yet.'),
  note = __('Please add fields from the Form Fields panel.'),
  iconSize = 30,
}) => {

  const { css } = useFela();
  return (
    <div className={css(styles.emptyStateWrapper)}>
      <div className={css(styles.emptyIcon)}>
        <WarningIcn size={iconSize} />
      </div>

      <h3 className={css(styles.emptyStateTitle)}>
        {title}
      </h3>

      <div className={css(styles.emptyStateDescription)}>
        {description}
        <div className={css(styles.emptyNote)}>
          {note}
        </div>
      </div>
    </div>
  );
};

export default EmptyFieldState

// Styles
const styles = {

  emptyStateWrapper: {
    ta: 'center',
    p: 20,
    cr: '#666',
    fs: 14,
  },
  emptyStateDescription: {
    mt: 5,
    cr: '#999',
    fs: 12,
  },
  emptyIcon: {
    mb: 10,
  },
  emptyStateTitle: {
    fs: 18,
    fw: 'var(--bf-font-semibold)',
    color: '#4b5563',
    mb: 8,
  },
  emptyNote: {
    fs: 12,
    mt: 5,
    cr: '#999',
  },
};
