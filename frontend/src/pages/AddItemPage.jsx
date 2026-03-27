import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createItem } from '../services/itemService';
import styles from './ItemFormPage.module.css';

const categoryOptions = [
  'Books',
  'Electronics',
  'Lab Equipment',
  'Clothing & Uniforms',
  'Sports & Fitness',
  'Services & Tutoring',
  'Other',
];

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/webp'];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

function AddItemPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: categoryOptions[0],
  });
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const previews = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files]);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    const validFiles = [];
    let invalidTypeFound = false;
    let invalidSizeFound = false;

    selectedFiles.forEach((file) => {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        invalidTypeFound = true;
        return;
      }

      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        invalidSizeFound = true;
        return;
      }

      validFiles.push(file);
    });

    if (invalidTypeFound) {
      toast.error('Only JPEG/JPG/WEBP images are allowed.');
    }

    if (invalidSizeFound) {
      toast.error('Each image must be 5MB or less.');
    }

    setFiles(validFiles);
  };

  const validate = () => {
    if (!form.title.trim() || !form.description.trim() || !form.price || !form.category) {
      return 'All fields are required';
    }

    if (Number(form.price) <= 0) {
      return 'Price must be greater than 0';
    }

    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errorMessage = validate();
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    const payload = new FormData();
    payload.append('title', form.title.trim());
    payload.append('description', form.description.trim());
    payload.append('price', String(form.price));
    payload.append('category', form.category);

    files.forEach((file) => {
      payload.append('images', file);
    });

    try {
      setSubmitting(true);
      await createItem(payload);
      toast.success('Listing created successfully');
      navigate('/marketplace');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create listing');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Add New Listing</h1>
      <form className={styles.formCard} onSubmit={handleSubmit}>
        <label className={styles.label} htmlFor="title">
          Title
        </label>
        <input id="title" name="title" value={form.title} onChange={handleInput} className={styles.input} />

        <label className={styles.label} htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleInput}
          className={styles.textarea}
          rows={5}
        />

        <label className={styles.label} htmlFor="price">
          Price (LKR)
        </label>
        <input
          id="price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={handleInput}
          className={styles.input}
        />

        <label className={styles.label} htmlFor="category">
          Category
        </label>
        <select id="category" name="category" value={form.category} onChange={handleInput} className={styles.input}>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <label className={styles.label} htmlFor="images">
          Images
        </label>
        <input
          id="images"
          name="images"
          type="file"
          accept=".jpeg,.jpg,.webp,image/jpeg,image/jpg,image/webp"
          multiple
          onChange={handleFileChange}
          className={styles.input}
        />
        <p className={styles.helperText}>Allowed: JPEG/JPG/WEBP, maximum 5MB per image.</p>

        <div className={styles.previewGrid}>
          {previews.map((preview, index) => (
            <img key={`${preview}-${index}`} src={preview} alt={`Preview ${index + 1}`} className={styles.previewImage} />
          ))}
        </div>

        <button type="submit" className={styles.submitBtn} disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
}

export default AddItemPage;
