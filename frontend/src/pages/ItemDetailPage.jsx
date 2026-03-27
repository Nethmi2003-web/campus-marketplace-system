import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Shield, ShoppingCart, Heart, MessageCircle, Star } from 'lucide-react';
import { getItemById, getSimilarItems } from '../services/itemService';
import styles from './ItemDetailPage.module.css';

const placeholderImage =
  'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=900&q=80';

const mockReviews = [
  {
    id: 1,
    buyerName: 'Kasun Perera',
    buyerInitials: 'KP',
    rating: 5,
    date: '2026-03-20',
    comment: 'Excellent seller! The item was exactly as described. Very fast response and smooth transaction.',
    itemBought: 'Electronics',
    helpful: 4,
  },
  {
    id: 2,
    buyerName: 'Amaya Silva',
    buyerInitials: 'AS',
    rating: 4,
    date: '2026-03-15',
    comment: 'Good condition item. Seller was friendly and cooperative. Would recommend.',
    itemBought: 'Books',
    helpful: 2,
  },
  {
    id: 3,
    buyerName: 'Thilina Fernando',
    buyerInitials: 'TF',
    rating: 4,
    date: '2026-03-10',
    comment: 'Item was as described. Met at campus library, very convenient. Happy with the purchase.',
    itemBought: 'Lab Equipment',
    helpful: 1,
  },
];

const getNormalizedStatus = (status = '') => {
  const lowered = String(status || '').toLowerCase();
  if (lowered === 'available') return 'Available';
  if (lowered === 'reserved') return 'Reserved';
  if (lowered === 'sold') return 'Sold';
  return 'Available';
};

const getConditionClass = (condition = '') => {
  const lowered = String(condition || '').toLowerCase();
  if (lowered === 'brand new') return styles.conditionBrandNew;
  if (lowered === 'like new') return styles.conditionLikeNew;
  if (lowered === 'good') return styles.conditionGood;
  if (lowered === 'fair') return styles.conditionFair;
  return styles.conditionPoor;
};

const getStatusClass = (status = '') => {
  if (status === 'Available') return styles.statusAvailable;
  if (status === 'Reserved') return styles.statusReserved;
  return styles.statusSold;
};

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown date';
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
};

