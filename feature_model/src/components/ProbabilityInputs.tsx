import React, { useState } from 'react';

const categories = ['cm', 'td', 'tp', 'cmtd'];
const configurations = [
  'no-room_no-teacher',
  'no-room_single-teacher',
  'no-room_multi-teacher',
  'single-room_no-teacher',
  'single-room_single-teacher',
  'single-room_multi-teacher',
  'multi-room_no-teacher',
  'multi-room_single-teacher',
  'multi-room_multi-teacher'
];

const ProbabilityInputs = ({ isOpen, onRequestClose }) => {
  const [values, setValues] = useState(
    categories.reduce((acc, category) => {
      acc[category] = configurations.reduce((confAcc, config) => {
        confAcc[config] = '';
        return confAcc;
      }, {});
      return acc;
    }, {})
  );

  const handleChange = (category, config, value) => {
    setValues(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [config]: value
      }
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Probability Inputs"

      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)'
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxWidth: '600px'
        }
      }}
    >
            {categories.map(category => (
        <div key={category}>
          <h2>{category.toUpperCase()}</h2>
          {configurations.map(config => (
            <div key={config}>
              <label>
                {config}: 
                <input
                  type="number"
                  value={values[category][config]}
                  onChange={e => handleChange(category, config, e.target.value)}
                />
              </label>
            </div>
          ))}
        </div>
      ))}
    </Modal>
  );
};

export default ProbabilityInputs;
