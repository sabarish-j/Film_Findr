import React from 'react';
import './Section.css';

export const Section = ({ title, icon: Icon, action, children, id }) => {
  return (
    <section className="section" id={id}>
      <div className="section__header">
        <h2 className="section__title">
          {Icon && <Icon className="section__icon" size={28} />}
          {title}
        </h2>
        {action && <div className="section__action">{action}</div>}
      </div>
      <div className="section__content">{children}</div>
    </section>
  );
};
