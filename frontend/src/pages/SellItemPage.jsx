import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from '../components/items/StepIndicator';
import ImageUploadZone from '../components/items/ImageUploadZone';
import { createItem } from '../services/itemService';
import styles from './SellItemPage.module.css';

const categories = [
  'Books',
  'Electronics',
  'Lab Equipment',
  'Clothing & Uniforms',
  'Sports & Fitness',
  'Services & Tutoring',
  'Other',
];

const conditionOptions = ['Brand New', 'Like New', 'Good', 'Fair', 'Poor'];

const statusColors = {
  Available: styles.availableStatus,
  Reserved: styles.reservedStatus,
};

function SellItemPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: '',
    condition: '',
    description: '',
    price: '',
    status: 'Available',
    primaryImage: null,
    additionalImages: [null, null, null],
    confirm: false,
  });
  const [errors, setErrors] = useState({});

  const descriptionCount = form.description.length;

  const getFirstErrorId = (errorMap) => Object.keys(errorMap)[0] || null;

  const scrollToField = (fieldId) => {
    if (!fieldId) {
      return;
    }
    const node = document.getElementById(fieldId);
    if (node) {
      node.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const input = node.querySelector('input, textarea, select, button');
      input?.focus();
    }
  };

  const validateStep1 = () => {
    const nextErrors = {};

    if (!form.title.trim() || form.title.trim().length < 5 || form.title.trim().length > 100) {
      nextErrors.title = 'Title must be between 5 and 100 characters';
    }

    if (!form.category) {
      nextErrors.category = 'Please select a category';
    }

    if (!form.condition) {
      nextErrors.condition = 'Please select item condition';
    }

    if (!form.description.trim() || form.description.trim().length < 20) {
      nextErrors.description = 'Description must be at least 20 characters';
    }

    if (form.description.length > 500) {
      nextErrors.description = 'Description must be at least 20 characters';
    }

    const numericPrice = Number(form.price);
    if (!form.price || Number.isNaN(numericPrice) || numericPrice <= 0 || numericPrice > 500000) {
      nextErrors.price = 'Please enter a valid price';
    }

    setErrors(nextErrors);
    const first = getFirstErrorId(nextErrors);
    scrollToField(first);
    return Object.keys(nextErrors).length === 0;
  };

  const validateStep2 = () => {
    const nextErrors = {};
    if (!form.primaryImage) {
      nextErrors.primaryImage = 'Please upload at least one clear image of your item';
    }

    setErrors(nextErrors);
    const first = getFirstErrorId(nextErrors);
    scrollToField(first);
    return Object.keys(nextErrors).length === 0;
  };

  const validateStep3 = () => {
    const nextErrors = {};
    if (!form.confirm) {
      nextErrors.confirm = 'You must confirm before publishing';
    }

    setErrors(nextErrors);
    const first = getFirstErrorId(nextErrors);
    scrollToField(first);
    return Object.keys(nextErrors).length === 0;
  };

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const updateAdditionalImage = (index, file, error = '') => {
    setForm((prev) => {
      const next = [...prev.additionalImages];
      next[index] = file;
      return { ...prev, additionalImages: next };
    });
    setErrors((prev) => ({ ...prev, [`additional_${index}`]: error }));
  };

  const isValidField = (fieldName, hasValue) => hasValue && !errors[fieldName];

  const previewImages = useMemo(() => {
    const items = [];
    if (form.primaryImage) {
      items.push(form.primaryImage);
    }
    form.additionalImages.forEach((img) => {
      if (img) {
        items.push(img);
      }
    });
    return items;
  }, [form.primaryImage, form.additionalImages]);

  const handleSubmit = async () => {
    if (!validateStep3()) {
      return;
    }

    const payload = new FormData();
    payload.append('title', form.title.trim());
    payload.append('category', form.category);
    payload.append('condition', form.condition);
    payload.append('description', form.description.trim());
    payload.append('price', String(form.price));
    payload.append('status', form.status);

    if (form.primaryImage) {
      payload.append('images', form.primaryImage);
    }

    form.additionalImages.forEach((image) => {
      if (image) {
        payload.append('images', image);
      }
    });

    try {
      setSubmitting(true);
      const created = await createItem(payload);
      navigate(`/items/poster/${created._id}`, { state: { item: created } });
    } catch (error) {
      const responseData = error?.response?.data;
      const parsedMessage =
        (typeof responseData === 'string' ? responseData : responseData?.message) ||
        error?.message ||
        'Failed to publish listing. Please try again.';

      setErrors({
        submit: parsedMessage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Sell My Item</h1>
        <StepIndicator currentStep={step} />

        {step === 1 && (
          <section className={styles.section}>
            <div id="title" className={styles.field}>
              <label className={styles.label}>Item Title</label>
              <input
                type="text"
                placeholder="e.g. Thermodynamics Textbook 8th Edition"
                value={form.title}
                onChange={(event) => updateField('title', event.target.value)}
                className={[styles.input, errors.title ? styles.inputError : '', isValidField('title', form.title.trim().length >= 5) ? styles.inputValid : ''].join(' ')}
              />
              {errors.title && <p className={styles.error}>{errors.title}</p>}
            </div>

            <div id="category" className={styles.field}>
              <label className={styles.label}>Category</label>
              <select
                value={form.category}
                onChange={(event) => updateField('category', event.target.value)}
                className={[styles.input, errors.category ? styles.inputError : '', isValidField('category', Boolean(form.category)) ? styles.inputValid : ''].join(' ')}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && <p className={styles.error}>{errors.category}</p>}
            </div>

            <div id="condition" className={styles.field}>
              <label className={styles.label}>Condition</label>
              <div className={styles.pillRow}>
                {conditionOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={[
                      styles.pill,
                      form.condition === option ? styles.pillSelected : '',
                    ].join(' ')}
                    onClick={() => updateField('condition', option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {errors.condition && <p className={styles.error}>{errors.condition}</p>}
            </div>

            <div id="description" className={styles.field}>
              <label className={styles.label}>Description</label>
              <textarea
                rows={4}
                placeholder="Describe your item - edition, any damage, reason for selling, what's included..."
                value={form.description}
                onChange={(event) => updateField('description', event.target.value)}
                className={[styles.textarea, errors.description ? styles.inputError : '', isValidField('description', form.description.trim().length >= 20 && form.description.length <= 500) ? styles.inputValid : ''].join(' ')}
              />
              <div className={styles.countRow}>{descriptionCount} / 500</div>
              {errors.description && <p className={styles.error}>{errors.description}</p>}
            </div>

            <div id="price" className={styles.field}>
              <label className={styles.label}>Price (LKR)</label>
              <div className={styles.priceWrap}>
                <span className={styles.pricePrefix}>LKR</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.price}
                  onChange={(event) => updateField('price', event.target.value)}
                  className={[styles.priceInput, errors.price ? styles.inputError : '', isValidField('price', Number(form.price) > 0) ? styles.inputValid : ''].join(' ')}
                />
              </div>
              {errors.price && <p className={styles.error}>{errors.price}</p>}
            </div>

            <div id="status" className={styles.field}>
              <label className={styles.label}>Availability Status</label>
              <select
                value={form.status}
                onChange={(event) => updateField('status', event.target.value)}
                className={styles.input}
              >
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
              </select>
            </div>

            <div className={styles.footerRow}>
              <button type="button" className={styles.cancelBtn} onClick={() => navigate('/marketplace')}>
                Cancel
              </button>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => {
                  if (validateStep1()) {
                    setStep(2);
                  }
                }}
              >
                Next &rarr;
              </button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className={styles.section}>
            <div id="primaryImage" className={styles.field}>
              <ImageUploadZone
                label="Primary Image"
                file={form.primaryImage}
                error={errors.primaryImage}
                onFileChange={(file, error) => {
                  updateField('primaryImage', file);
                  setErrors((prev) => ({ ...prev, primaryImage: error }));
                }}
                onRemove={() => updateField('primaryImage', null)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Additional Photos (optional)</label>
              <div className={styles.additionalGrid}>
                {[0, 1, 2].map((index) => (
                  <div key={index} id={`additional_${index}`}>
                    <ImageUploadZone
                      compact
                      file={form.additionalImages[index]}
                      error={errors[`additional_${index}`]}
                      onFileChange={(file, error) => updateAdditionalImage(index, file, error)}
                      onRemove={() => updateAdditionalImage(index, null, '')}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.footerRow}>
              <button type="button" className={styles.outlineBtn} onClick={() => setStep(1)}>
                &larr; Back
              </button>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => {
                  if (validateStep2()) {
                    setStep(3);
                  }
                }}
              >
                Next &rarr;
              </button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className={styles.section}>
            <div className={styles.summaryCard}>
              <h2 className={styles.summaryTitle}>{form.title}</h2>
              <div className={styles.badgeRow}>
                <span className={styles.navyBadge}>{form.category}</span>
                <span className={styles.navyBadge}>{form.condition}</span>
              </div>
              <p className={styles.summaryText}>{form.description}</p>
              <p className={styles.priceLarge}>LKR {Number(form.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              <span className={[styles.statusBadge, statusColors[form.status] || styles.availableStatus].join(' ')}>
                {form.status}
              </span>
              <div className={styles.thumbRow}>
                {previewImages.map((file, index) => (
                  <img key={`${file.name}-${index}`} src={URL.createObjectURL(file)} alt="uploaded" className={styles.thumb} />
                ))}
              </div>
            </div>

            <div id="confirm" className={styles.confirmRow}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={form.confirm}
                  onChange={(event) => updateField('confirm', event.target.checked)}
                />
                I confirm this item belongs to me and the information provided is accurate.
              </label>
              {errors.confirm && <p className={styles.error}>{errors.confirm}</p>}
            </div>

            {errors.submit && <p className={styles.error}>{errors.submit}</p>}

            <div className={styles.footerRow}>
              <button type="button" className={styles.outlineBtn} onClick={() => setStep(1)}>
                &larr; Edit Details
              </button>
              <button type="button" className={styles.primaryBtn} onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Publishing...' : 'Publish Listing & Generate Poster'}
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default SellItemPage;
