// StudyContext.js
import React, { createContext, useState } from 'react';

export const StudyContext = createContext();

export const StudyProvider = ({ children }) => {
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [material, setMaterial] = useState(null);

  return (
    <StudyContext.Provider value={{ studyMaterials, setStudyMaterials, material, setMaterial }}>
      {children}
    </StudyContext.Provider>
  );
};