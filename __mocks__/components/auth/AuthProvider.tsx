import React from 'react';

export const AuthContext = React.createContext(undefined);

export const AuthProvider = ({ children }) => {
  return (
    <AuthContext.Provider value={{ session: { user: { id: 'test-user' } } }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};