import React from 'react';
import { useForm } from 'react-hook-form';

const SDPropertiesForm = ({ sdProperties, onUpdate }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = data => {
    // Update the sdProperties object with the new values
    const updatedProperties = { ...(sdProperties || {}), ...data };
    
    // Call the onUpdate function passed as a prop
    onUpdate(updatedProperties);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '10px' }}>
      <label style={{ display: 'block', marginTop: '10px' }}>
        <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Frame:
        </span>
        <input {...register('frame')} defaultValue={sdProperties?.frame || ''} />
      </label>
      <label style={{ display: 'block', marginTop: '10px' }}>
        <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Background Color:
        </span>
        <input {...register('backgroundColor')} defaultValue={sdProperties?.backgroundColor || ''} />
      </label>
      <label style={{ display: 'block', marginTop: '10px' }}>
        <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Corner Radius:
        </span>
        <input {...register('cornerRadius')} defaultValue={sdProperties?.cornerRadius || ''} />
      </label>
      <label style={{ display: 'block', marginTop: '10px' }}>
        <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Border:
        </span>
        <input {...register('border')} defaultValue={sdProperties?.border || ''} />
      </label>
      <label style={{ display: 'block', marginTop: '10px' }}>
        <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Padding:
        </span>
        <input {...register('padding')} defaultValue={sdProperties?.padding || ''} />
      </label>
      <button type="submit">Update</button>
    </form>
  );
}

export default SDPropertiesForm;