function SimilarItems({ item, similarItems, navigate }) {
  if (!Array.isArray(similarItems) || similarItems.length === 0) {
    return null;
  }

  return (
    <section className={styles.sectionWrap}>
      <div className={styles.sectionHeaderRow}>
        <div>
          <h2 className={styles.sectionHeading}>Similar Items</h2>
          <p className={styles.sectionSub}>More {item.category} items from campus</p>
        </div>
        <button
          type="button"
          className={styles.sectionLink}
          onClick={() => navigate('/marketplace', { state: { category: item.category } })}
        >
          Browse All {item.category}
        </button>
      </div>

      <div className={styles.similarGrid}>
        {similarItems.map((similar) => (
          <article
            key={similar._id}
            className={styles.similarCard}
            onClick={() => navigate(`/items/${similar._id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate(`/items/${similar._id}`);
              }
            }}
          >
            <img
              src={(similar.images && similar.images[0]) || placeholderImage}
              alt={similar.title}
              className={styles.similarImage}
            />
            <div className={styles.similarContent}>
              <span className={styles.similarBadge}>{similar.category}</span>
              <p className={styles.similarTitle}>{similar.title}</p>
              <p className={styles.similarCondition}>{similar.condition}</p>
              <p className={styles.similarPrice}>LKR {Number(similar.price || 0).toLocaleString()}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ItemNotAvailablePage({ item, similarItems, navigate }) {
  const status = getNormalizedStatus(item.status);
  const isSold = status === 'Sold';

  return (
    <>
      <div className={styles.centerCardWrap}>
        <div className={styles.centerCard}>
          <div className={styles.centerIcon}>{isSold ? '🏷️' : '⏳'}</div>
          <h2 className={styles.centerTitle}>{isSold ? 'This Item Has Been Sold' : 'This Item Is Reserved'}</h2>
          <p className={styles.centerText}>
            {isSold
              ? 'This item found its new owner. Check out similar items below.'
              : 'This item is currently reserved for another buyer. Check back later or browse similar items.'}
          </p>
          <div className={styles.centerActions}>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => navigate('/marketplace', { state: { category: item.category } })}
            >
              {isSold ? `Browse Similar ${item.category} Items` : 'Browse Similar Items'}
            </button>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => navigate('/marketplace')}
            >
              Back to Marketplace
            </button>
          </div>
        </div>
      </div>
      <SimilarItems item={item} similarItems={similarItems} navigate={navigate} />
    </>
  );
}

function buildSellerName(seller) {
  if (!seller) {
    return 'Unknown Seller';
  }

  if (seller.name) {
    return seller.name;
  }

  return `${seller.firstName || ''} ${seller.lastName || ''}`.trim() || seller.email || seller.universityEmail || 'Unknown Seller';
}

function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [showContactBanner, setShowContactBanner] = useState(false);
  const [similarItems, setSimilarItems] = useState([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 2500);
  };

  const loadItem = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getItemById(id);
      const status = getNormalizedStatus(response?.status);

      const normalizedItem = {
        ...response,
        status,
        images: Array.isArray(response?.images) && response.images.length > 0
          ? response.images
          : response?.imageUrl
            ? [response.imageUrl]
            : [placeholderImage],
      };

      setItem(normalizedItem);

      if (normalizedItem.category) {
        const similar = await getSimilarItems(normalizedItem.category, normalizedItem._id);
        setSimilarItems(Array.isArray(similar) ? similar : []);
      } else {
        setSimilarItems([]);
      }

      setActiveImageIndex(0);
    } catch (error) {
      setItem(null);
      setError(error?.response?.status === 404 ? 'not-found' : 'failed');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadItem();
  }, [loadItem]);

  const images = useMemo(() => {
    if (!item?.images || item.images.length === 0) {
      return [placeholderImage];
    }
    return item.images;
  }, [item]);

  const description = item?.description || '';
  const descriptionLong = description.length > 280;
  const descriptionToShow = descriptionExpanded || !descriptionLong ? description : `${description.slice(0, 280)}...`;

  const sellerName = buildSellerName(item?.seller);
  const sellerInitials = sellerName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'SL';

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.breadcrumbBar}>
          <div className={styles.skeletonLineSmall} />
        </div>
        <div className={styles.mainWrap}>
          <div className={styles.mainGrid}>
            <div>
              <div className={styles.skeletonMainImage} />
              <div className={styles.skeletonThumbRow}>
                <div className={styles.skeletonThumb} />
                <div className={styles.skeletonThumb} />
                <div className={styles.skeletonThumb} />
                <div className={styles.skeletonThumb} />
              </div>
              <div className={styles.skeletonTextCard}>
                <div className={styles.skeletonLine} />
                <div className={styles.skeletonLine} />
                <div className={styles.skeletonLineHalf} />
              </div>
            </div>
            <div>
              <div className={styles.skeletonRightCard} />
              <div className={styles.skeletonRightCardSmall} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className={styles.page}>
        <div className={styles.centerCardWrap}>
          <div className={styles.centerCard}>
            <div className={styles.centerIcon}>📦</div>
            <h2 className={styles.centerTitle}>Item Not Found</h2>
            <p className={styles.centerText}>This listing may have been removed or is no longer available.</p>
            <button type="button" className={styles.primaryBtn} onClick={() => navigate('/marketplace')}>
              Back to Marketplace
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (item.status !== 'Available') {
    return <ItemNotAvailablePage item={item} similarItems={similarItems} navigate={navigate} />;
  }

  const nextImage = (current) => (current + 1) % images.length;
  const prevImage = (current) => (current - 1 + images.length) % images.length;

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumbBar}>
        <button type="button" className={styles.breadcrumbLink} onClick={() => navigate('/marketplace')}>
          ← Marketplace
        </button>
        <span className={styles.separator}>/</span>
        <button type="button" className={styles.breadcrumbLink} onClick={() => navigate('/marketplace', { state: { category: item.category } })}>
          {item.category}
        </button>
        <span className={styles.separator}>/</span>
        <span className={styles.breadcrumbCurrent}>{item.title.length > 40 ? `${item.title.slice(0, 40)}...` : item.title}</span>
      </div>

      <div className={styles.mainWrap}>
        <div className={styles.mainGrid}>
          <div>
            <section className={styles.leftCard}>
              <div className={styles.primaryImageWrap}>
                <img
                  src={images[activeImageIndex]}
                  alt={item.title}
                  className={styles.primaryImage}
                  onClick={() => {
                    setLightboxIndex(activeImageIndex);
                    setLightboxOpen(true);
                  }}
                />

                {images.length > 1 && (
                  <>
                    <button type="button" className={styles.galleryArrowLeft} onClick={() => setActiveImageIndex((prev) => prevImage(prev))}>
                      ‹
                    </button>
                    <button type="button" className={styles.galleryArrowRight} onClick={() => setActiveImageIndex((prev) => nextImage(prev))}>
                      ›
                    </button>
                    <div className={styles.imageCounter}>{activeImageIndex + 1} of {images.length}</div>
                  </>
                )}
              </div>

              <div className={styles.thumbnailStrip}>
                {images.map((imageUrl, index) => (
                  <button
                    key={`${imageUrl}-${index}`}
                    type="button"
                    className={`${styles.thumbnailItem} ${activeImageIndex === index ? styles.thumbnailActive : ''}`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img src={imageUrl} alt={`thumb-${index + 1}`} className={styles.thumbnailImage} />
                  </button>
                ))}
              </div>
            </section>

            <section className={styles.descriptionCard}>
              <div className={styles.descriptionHeader}>
                <h2>Description</h2>
                <span className={styles.fullDetailsTag}>Full Details</span>
              </div>

              <div className={styles.descriptionTextWrap}>
                <p className={styles.descriptionText}>{descriptionToShow}</p>
              </div>

              {descriptionLong && (
                <button
                  type="button"
                  className={styles.readMoreBtn}
                  onClick={() => setDescriptionExpanded((prev) => !prev)}
                >
                  {descriptionExpanded ? 'Show less' : 'Read more'}
                </button>
              )}

              <div className={styles.lightDivider} />

              <h3 className={styles.specHeading}>Item Details</h3>
              <div className={styles.specRow}><span>Category</span><span className={styles.orangePill}>{item.category}</span></div>
              <div className={styles.specRow}><span>Condition</span><span className={`${styles.condBadge} ${getConditionClass(item.condition)}`}>{item.condition}</span></div>
              <div className={styles.specRow}><span>Availability</span><span className={`${styles.statusPill} ${getStatusClass(item.status)}`}>{item.status}</span></div>
              <div className={styles.specRow}><span>Listed on</span><span>{formatDate(item.createdAt)}</span></div>
              <div className={styles.specRow}><span>Item ID</span><span className={styles.itemId}>#{String(item._id).slice(-8)}</span></div>
            </section>
          </div>

          <div className={styles.rightSticky}>
            <section className={styles.priceCard}>
              <div className={styles.priceTopRow}>
                <h1 className={styles.itemTitle}>{item.title}</h1>
                <span className={`${styles.statusPill} ${getStatusClass(item.status)}`}>{item.status}</span>
              </div>

              <div className={styles.badgeRow}>
                <span className={styles.categoryDark}>{item.category}</span>
                <span className={styles.conditionLight}>{item.condition}</span>
              </div>

              <div className={styles.lightDivider} />

              <div className={styles.priceRow}>
                <span className={styles.lkrLabel}>LKR</span>
                <span className={styles.priceLarge}>{Number(item.price || 0).toLocaleString()}</span>
              </div>

              {['Brand New', 'Like New'].includes(item.condition) && (
                <span className={styles.goodConditionTag}>✓ Great condition</span>
              )}

              <div className={styles.availabilityRow}>
                <span className={styles.pulseDot} />
                <span className={styles.availableNow}>Available now</span>
              </div>
            </section>

            <section className={styles.actionsCard}>
              <button
                type="button"
                className={`${styles.actionBtnPrimary} ${addedToCart ? styles.actionBtnSuccess : ''}`}
                onClick={() => {
                  setAddedToCart(true);
                  showToast('Added to cart!');
                  setTimeout(() => setAddedToCart(false), 2500);
                }}
              >
                {addedToCart ? '✓ Added to Cart!' : <><ShoppingCart size={20} /> Add to Cart</>}
              </button>

              <button
                type="button"
                className={`${styles.actionBtnWishlist} ${wishlisted ? styles.actionBtnWishlisted : ''}`}
                onClick={() => setWishlisted((prev) => !prev)}
              >
                <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
                {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
              </button>

              <button
                type="button"
                className={styles.actionBtnMessage}
                onClick={() => setShowContactBanner((prev) => !prev)}
              >
                <MessageCircle size={18} /> Message Seller
              </button>

              {showContactBanner && (
                <div className={styles.contactBanner}>
                  💬 Messaging feature coming soon! You can reach the seller at: {item?.seller?.email || 'N/A'}
                </div>
              )}
            </section>

            <section className={styles.sellerCard}>
              <p className={styles.sellerLabel}>SELLER</p>
              <div className={styles.sellerRow}>
                <div className={styles.avatarWrap}>
                  {item?.seller?.profileImage ? (
                    <img src={item.seller.profileImage} alt={sellerName} className={styles.avatarImage} />
                  ) : (
                    <span>{sellerInitials}</span>
                  )}
                </div>
                <div>
                  <p className={styles.sellerName}>{sellerName}</p>
                  <p className={styles.memberSince}>Member since {new Date(item?.seller?.createdAt || Date.now()).getFullYear()}</p>
                </div>
              </div>

              <div className={styles.trustRow}>
                <div className={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} className={star <= 4 ? styles.starFilled : styles.starEmpty} fill={star <= 4 ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <span className={styles.ratingText}>4.0</span>
                <span className={styles.reviewsCount}>(12 reviews)</span>
              </div>

              <button type="button" className={styles.profileLink}>View Profile</button>
            </section>

            <section className={styles.safetyCard}>
              <div className={styles.safetyHeader}><Shield size={20} /> <span>Buy Safely</span></div>
              <ul className={styles.tipsList}>
                <li>✓ Meet in a public campus location</li>
                <li>✓ Inspect the item before making payment</li>
                <li>✓ Use official campus payment methods</li>
                <li>✓ Report suspicious activity immediately</li>
              </ul>
            </section>
          </div>
        </div>
      </div>

      <section className={styles.sectionWrap}>
        <div className={styles.reviewsCard}>
          <div className={styles.reviewsHeader}>
            <div>
              <h2 className={styles.sectionHeading}>Reviews & Ratings</h2>
              <p className={styles.sectionSub}>What buyers say about this seller</p>
            </div>
            <div className={styles.ratingSummary}>
              <p className={styles.summaryScore}>4.0</p>
              <div className={styles.summaryStars}>★★★★☆</div>
              <p className={styles.summaryCount}>(12 ratings)</p>
            </div>
          </div>

          <div className={styles.breakdownWrap}>
            {[
              { star: 5, pct: 60, count: 8 },
              { star: 4, pct: 25, count: 3 },
              { star: 3, pct: 10, count: 1 },
              { star: 2, pct: 3, count: 0 },
              { star: 1, pct: 2, count: 0 },
            ].map((row) => (
              <div key={row.star} className={styles.breakdownRow}>
                <span className={styles.starLabel}>{row.star} ★</span>
                <div className={styles.progressTrack}><div className={styles.progressFill} style={{ width: `${row.pct}%` }} /></div>
                <span className={styles.countLabel}>{row.count}</span>
              </div>
            ))}
          </div>

          <div className={styles.reviewList}>
            {mockReviews.map((review) => (
              <article key={review.id} className={styles.reviewCard}>
                <div className={styles.reviewTop}>
                  <div className={styles.reviewUserWrap}>
                    <div className={styles.reviewAvatar}>{review.buyerInitials}</div>
                    <div>
                      <p className={styles.reviewName}>{review.buyerName}</p>
                      <span className={styles.verifiedBadge}>Verified Buyer</span>
                    </div>
                  </div>
                  <div className={styles.reviewMeta}>
                    <div className={styles.reviewStars}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                    <p>{new Date(review.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>

                <p className={styles.reviewComment}><span>"</span>{review.comment}</p>

                <div className={styles.reviewFooter}>
                  <span>Category: {review.itemBought}</span>
                  <button type="button" className={styles.helpfulBtn}>Was this helpful? 👍 {review.helpful}</button>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.writeReviewWrap}>
            <h3>Write a Review</h3>
            <p>You can write a review after completing a purchase</p>

            <label className={styles.smallLabel}>Your Rating *</label>
            <div className={styles.rateStarsWrap}>
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (reviewHover || reviewRating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    className={styles.rateStarBtn}
                    onMouseEnter={() => setReviewHover(star)}
                    onMouseLeave={() => setReviewHover(0)}
                    onClick={() => setReviewRating(star)}
                    style={{ color: active ? '#f97316' : '#e5e7eb' }}
                  >
                    ★
                  </button>
                );
              })}
            </div>

            <textarea
              className={styles.reviewTextarea}
              placeholder="Share your experience with this seller and the item condition..."
              rows={4}
              maxLength={500}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
            />
            <div className={styles.reviewCount}>{reviewComment.length} / 500</div>

            <button
              type="button"
              className={styles.primaryBtn}
              disabled={!reviewRating || !reviewComment.trim()}
              onClick={() => {
                showToast('Review submitted! (Feature coming soon)');
                setReviewComment('');
                setReviewRating(0);
              }}
            >
              Submit Review
            </button>
          </div>
        </div>
      </section>

      <SimilarItems item={item} similarItems={similarItems} navigate={navigate} />

      {lightboxOpen && (
        <div className={styles.lightboxOverlay} onClick={() => setLightboxOpen(false)} role="presentation">
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()} role="presentation">
            <button type="button" className={styles.lightboxClose} onClick={() => setLightboxOpen(false)}>×</button>
            {images.length > 1 && (
              <>
                <button type="button" className={styles.lightboxArrowLeft} onClick={() => setLightboxIndex((prev) => prevImage(prev))}>‹</button>
                <button type="button" className={styles.lightboxArrowRight} onClick={() => setLightboxIndex((prev) => nextImage(prev))}>›</button>
              </>
            )}
            <img src={images[lightboxIndex]} alt={`lightbox-${lightboxIndex + 1}`} className={styles.lightboxImage} />
            <div className={styles.lightboxCounter}>{lightboxIndex + 1} of {images.length}</div>
          </div>
        </div>
      )}

      {toast && <div className={styles.inlineToast}>{toast}</div>}
    </div>
  );
}

export default ItemDetailPage;
