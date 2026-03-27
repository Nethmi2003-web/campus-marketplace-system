import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteItem, getItemById, updateItem } from '../services/itemService';
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

const readCurrentUser = () => {
  const studentRaw = localStorage.getItem('std_userInfo');
  if (studentRaw) {
    try {
      return JSON.parse(studentRaw);
    } catch (error) {
      return null;
    }
  }

  const adminRaw = localStorage.getItem('admin_userInfo');
  if (adminRaw) {
    try {
      return JSON.parse(adminRaw);
    } catch (error) {
      return null;
    }
  }

  return null;
};

function EditItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: categoryOptions[0],
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  const newFilePreviews = useMemo(() => newFiles.map((file) => URL.createObjectURL(file)), [newFiles]);

  const loadItem = useCallback(async () => {
    try {
      setLoading(true);
      const item = await getItemById(id);
      const user = readCurrentUser();

      if (!user || String(user._id) !== String(item?.seller?._id)) {
        toast.error('You can only edit your own listings');
        navigate('/marketplace');
        return;
      }

      setForm({
        title: item.title || '',
        description: item.description || '',
        price: item.price || '',
        category: item.category || categoryOptions[0],
      });
      setExistingImages(Array.isArray(item.images) ? item.images : []);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load listing');
      navigate('/marketplace');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadItem();
  }, [loadItem]);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    setNewFiles(Array.from(event.target.files || []));
  };

  const removeExistingImage = (url) => {
    setExistingImages((prev) => prev.filter((entry) => entry !== url));
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

  const handleSave = async (event) => {
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
    payload.append('existingImages', JSON.stringify(existingImages));

    newFiles.forEach((file) => {
      payload.append('images', file);
    });

    try {
      setSubmitting(true);
      await updateItem(id, payload);
      toast.success('Listing updated successfully');
      navigate(`/items/${id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update listing');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this listing?');
    if (!confirmed) {
      return;
    }

    try {
      await deleteItem(id);
      toast.success('Listing deleted');
      navigate('/marketplace');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete listing');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading listing...</div>;
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Edit Listing</h1>
      <form className={styles.formCard} onSubmit={handleSave}>
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

        <label className={styles.label}>Existing Images</label>
        <div className={styles.previewGrid}>
          {existingImages.map((imageUrl) => (
            <div key={imageUrl} className={styles.previewWrap}>
              <img src={imageUrl} alt="Existing item" className={styles.previewImage} />
              <button type="button" className={styles.removeBtn} onClick={() => removeExistingImage(imageUrl)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <label className={styles.label} htmlFor="images">
          Add New Images
        </label>
        <input
          id="images"
          name="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className={styles.input}
        />

        <div className={styles.previewGrid}>
          {newFilePreviews.map((preview, index) => (
            <img key={`${preview}-${index}`} src={preview} alt={`Preview ${index + 1}`} className={styles.previewImage} />
          ))}
        </div>

        <div className={styles.buttonRow}>
          <button type="submit" className={styles.submitBtn} disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" className={styles.deleteBtn} onClick={handleDelete}>
            Delete Listing
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditItemPage;
