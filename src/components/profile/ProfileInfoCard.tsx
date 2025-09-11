import React, { useMemo } from 'react';

interface ProfileInfoCardProps {
  firstName: string;
  lastName: string;
  coordinator: string;
}

const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({ firstName, lastName, coordinator }) => {
  const initials = useMemo(() => {
    const f = firstName?.[0]?.toUpperCase() || '';
    const l = lastName?.[0]?.toUpperCase() || '';
    return `${f}${l}` || 'A';
  }, [firstName, lastName]);

  return (
    <div className="profile-card" role="region" aria-label="Tarjeta de perfil">
      <div className="profile-card__header">
        <div className="profile-avatar" aria-label="Avatar">{initials}</div>
        <div className="profile-identity">
          <div className="profile-name">{firstName} {lastName}</div>
          <div className="profile-role">Asesor</div>
        </div>
      </div>

      <div className="profile-fields">
        <div className="profile-field">
          <span className="label">Nombre</span>
          <span className="value">{firstName}</span>
        </div>
        <div className="profile-field">
          <span className="label">Apellido</span>
          <span className="value">{lastName}</span>
        </div>
        <div className="profile-field">
          <span className="label">Coordinador</span>
          <span className="value">{coordinator}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoCard;
